import { NextResponse } from "next/server";

import { isLoggedIn } from "@/lib/auth";
import { dbConfigured, listLeads } from "@/lib/admin-content";

// Lightweight polling endpoint for the admin lead notifier. Returns just the
// newest lead's id + minimal meta so the client can detect new arrivals.
// Guarded by the admin session cookie.
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  if (!dbConfigured) {
    return NextResponse.json({ ok: true, latestId: 0, latest: null });
  }
  const [latest] = await listLeads(1);
  return NextResponse.json({
    ok: true,
    latestId: latest?.id ?? 0,
    latest: latest
      ? {
          id: latest.id,
          name: latest.name,
          course: latest.course,
          city: latest.city,
          type: latest.type,
          createdAt: latest.createdAt,
        }
      : null,
  });
}
