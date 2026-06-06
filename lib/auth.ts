import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Single-password admin auth. A signed (HMAC) cookie holds the session; there is
// no per-user account. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET in env.

const COOKIE = "abs_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const SECRET = process.env.ADMIN_SESSION_SECRET || "";
const PASSWORD = process.env.ADMIN_PASSWORD || "";

export const authConfigured = Boolean(SECRET && PASSWORD);

function sign(value: string): string {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

/** Timing-safe equality. */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export function checkPassword(input: string): boolean {
  if (!authConfigured) return false;
  return safeEqual(input, PASSWORD);
}

/** Token is `<issuedAt>.<hmac>`. */
function makeToken(): string {
  const issued = String(Math.floor(Date.now() / 1000));
  return `${issued}.${sign(issued)}`;
}

function tokenValid(token: string | undefined): boolean {
  if (!token || !authConfigured) return false;
  const [issued, mac] = token.split(".");
  if (!issued || !mac) return false;
  if (!safeEqual(mac, sign(issued))) return false;
  const age = Math.floor(Date.now() / 1000) - Number(issued);
  return age >= 0 && age <= MAX_AGE;
}

export async function createSession() {
  const store = await cookies();
  store.set(COOKIE, makeToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function isLoggedIn(): Promise<boolean> {
  const store = await cookies();
  return tokenValid(store.get(COOKIE)?.value);
}

/** Use at the top of protected admin server components/actions. */
export async function requireAdmin() {
  if (!(await isLoggedIn())) redirect("/admin/login");
}
