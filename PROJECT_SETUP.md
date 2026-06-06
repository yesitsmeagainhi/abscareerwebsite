# ABS Admissions — Setup & Handoff

SEO-first, server-rendered site for **ABS Educational Solution** — D.Pharm, B.Pharm,
Nursing & Paramedical admissions across Mumbai, **since 2009**, **6 branches**
(abscareer.com). Built with **Next.js 16 (App Router) + TypeScript + Tailwind v4**.

**Storage is all on Hostinger:**
- **Content** (courses, branches, site settings) + **leads** → **Hostinger MySQL**.
- Staff edit content through a **custom admin panel at `/admin`** (single shared password).
- Course/branch images are **uploaded to the server** (`public/uploads`).

> The public site runs with **built-in seed content** (`lib/fallback.ts`) when no database
> is reachable, so it renders during local dev before MySQL is connected. Shared phone
> everywhere for now: **+91 97028 36946** (WhatsApp 919702836946).

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in DB + admin + SMTP + WhatsApp
npm run db:init              # create tables + seed content (needs DB env)
npm run dev                  # http://localhost:3000 (or next free port)
npm run build && npm start   # production build (what Hostinger runs)
```

Key routes:
- Course pages (flat SEO URLs): `/d-pharma-admission-2026`, `/b-pharma-admission-2026`,
  `/gnm-nursing-admission-2026`, `/bsc-nursing-admission-2026`, `/anm-nursing-admission-2026`,
  `/dmlt-admission-2026`
- Branches: `/branches` + `/branches/{thane,kurla,malad,bhayandar,nalasopara,andheri}`
- `/` `/courses` `/about` `/contact`
- **Admin:** `/admin/login` → `/admin` (dashboard, courses, branches, settings, leads)
- `/sitemap.xml` `/robots.txt` `POST /api/enquiry`

## 1. Database (Hostinger MySQL)

1. In hPanel → **Create a New MySQL Database And Database User**. Note host, db name, user, password.
2. Put them in `.env.local` / Hostinger env: `DB_HOST DB_PORT DB_USER DB_PASSWORD DB_NAME`.
3. Run `npm run db:init` once — creates `courses`, `branches`, `site_settings`, `leads`
   and seeds the content tables from the built-in seed.
   - Tables map 1:1 to the app types; the rich fields are stored in a `data` JSON column.
   - On Hostinger, MySQL is usually reachable as `localhost` from the Node app. For local
     dev, either run a local MySQL or enable remote access + IP allowlist (otherwise dev
     uses seed content and the admin shows "database not connected").

## 2. Admin panel

- Set `ADMIN_PASSWORD` (the shared login password) and `ADMIN_SESSION_SECRET` (a long
  random string that signs the session cookie).
- Go to `/admin/login`, enter the password. Manage courses, branches, site settings; view leads.
- Content edits trigger revalidation, so the live site updates right after saving.
- **Images:** the course form has an upload field → files save to `public/uploads`. Ensure
  that folder is writable and persists on the Node plan.

## 3. Leads → MySQL (+ email)

- Every enquiry-form submission is inserted into the `leads` table and shown in `/admin/leads`.
- Optionally set Hostinger SMTP (`SMTP_HOST/PORT/USER/PASS` + `LEAD_NOTIFY_EMAIL`) to also
  email counsellors on each lead. Spam protection: honeypot + per-IP throttle.

## 4. WhatsApp

Set `NEXT_PUBLIC_WHATSAPP_NUMBER` (country code + number, digits only) — drives the floating
click-to-chat button and contact links.

## 5. Deploy to Hostinger Node.js

1. Push to GitHub (private).
2. hPanel → Node.js app: Node 20+, app root = this folder, **start command `npm start`**.
3. Add every variable from `.env.example` (incl. `DB_*`, `ADMIN_*`); set `NEXT_PUBLIC_SITE_URL`
   to the live domain.
4. Run `npm run db:init` once after first deploy. Point the domain, enable SSL.

## Architecture notes

- `lib/db.ts` — MySQL pool. `lib/content.ts` — public, slug-based reads with seed fallback.
  `lib/admin-content.ts` — id-based CRUD for the admin. `lib/auth.ts` — signed-cookie session.
- Public pages stay **prerendered (SSG)** → full content + JSON-LD in the raw HTML (great for SEO).
- No Sanity, no Google Sheet — everything is on your Hostinger MySQL.

## Post-launch (operational — ABS team, not website code)
- 6 Google Business Profiles + reviews; consistent NAP; JustDial/Sulekha citations;
  submit `/sitemap.xml` to Search Console; validate rich results (Course/FAQ/LocalBusiness).

## Next phase (architecture supports it)
- Course×location money pages (`/d-pharma-admission-thane`); blog; enrich the thin/duplicate
  branch pages with unique local content (still outstanding).
