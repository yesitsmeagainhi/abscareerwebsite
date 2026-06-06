import { NextResponse } from "next/server";
import { z } from "zod";

import { saveLead, updateLead } from "@/lib/leads";

export const dynamic = "force-dynamic";

// Step 1: name + phone (required) — captured immediately so the lead is secured.
const createSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid mobile number")
    .max(20)
    .regex(/^[\d+\-\s()]+$/, "Please enter a valid mobile number"),
  company: z.string().optional(), // honeypot
});

// Step 2: optional details, attached to the lead created in step 1.
const updateSchema = z.object({
  id: z.number().int().positive(),
  caste: z.string().trim().max(80).optional(),
  category: z.string().trim().max(60).optional(),
  percentage12: z.string().trim().max(20).optional(),
  location: z.string().trim().max(120).optional(),
});

// Light per-instance throttle.
const hits = new Map<string, { count: number; first: number }>();
function rateLimited(ip: string) {
  const now = Date.now();
  const e = hits.get(ip);
  if (!e || now - e.first > 60_000) {
    hits.set(ip, { count: 1, first: now });
    return false;
  }
  e.count += 1;
  return e.count > 8;
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

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: parsed.error.issues[0]?.message || "Invalid input." },
      { status: 400 },
    );
  }

  const { company, ...fields } = parsed.data;
  if (company && company.length > 0) {
    // Honeypot tripped — pretend success.
    return NextResponse.json({ ok: true, id: null });
  }

  try {
    const sourcePage = req.headers.get("referer") || undefined;
    const id = await saveLead({ ...fields, ip, type: "scholarship", sourcePage }, new Date().toISOString());
    return NextResponse.json({ ok: true, id });
  } catch (e) {
    console.error("[scholarship] create failed", e);
    return NextResponse.json(
      { ok: false, message: "Could not submit right now. Please call us instead." },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Invalid input." }, { status: 400 });
  }

  const { id, location, ...rest } = parsed.data;
  try {
    await updateLead(id, { ...rest, city: location });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[scholarship] update failed", e);
    // Non-fatal: step 1 already saved the lead.
    return NextResponse.json({ ok: true });
  }
}
