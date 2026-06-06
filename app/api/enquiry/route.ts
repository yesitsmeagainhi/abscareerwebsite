import { NextResponse } from "next/server";
import { z } from "zod";

import { saveLead } from "@/lib/leads";

// Never statically optimised — this handles live POSTs.
export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number")
    .max(20)
    .regex(/^[\d+\-\s()]+$/, "Please enter a valid phone number"),
  email: z.string().trim().email().max(120).optional().or(z.literal("")),
  course: z.string().trim().max(120).optional(),
  city: z.string().trim().max(80).optional(),
  sourcePage: z.string().trim().max(200).optional(),
  // Honeypot: real users never see or fill this.
  company: z.string().optional(),
});

// Lightweight in-memory throttle (per server instance). Good enough to blunt
// basic abuse; a persistent store would be needed for multi-instance scale.
const hits = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now - entry.first > WINDOW_MS) {
    hits.set(ip, { count: 1, first: now });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, message: "Too many requests. Please try again in a minute." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: parsed.error.issues[0]?.message || "Invalid input." },
      { status: 400 },
    );
  }

  const { company, ...fields } = parsed.data;

  // Honeypot tripped — pretend success so bots don't learn anything.
  if (company && company.length > 0) {
    return NextResponse.json({ ok: true });
  }

  try {
    await saveLead({ ...fields, ip }, new Date().toISOString());
  } catch (e) {
    console.error("[enquiry] saveLead failed", e);
    return NextResponse.json(
      { ok: false, message: "Could not submit right now. Please call us instead." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
