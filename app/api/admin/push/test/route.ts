import { NextResponse } from "next/server";

import { isLoggedIn } from "@/lib/auth";
import { getSubscriptionCount, sendPushToAll } from "@/lib/push";

export const dynamic = "force-dynamic";

// Sends a test push to all subscribed devices and returns a diagnostic summary
// (how many devices, how many delivered, any errors) so the admin can see
// exactly what's happening.
export async function POST() {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const subscriptions = await getSubscriptionCount();
  const result = await sendPushToAll({
    title: "✅ Test notification",
    body: "If you can see this, Chrome push is working.",
    url: "/admin/leads",
    tag: "abs-test",
  });
  return NextResponse.json({ ok: true, subscriptions, ...result });
}
