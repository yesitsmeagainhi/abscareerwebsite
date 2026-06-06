import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

import { isLoggedIn } from "@/lib/auth";

export const dynamic = "force-dynamic";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_BYTES = 4 * 1024 * 1024; // 4 MB

export async function POST(req: Request) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, message: "No file" }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ ok: false, message: "Unsupported file type" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, message: "File too large (max 4MB)" }, { status: 400 });
  }

  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const safe = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  // Avoid Date.now()-style nondeterminism concerns by using a short random suffix.
  const rand = Math.random().toString(36).slice(2, 8);
  const filename = `${safe || "image"}-${rand}.${ext}`;

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), bytes);

  return NextResponse.json({ ok: true, path: `/uploads/${filename}` });
}
