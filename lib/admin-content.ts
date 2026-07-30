import type { ResultSetHeader } from "mysql2";

import { dbConfigured, getPool, query } from "./db";
import type { BlogPost, Branch, Course, Lead, SiteSettings } from "./types";

// Admin CRUD layer (id-based). Unlike lib/content.ts (public, slug-based with
// seed fallback), these operate directly on MySQL and require a DB connection.

export function ensureDb() {
  if (!dbConfigured) {
    throw new Error(
      "Database not connected. Set DB_HOST / DB_USER / DB_PASSWORD / DB_NAME in your environment.",
    );
  }
}

export { dbConfigured };

type DocRow = { id: number; slug: string; sort_order: number; data: unknown };

function parse<T>(d: unknown): T {
  return typeof d === "string" ? (JSON.parse(d) as T) : (d as T);
}

// ---------- Courses ----------
export async function listCoursesAdmin(): Promise<(Course & { id: number })[]> {
  ensureDb();
  const rows = await query<DocRow>(
    "SELECT id, slug, sort_order, data FROM courses ORDER BY sort_order ASC, slug ASC",
  );
  return rows.map((r) => ({ ...parse<Course>(r.data), slug: r.slug, order: r.sort_order, id: r.id }));
}

export async function getCourseById(id: number): Promise<(Course & { id: number }) | null> {
  ensureDb();
  const rows = await query<DocRow>("SELECT id, slug, sort_order, data FROM courses WHERE id = ?", [id]);
  if (!rows.length) return null;
  const r = rows[0];
  return { ...parse<Course>(r.data), slug: r.slug, order: r.sort_order, id: r.id };
}

export async function saveCourse(id: number | null, course: Course): Promise<number> {
  ensureDb();
  const data = JSON.stringify(course);
  const order = course.order ?? 100;
  if (id) {
    await getPool().execute(
      "UPDATE courses SET slug = ?, sort_order = ?, data = ?, updated_at = NOW() WHERE id = ?",
      [course.slug, order, data, id],
    );
    return id;
  }
  const [res] = await getPool().execute<ResultSetHeader>(
    "INSERT INTO courses (slug, sort_order, data) VALUES (?, ?, ?)",
    [course.slug, order, data],
  );
  return res.insertId;
}

export async function deleteCourse(id: number): Promise<void> {
  ensureDb();
  await getPool().execute("DELETE FROM courses WHERE id = ?", [id]);
}

// ---------- Branches ----------
export async function listBranchesAdmin(): Promise<(Branch & { id: number })[]> {
  ensureDb();
  const rows = await query<DocRow>(
    "SELECT id, slug, sort_order, data FROM branches ORDER BY sort_order ASC, slug ASC",
  );
  return rows.map((r) => ({ ...parse<Branch>(r.data), slug: r.slug, order: r.sort_order, id: r.id }));
}

export async function getBranchById(id: number): Promise<(Branch & { id: number }) | null> {
  ensureDb();
  const rows = await query<DocRow>("SELECT id, slug, sort_order, data FROM branches WHERE id = ?", [id]);
  if (!rows.length) return null;
  const r = rows[0];
  return { ...parse<Branch>(r.data), slug: r.slug, order: r.sort_order, id: r.id };
}

export async function saveBranch(id: number | null, branch: Branch): Promise<number> {
  ensureDb();
  const data = JSON.stringify(branch);
  const order = branch.order ?? 100;
  if (id) {
    await getPool().execute(
      "UPDATE branches SET slug = ?, sort_order = ?, data = ?, updated_at = NOW() WHERE id = ?",
      [branch.slug, order, data, id],
    );
    return id;
  }
  const [res] = await getPool().execute<ResultSetHeader>(
    "INSERT INTO branches (slug, sort_order, data) VALUES (?, ?, ?)",
    [branch.slug, order, data],
  );
  return res.insertId;
}

export async function deleteBranch(id: number): Promise<void> {
  ensureDb();
  await getPool().execute("DELETE FROM branches WHERE id = ?", [id]);
}

// ---------- Blog posts ----------
export async function listBlogAdmin(): Promise<(BlogPost & { id: number })[]> {
  ensureDb();
  const rows = await query<DocRow>(
    "SELECT id, slug, sort_order, data FROM blog_posts ORDER BY id DESC",
  );
  return rows.map((r) => ({ ...parse<BlogPost>(r.data), slug: r.slug, id: r.id }));
}

export async function getBlogById(id: number): Promise<(BlogPost & { id: number }) | null> {
  ensureDb();
  const rows = await query<DocRow>("SELECT id, slug, sort_order, data FROM blog_posts WHERE id = ?", [
    id,
  ]);
  if (!rows.length) return null;
  const r = rows[0];
  return { ...parse<BlogPost>(r.data), slug: r.slug, id: r.id };
}

export async function saveBlogPost(id: number | null, post: BlogPost): Promise<number> {
  ensureDb();
  const data = JSON.stringify(post);
  if (id) {
    await getPool().execute(
      "UPDATE blog_posts SET slug = ?, data = ?, updated_at = NOW() WHERE id = ?",
      [post.slug, data, id],
    );
    return id;
  }
  const [res] = await getPool().execute<ResultSetHeader>(
    "INSERT INTO blog_posts (slug, sort_order, data) VALUES (?, 100, ?)",
    [post.slug, data],
  );
  return res.insertId;
}

export async function deleteBlogPost(id: number): Promise<void> {
  ensureDb();
  await getPool().execute("DELETE FROM blog_posts WHERE id = ?", [id]);
}

// ---------- Site settings (single row, id = 1) ----------
export async function saveSettings(settings: SiteSettings): Promise<void> {
  ensureDb();
  const data = JSON.stringify(settings);
  await getPool().execute(
    "INSERT INTO site_settings (id, data) VALUES (1, ?) ON DUPLICATE KEY UPDATE data = VALUES(data), updated_at = NOW()",
    [data],
  );
}

// ---------- Leads ----------
export async function listLeads(limit = 500): Promise<Lead[]> {
  ensureDb();
  const rows = await query<{
    id: number;
    created_at: string;
    type: string;
    name: string;
    phone: string;
    email: string;
    course: string;
    city: string;
    caste: string;
    category: string;
    percentage12: string;
    source_page: string;
  }>(
    `SELECT id, created_at, type, name, phone, email, course, city, caste, category, percentage12, source_page
     FROM leads ORDER BY id DESC LIMIT ${Number(limit)}`,
  );
  return rows.map((r) => ({
    id: r.id,
    createdAt: r.created_at ? new Date(r.created_at).toISOString() : undefined,
    type: r.type,
    name: r.name,
    phone: r.phone,
    email: r.email,
    course: r.course,
    city: r.city,
    caste: r.caste,
    category: r.category,
    percentage12: r.percentage12,
    sourcePage: r.source_page,
  }));
}

/** Delete a single lead by id. */
export async function deleteLead(id: number): Promise<void> {
  ensureDb();
  await getPool().execute("DELETE FROM leads WHERE id = ?", [id]);
}
