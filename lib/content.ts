import { dbConfigured, query } from "./db";
import type { Branch, Course, SiteSettings } from "./types";
import { fallbackBranches, fallbackCourses, fallbackSettings } from "./fallback";

// Public content data layer. Reads from MySQL when configured, otherwise (and on
// any error or empty table) falls back to built-in seed content so the site
// always renders. Function names match the old Sanity layer so pages are unchanged.

type Row = { slug?: string; data: unknown; updated_at?: unknown };

// mysql2 usually returns JSON columns already parsed; tolerate string too.
function parseData<T>(data: unknown): T {
  if (typeof data === "string") return JSON.parse(data) as T;
  return data as T;
}

// Turn a DB TIMESTAMP (Date | string) into an ISO string for the `updatedAt` field.
function toIso(v: unknown): string | undefined {
  if (!v) return undefined;
  const d = v instanceof Date ? v : new Date(v as string);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

function rowToCourse(r: Row): Course {
  return { ...(parseData<Course>(r.data)), slug: r.slug!, updatedAt: toIso(r.updated_at) };
}
function rowToBranch(r: Row): Branch {
  return { ...(parseData<Branch>(r.data)), slug: r.slug!, updatedAt: toIso(r.updated_at) };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!dbConfigured) return fallbackSettings;
  try {
    const rows = await query<{ data: unknown }>(
      "SELECT data FROM site_settings WHERE id = 1 LIMIT 1",
    );
    return rows.length ? parseData<SiteSettings>(rows[0].data) : fallbackSettings;
  } catch {
    return fallbackSettings;
  }
}

export async function getCourses(): Promise<Course[]> {
  if (!dbConfigured) return fallbackCourses;
  try {
    const rows = await query<Row>(
      "SELECT slug, data FROM courses ORDER BY sort_order ASC, slug ASC",
    );
    return rows.length ? rows.map(rowToCourse) : fallbackCourses;
  } catch {
    return fallbackCourses;
  }
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  if (dbConfigured) {
    try {
      const rows = await query<Row>(
        "SELECT slug, data, updated_at FROM courses WHERE slug = ? LIMIT 1",
        [slug],
      );
      if (rows.length) return rowToCourse(rows[0]);
    } catch {
      // fall through to seed
    }
  }
  return fallbackCourses.find((c) => c.slug === slug) ?? null;
}

export async function getCourseSlugs(): Promise<string[]> {
  if (dbConfigured) {
    try {
      const rows = await query<{ slug: string }>("SELECT slug FROM courses");
      if (rows.length) return rows.map((r) => r.slug);
    } catch {
      // fall through
    }
  }
  return fallbackCourses.map((c) => c.slug);
}

export async function getBranches(): Promise<Branch[]> {
  if (!dbConfigured) return fallbackBranches;
  try {
    const rows = await query<Row>(
      "SELECT slug, data FROM branches ORDER BY sort_order ASC, slug ASC",
    );
    return rows.length ? rows.map(rowToBranch) : fallbackBranches;
  } catch {
    return fallbackBranches;
  }
}

export async function getBranchBySlug(slug: string): Promise<Branch | null> {
  if (dbConfigured) {
    try {
      const rows = await query<Row>(
        "SELECT slug, data, updated_at FROM branches WHERE slug = ? LIMIT 1",
        [slug],
      );
      if (rows.length) return rowToBranch(rows[0]);
    } catch {
      // fall through
    }
  }
  return fallbackBranches.find((b) => b.slug === slug) ?? null;
}

export async function getBranchSlugs(): Promise<string[]> {
  if (dbConfigured) {
    try {
      const rows = await query<{ slug: string }>("SELECT slug FROM branches");
      if (rows.length) return rows.map((r) => r.slug);
    } catch {
      // fall through
    }
  }
  return fallbackBranches.map((b) => b.slug);
}
