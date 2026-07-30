import { dbConfigured, getPool, query } from "./db";

// First-party landing-page analytics. Every LP interaction (page view, call
// click, WhatsApp click, form submit) is written to `lp_events`, and the admin
// dashboard reads aggregates from it. No third party involved.

const EVENTS = ["page_view", "call_click", "whatsapp_click", "form_submit"] as const;
export type LpEvent = (typeof EVENTS)[number];
export function isLpEvent(e: string): e is LpEvent {
  return (EVENTS as readonly string[]).includes(e);
}

let tableReady = false;
async function ensureTable() {
  if (tableReady) return;
  await getPool().query(`CREATE TABLE IF NOT EXISTS lp_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    page VARCHAR(120) NOT NULL,
    event VARCHAR(40) NOT NULL,
    location VARCHAR(40) NULL,
    visitor VARCHAR(64) NULL,
    referrer VARCHAR(255) NULL,
    ip VARCHAR(64) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_page_event (page, event),
    INDEX idx_created (created_at)
  )`);
  tableReady = true;
}

export async function recordEvent(e: {
  page: string;
  event: LpEvent;
  location?: string;
  visitor?: string;
  referrer?: string;
  ip?: string;
}): Promise<void> {
  if (!dbConfigured) return;
  await ensureTable();
  await getPool().execute(
    `INSERT INTO lp_events (page, event, location, visitor, referrer, ip) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      e.page.slice(0, 120),
      e.event,
      e.location ? e.location.slice(0, 40) : null,
      e.visitor ? e.visitor.slice(0, 64) : null,
      e.referrer ? e.referrer.slice(0, 255) : null,
      e.ip ? e.ip.slice(0, 64) : null,
    ],
  );
}

// Temporary diagnostic: total rows + breakdown, to confirm events are stored.
export async function getDebugCounts() {
  if (!dbConfigured) return { db: false as const };
  try {
    await ensureTable();
    const total = await query<{ n: number }>(`SELECT COUNT(*) AS n FROM lp_events`);
    const byEvent = await query<{ event: string; n: number }>(
      `SELECT event, COUNT(*) AS n FROM lp_events GROUP BY event`,
    );
    const byPage = await query<{ page: string; n: number }>(
      `SELECT page, COUNT(*) AS n FROM lp_events GROUP BY page`,
    );
    return {
      db: true as const,
      total: Number(total[0]?.n ?? 0),
      byEvent: byEvent.map((r) => ({ event: r.event, n: Number(r.n) })),
      byPage: byPage.map((r) => ({ page: r.page, n: Number(r.n) })),
    };
  } catch (e) {
    return { db: true as const, error: (e as Error)?.message || "query failed" };
  }
}

export type LpStats = {
  page: string;
  totals: {
    visitors: number;
    pageViews: number;
    callClicks: number;
    whatsappClicks: number;
    formSubmits: number;
  };
  byLocation: { event: string; location: string; count: number }[];
  daily: {
    day: string;
    pageViews: number;
    callClicks: number;
    whatsappClicks: number;
    formSubmits: number;
  }[];
  recent: { event: string; location: string | null; createdAt: string }[];
};

export async function getLpStats(page = "gnm-nursing-mumbai", days = 30): Promise<LpStats | null> {
  if (!dbConfigured) return null;
  await ensureTable();

  const totalsRows = await query<{ event: string; c: number }>(
    `SELECT event, COUNT(*) AS c FROM lp_events WHERE page = ? GROUP BY event`,
    [page],
  );
  const count = (ev: string) => Number(totalsRows.find((r) => r.event === ev)?.c ?? 0);
  const visitorsRow = await query<{ v: number }>(
    `SELECT COUNT(DISTINCT visitor) AS v FROM lp_events WHERE page = ?`,
    [page],
  );

  const byLocationRaw = await query<{ event: string; location: string; count: number }>(
    `SELECT event, COALESCE(location, '-') AS location, COUNT(*) AS count
     FROM lp_events
     WHERE page = ? AND event IN ('call_click','whatsapp_click')
     GROUP BY event, location ORDER BY count DESC`,
    [page],
  );

  const dailyRaw = await query<{
    day: string;
    pv: number;
    cc: number;
    wc: number;
    fs: number;
  }>(
    `SELECT DATE(created_at) AS day,
       SUM(event = 'page_view') AS pv,
       SUM(event = 'call_click') AS cc,
       SUM(event = 'whatsapp_click') AS wc,
       SUM(event = 'form_submit') AS fs
     FROM lp_events
     WHERE page = ? AND created_at >= (NOW() - INTERVAL ${Number(days)} DAY)
     GROUP BY DATE(created_at) ORDER BY day DESC`,
    [page],
  );

  const recentRaw = await query<{ event: string; location: string | null; created_at: string }>(
    `SELECT event, location, created_at FROM lp_events WHERE page = ? ORDER BY id DESC LIMIT 25`,
    [page],
  );

  return {
    page,
    totals: {
      visitors: Number(visitorsRow[0]?.v ?? 0),
      pageViews: count("page_view"),
      callClicks: count("call_click"),
      whatsappClicks: count("whatsapp_click"),
      formSubmits: count("form_submit"),
    },
    byLocation: byLocationRaw.map((r) => ({
      event: r.event,
      location: r.location,
      count: Number(r.count),
    })),
    daily: dailyRaw.map((r) => ({
      day: String(r.day).slice(0, 10),
      pageViews: Number(r.pv),
      callClicks: Number(r.cc),
      whatsappClicks: Number(r.wc),
      formSubmits: Number(r.fs),
    })),
    recent: recentRaw.map((r) => ({
      event: r.event,
      location: r.location,
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : "",
    })),
  };
}
