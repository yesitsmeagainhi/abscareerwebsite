import { NextResponse } from "next/server";

import { getDebugCounts, isLpEvent, recordEvent } from "@/lib/analytics";

// Public beacon endpoint: the LP posts interaction events here. Validated +
// lightly rate-limited. Referrer/IP are read server-side, not trusted from body.
export const dynamic = "force-dynamic";

const hits = new Map<string, { c: number; t: number }>();
function rateLimited(ip: string) {
  const now = Date.now();
  const e = hits.get(ip);
  if (!e || now - e.t > 10_000) {
    hits.set(ip, { c: 1, t: now });
    return false;
  }
  e.c += 1;
  return e.c > 40; // up to 40 events / 10s / IP
}

// Temporary diagnostic endpoint (no auth) to confirm events are being stored.
export async function GET() {
  return NextResponse.json(await getDebugCounts());
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) return NextResponse.json({ ok: false }, { status: 429 });

  let body: { event?: string; page?: string; location?: string; visitor?: string } | null = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const ev = String(body?.event ?? "");
  if (!isLpEvent(ev)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    await recordEvent({
      page: String(body?.page || "gnm-nursing-mumbai"),
      event: ev,
      location: body?.location ? String(body.location) : undefined,
      visitor: body?.visitor ? String(body.visitor) : undefined,
      referrer: req.headers.get("referer") || undefined,
      ip,
    });
  } catch (e) {
    console.error("[track] record failed", e);
  }
  return NextResponse.json({ ok: true });
}
