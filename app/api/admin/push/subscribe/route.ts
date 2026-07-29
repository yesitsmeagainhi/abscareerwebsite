import { NextResponse } from "next/server";

import { isLoggedIn } from "@/lib/auth";
import { saveSubscription, type PushSub } from "@/lib/push";

export const dynamic = "force-dynamic";

// Stores a browser push subscription for the logged-in admin's device.
export async function POST(req: Request) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  let body: Partial<PushSub> | null = null;
  try {
    body = (await req.json()) as Partial<PushSub>;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request" }, { status: 400 });
  }
  if (!body?.endpoint || !body?.keys?.p256dh || !body?.keys?.auth) {
    return NextResponse.json({ ok: false, message: "Invalid subscription" }, { status: 400 });
  }
  try {
    await saveSubscription(body as PushSub);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[push] subscribe failed", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
