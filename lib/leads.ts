import nodemailer from "nodemailer";
import type { ResultSetHeader } from "mysql2";

import { dbConfigured, getPool } from "./db";
import type { Lead } from "./types";

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, LEAD_NOTIFY_EMAIL } = process.env;

const emailConfigured = !!SMTP_HOST && !!SMTP_USER && !!SMTP_PASS && !!LEAD_NOTIFY_EMAIL;

async function insertLead(lead: Lead): Promise<number> {
  const [res] = await getPool().execute<ResultSetHeader>(
    `INSERT INTO leads
       (type, name, phone, email, course, city, caste, category, percentage12, source_page, ip)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      lead.type || "enquiry",
      lead.name,
      lead.phone,
      lead.email || null,
      lead.course || null,
      lead.city || null,
      lead.caste || null,
      lead.category || null,
      lead.percentage12 || null,
      lead.sourcePage || null,
      lead.ip || null,
    ],
  );
  return res.insertId;
}

/** Enrich an existing lead (e.g. scholarship step 2 — optional details). */
export async function updateLead(id: number, fields: Partial<Lead>): Promise<void> {
  if (!dbConfigured) return;
  const map: Record<string, string | undefined> = {
    city: fields.city,
    caste: fields.caste,
    category: fields.category,
    percentage12: fields.percentage12,
  };
  const cols = Object.entries(map).filter(([, v]) => v !== undefined && v !== null && v !== "");
  if (!cols.length) return;
  const set = cols.map(([k]) => `${k} = ?`).join(", ");
  const params = cols.map(([, v]) => v as string);
  await getPool().execute(`UPDATE leads SET ${set} WHERE id = ?`, [...params, id]);
}

async function sendEmail(lead: Lead, timestamp: string) {
  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  const isScholarship = lead.type === "scholarship";
  const lines = [
    `New ${isScholarship ? "scholarship" : "admission"} enquiry at ${timestamp}`,
    ``,
    `Name:   ${lead.name}`,
    `Phone:  ${lead.phone}`,
    `Email:  ${lead.email || "-"}`,
    `Course: ${lead.course || "-"}`,
    `City:   ${lead.city || "-"}`,
  ];
  if (isScholarship) {
    lines.push(
      `Caste:    ${lead.caste || "-"}`,
      `Category: ${lead.category || "-"}`,
      `12th %:   ${lead.percentage12 || "-"}`,
    );
  }
  lines.push(`Page:   ${lead.sourcePage || "-"}`);
  await transport.sendMail({
    from: `"ABS Website" <${SMTP_USER}>`,
    to: LEAD_NOTIFY_EMAIL,
    subject: `New ${isScholarship ? "scholarship" : "admission"} enquiry — ${lead.name} (${
      lead.course || (isScholarship ? "scholarship" : "course not specified")
    })`,
    text: lines.join("\n"),
  });
}

/**
 * Persist a lead: insert into MySQL and email the counsellor. Returns the new
 * lead's id (or null if there's no DB) so a follow-up step can enrich it.
 * If neither DB nor SMTP is configured (local dev), logs to the console.
 */
export async function saveLead(lead: Lead, timestamp: string): Promise<number | null> {
  if (!dbConfigured && !emailConfigured) {
    console.info("[lead] (no DB/SMTP configured) ", { timestamp, ...lead });
    return null;
  }
  let id: number | null = null;
  if (dbConfigured) {
    try {
      id = await insertLead(lead);
    } catch (e) {
      console.error("[lead] db error", e);
    }
  }
  if (emailConfigured) {
    try {
      await sendEmail(lead, timestamp);
    } catch (e) {
      console.error("[lead] email error", e);
    }
  }
  return id;
}
