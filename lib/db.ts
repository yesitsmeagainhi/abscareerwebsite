import mysql from "mysql2/promise";

// Connection pool to the Hostinger MySQL database. Reads config from env.
// When DB env isn't set (e.g. local dev before MySQL is connected), the data
// layer (lib/content.ts) falls back to built-in seed content instead.

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

export const dbConfigured = Boolean(DB_HOST && DB_USER && DB_NAME);

let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: DB_HOST,
      port: Number(DB_PORT) || 3306,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 5,
      // mysql2 parses JSON columns to JS objects automatically.
    });
  }
  return pool;
}

export type SqlParam = string | number | boolean | null | Date;

/** Run a query and return typed rows. */
export async function query<T = Record<string, unknown>>(
  sql: string,
  params: SqlParam[] = [],
): Promise<T[]> {
  const [rows] = await getPool().execute(sql, params);
  return rows as T[];
}
