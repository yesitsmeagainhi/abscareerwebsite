import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// Sanity webhook target. Configure the webhook to POST here with
// ?secret=<SANITY_REVALIDATE_SECRET> so staff edits go live without a redeploy.
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");

  if (!process.env.SANITY_REVALIDATE_SECRET || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, message: "Invalid secret" }, { status: 401 });
  }

  let body: { _type?: string; slug?: { current?: string } | string } = {};
  try {
    body = await req.json();
  } catch {
    // Empty/invalid body — fall back to revalidating the core list pages.
  }

  const revalidated: string[] = [];
  const touch = (path: string) => {
    revalidatePath(path);
    revalidated.push(path);
  };

  // Always refresh home + listing pages (cards live there).
  touch("/");
  touch("/courses");
  touch("/branches");

  // Refresh the specific edited document's page if a slug is present.
  const slug =
    typeof body.slug === "string" ? body.slug : body.slug?.current;
  if (slug) {
    if (body._type === "course") touch(`/${slug}`); // flat course URL
    if (body._type === "branch") touch(`/branches/${slug}`);
  }

  return NextResponse.json({ ok: true, revalidated });
}
