import { NextResponse } from "next/server";

import { isLoggedIn } from "@/lib/auth";
import { setupDatabase } from "@/lib/setup-db";

export const dynamic = "force-dynamic";

// Admin-only: creates the tables and seeds initial content. Idempotent.
export async function POST() {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }
  try {
    const r = await setupDatabase();
    const seeded =
      r.seededCourses || r.seededBranches
        ? `Seeded ${r.seededCourses} courses and ${r.seededBranches} branches.`
        : "Tables already had data — nothing re-seeded.";
    return NextResponse.json({ ok: true, message: `✅ Database ready. ${seeded}` });
  } catch (e) {
    return NextResponse.json(
      { ok: false, message: e instanceof Error ? e.message : "Setup failed." },
      { status: 500 },
    );
  }
}
