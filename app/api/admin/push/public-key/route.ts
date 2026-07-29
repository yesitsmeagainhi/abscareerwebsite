import { NextResponse } from "next/server";

import { isLoggedIn } from "@/lib/auth";
import { getPublicKey } from "@/lib/push";

export const dynamic = "force-dynamic";

// Returns the VAPID public key so the admin browser can subscribe to push.
export async function GET() {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const publicKey = await getPublicKey();
  if (!publicKey) {
    return NextResponse.json({ ok: false, message: "Push unavailable (no database)" }, { status: 503 });
  }
  return NextResponse.json({ ok: true, publicKey });
}
