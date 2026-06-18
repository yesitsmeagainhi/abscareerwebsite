import { dbConfigured, getPool, query } from "./db";
import { fallbackBranches, fallbackCourses, fallbackSettings } from "./fallback";

// Runtime DB setup — same as scripts/init-db.ts but callable from the app, so it
// can be triggered once from the admin panel on hosts without terminal access.
// Idempotent: CREATE IF NOT EXISTS, and seeds only when a table is empty.

const CREATE = [
  `CREATE TABLE IF NOT EXISTS courses (
     id INT AUTO_INCREMENT PRIMARY KEY,
     slug VARCHAR(191) NOT NULL UNIQUE,
     sort_order INT NOT NULL DEFAULT 100,
     data JSON NOT NULL,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS branches (
     id INT AUTO_INCREMENT PRIMARY KEY,
     slug VARCHAR(191) NOT NULL UNIQUE,
     sort_order INT NOT NULL DEFAULT 100,
     data JSON NOT NULL,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS site_settings (
     id INT PRIMARY KEY,
     data JSON NOT NULL,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS leads (
     id INT AUTO_INCREMENT PRIMARY KEY,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     type VARCHAR(20) NOT NULL DEFAULT 'enquiry',
     name VARCHAR(120) NOT NULL,
     phone VARCHAR(30) NOT NULL,
     email VARCHAR(160),
     course VARCHAR(160),
     city VARCHAR(120),
     caste VARCHAR(80),
     category VARCHAR(60),
     percentage12 VARCHAR(20),
     source_page VARCHAR(255),
     ip VARCHAR(60)
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
];

export async function setupDatabase(): Promise<{ seededCourses: number; seededBranches: number }> {
  if (!dbConfigured) {
    throw new Error("Database not configured — set DB_HOST / DB_USER / DB_PASSWORD / DB_NAME.");
  }
  const pool = getPool();
  for (const sql of CREATE) await pool.query(sql);

  let seededCourses = 0;
  const courseCount = await query<{ c: number }>("SELECT COUNT(*) AS c FROM courses");
  if ((courseCount[0]?.c ?? 0) === 0) {
    for (let i = 0; i < fallbackCourses.length; i++) {
      await pool.execute("INSERT INTO courses (slug, sort_order, data) VALUES (?, ?, ?)", [
        fallbackCourses[i].slug,
        i + 1,
        JSON.stringify(fallbackCourses[i]),
      ]);
      seededCourses++;
    }
  }

  let seededBranches = 0;
  const branchCount = await query<{ c: number }>("SELECT COUNT(*) AS c FROM branches");
  if ((branchCount[0]?.c ?? 0) === 0) {
    for (let i = 0; i < fallbackBranches.length; i++) {
      await pool.execute("INSERT INTO branches (slug, sort_order, data) VALUES (?, ?, ?)", [
        fallbackBranches[i].slug,
        i + 1,
        JSON.stringify(fallbackBranches[i]),
      ]);
      seededBranches++;
    }
  }

  await pool.execute(
    "INSERT INTO site_settings (id, data) VALUES (1, ?) ON DUPLICATE KEY UPDATE id = id",
    [JSON.stringify(fallbackSettings)],
  );

  return { seededCourses, seededBranches };
}

/**
 * Force-publish the built-in seed content (lib/fallback.ts) into the database,
 * OVERWRITING the data + sort_order of any course/branch with a matching slug.
 * Unlike setupDatabase(), this updates existing rows — use it to push edited
 * seed content live on a database that was already seeded.
 *
 * Note: this overwrites admin-panel edits for matching slugs and does NOT delete
 * rows whose slug is no longer in the seed (those are left untouched).
 */
export async function syncContent(): Promise<{ courses: number; branches: number }> {
  if (!dbConfigured) {
    throw new Error("Database not configured — set DB_HOST / DB_USER / DB_PASSWORD / DB_NAME.");
  }
  const pool = getPool();
  for (const sql of CREATE) await pool.query(sql);

  for (let i = 0; i < fallbackCourses.length; i++) {
    await pool.execute(
      `INSERT INTO courses (slug, sort_order, data) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order), data = VALUES(data), updated_at = NOW()`,
      [fallbackCourses[i].slug, i + 1, JSON.stringify(fallbackCourses[i])],
    );
  }

  for (let i = 0; i < fallbackBranches.length; i++) {
    await pool.execute(
      `INSERT INTO branches (slug, sort_order, data) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order), data = VALUES(data), updated_at = NOW()`,
      [fallbackBranches[i].slug, i + 1, JSON.stringify(fallbackBranches[i])],
    );
  }

  await pool.execute(
    "INSERT INTO site_settings (id, data) VALUES (1, ?) ON DUPLICATE KEY UPDATE data = VALUES(data), updated_at = NOW()",
    [JSON.stringify(fallbackSettings)],
  );

  return { courses: fallbackCourses.length, branches: fallbackBranches.length };
}
