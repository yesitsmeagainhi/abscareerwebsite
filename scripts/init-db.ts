// Creates the MySQL tables (idempotent) and seeds courses/branches/settings
// from the built-in seed content if those tables are empty.
//
// Run with:  npm run db:init
// Requires DB_HOST / DB_PORT / DB_USER / DB_PASSWORD / DB_NAME in env (or .env.local).

import { existsSync, readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";

import { fallbackBranches, fallbackCourses, fallbackSettings } from "../lib/fallback";

// --- load .env.local if present (so you don't have to export vars manually) ---
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const envPath = path.join(root, ".env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
if (!DB_HOST || !DB_USER || !DB_NAME) {
  console.error("✗ Missing DB env vars (DB_HOST / DB_USER / DB_NAME). Set them in .env.local.");
  process.exit(1);
}

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

async function main() {
  const conn = await mysql.createConnection({
    host: DB_HOST,
    port: Number(DB_PORT) || 3306,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  });
  console.log(`Connected to ${DB_NAME}@${DB_HOST}`);

  for (const sql of CREATE) await conn.query(sql);
  console.log("✓ Tables ready: courses, branches, site_settings, leads");

  const [[{ c: courseCount }]] = (await conn.query(
    "SELECT COUNT(*) AS c FROM courses",
  )) as [{ c: number }[], unknown];
  if (courseCount === 0) {
    for (let i = 0; i < fallbackCourses.length; i++) {
      const course = fallbackCourses[i];
      await conn.execute("INSERT INTO courses (slug, sort_order, data) VALUES (?, ?, ?)", [
        course.slug,
        i + 1,
        JSON.stringify(course),
      ]);
    }
    console.log(`✓ Seeded ${fallbackCourses.length} courses`);
  } else {
    console.log(`• courses already has ${courseCount} rows — skipped seeding`);
  }

  const [[{ c: branchCount }]] = (await conn.query(
    "SELECT COUNT(*) AS c FROM branches",
  )) as [{ c: number }[], unknown];
  if (branchCount === 0) {
    for (let i = 0; i < fallbackBranches.length; i++) {
      const branch = fallbackBranches[i];
      await conn.execute("INSERT INTO branches (slug, sort_order, data) VALUES (?, ?, ?)", [
        branch.slug,
        i + 1,
        JSON.stringify(branch),
      ]);
    }
    console.log(`✓ Seeded ${fallbackBranches.length} branches`);
  } else {
    console.log(`• branches already has ${branchCount} rows — skipped seeding`);
  }

  await conn.execute(
    "INSERT INTO site_settings (id, data) VALUES (1, ?) ON DUPLICATE KEY UPDATE id = id",
    [JSON.stringify(fallbackSettings)],
  );
  console.log("✓ Site settings ready");

  await conn.end();
  console.log("\nDone. Your database is ready.");
}

main().catch((e) => {
  console.error("✗ init-db failed:", e.message);
  process.exit(1);
});
