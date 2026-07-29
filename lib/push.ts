import webpush from "web-push";

import { dbConfigured, getPool, query } from "./db";

// Web Push (real browser/Chrome notifications, delivered even when the admin
// tab is closed). VAPID keys are generated once and stored in MySQL — so there
// are no secrets in the repo and nothing to configure in env. Subscriptions are
// stored per device; dead ones are pruned on send.

let tablesReady = false;
async function ensureTables() {
  if (tablesReady) return;
  const pool = getPool();
  await pool.query(`CREATE TABLE IF NOT EXISTS push_config (
    id TINYINT PRIMARY KEY DEFAULT 1,
    public_key TEXT NOT NULL,
    private_key TEXT NOT NULL,
    subject VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS push_subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    endpoint VARCHAR(500) NOT NULL UNIQUE,
    p256dh VARCHAR(255) NOT NULL,
    auth VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
  tablesReady = true;
}

type Vapid = { publicKey: string; privateKey: string; subject: string };
let cachedVapid: Vapid | null = null;

/** Read the VAPID keypair from the DB, generating + persisting it on first use. */
async function getVapid(): Promise<Vapid | null> {
  if (!dbConfigured) return null;
  if (cachedVapid) return cachedVapid;
  await ensureTables();
  const rows = await query<{ public_key: string; private_key: string; subject: string }>(
    `SELECT public_key, private_key, subject FROM push_config WHERE id = 1`,
  );
  if (rows.length) {
    cachedVapid = {
      publicKey: rows[0].public_key,
      privateKey: rows[0].private_key,
      subject: rows[0].subject,
    };
    return cachedVapid;
  }
  const keys = webpush.generateVAPIDKeys();
  const subject = `mailto:${process.env.LEAD_NOTIFY_EMAIL || "admin@abscareer.com"}`;
  await getPool().execute(
    `INSERT INTO push_config (id, public_key, private_key, subject) VALUES (1, ?, ?, ?)
     ON DUPLICATE KEY UPDATE public_key = VALUES(public_key)`,
    [keys.publicKey, keys.privateKey, subject],
  );
  cachedVapid = { publicKey: keys.publicKey, privateKey: keys.privateKey, subject };
  return cachedVapid;
}

/** The public VAPID key the browser needs to subscribe. */
export async function getPublicKey(): Promise<string | null> {
  const v = await getVapid();
  return v?.publicKey ?? null;
}

export type PushSub = { endpoint: string; keys: { p256dh: string; auth: string } };

export async function saveSubscription(sub: PushSub): Promise<void> {
  if (!dbConfigured) return;
  await ensureTables();
  await getPool().execute(
    `INSERT INTO push_subscriptions (endpoint, p256dh, auth) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE p256dh = VALUES(p256dh), auth = VALUES(auth)`,
    [sub.endpoint, sub.keys.p256dh, sub.keys.auth],
  );
}

type PushPayload = { title: string; body?: string; url?: string; tag?: string };

export type SendResult = { total: number; sent: number; failed: number; errors: string[] };

/** How many devices are currently subscribed. */
export async function getSubscriptionCount(): Promise<number> {
  if (!dbConfigured) return 0;
  await ensureTables();
  const rows = await query<{ n: number }>(`SELECT COUNT(*) AS n FROM push_subscriptions`);
  return Number(rows[0]?.n ?? 0);
}

/** Send a push to every subscribed device; prune expired subscriptions. */
export async function sendPushToAll(payload: PushPayload): Promise<SendResult> {
  const result: SendResult = { total: 0, sent: 0, failed: 0, errors: [] };
  if (!dbConfigured) return result;
  const vapid = await getVapid();
  if (!vapid) {
    result.errors.push("no VAPID keys");
    return result;
  }
  webpush.setVapidDetails(vapid.subject, vapid.publicKey, vapid.privateKey);
  const subs = await query<{ id: number; endpoint: string; p256dh: string; auth: string }>(
    `SELECT id, endpoint, p256dh, auth FROM push_subscriptions`,
  );
  result.total = subs.length;
  if (!subs.length) return result;
  const data = JSON.stringify(payload);
  await Promise.all(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          data,
        );
        result.sent += 1;
      } catch (e) {
        result.failed += 1;
        const code = (e as { statusCode?: number })?.statusCode;
        const msg = (e as { body?: string; message?: string })?.body || (e as Error)?.message || "";
        result.errors.push(`${code ?? "?"}: ${String(msg).slice(0, 120)}`);
        if (code === 404 || code === 410) {
          try {
            await getPool().execute(`DELETE FROM push_subscriptions WHERE id = ?`, [s.id]);
          } catch {
            /* ignore prune failure */
          }
        }
      }
    }),
  );
  return result;
}
