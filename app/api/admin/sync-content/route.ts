import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { isLoggedIn } from "@/lib/auth";
import { syncContent } from "@/lib/setup-db";
import { fallbackBranches, fallbackCourses } from "@/lib/fallback";

export const dynamic = "force-dynamic";

// Admin-only: force-publish the built-in seed content (lib/fallback.ts) into the
// database, overwriting existing course/branch/settings rows, then revalidate the
// affected pages so the changes appear immediately (no redeploy / no hour wait).
export async function POST() {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }
  try {
    const r = await syncContent();

    // Refresh listing pages + every course/branch detail page.
    revalidatePath("/");
    revalidatePath("/courses");
    revalidatePath("/branches");
    for (const c of fallbackCourses) revalidatePath(`/${c.slug}`);
    for (const b of fallbackBranches) revalidatePath(`/branches/${b.slug}`);

    return NextResponse.json({
      ok: true,
      message: `✅ Published ${r.courses} courses and ${r.branches} branches to the live site.`,
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, message: e instanceof Error ? e.message : "Publish failed." },
      { status: 500 },
    );
  }
}
