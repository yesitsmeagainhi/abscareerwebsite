"use client";

import { useState } from "react";

// The signature "eligibility slip" form. On submit it posts a single lead to
// the site's real /api/enquiry endpoint (→ MySQL + counsellor email), the same
// pipeline the rest of the site uses — no Google Sheet / WhatsApp-only fallback.
// The 12th stream and Mumbai area are folded into the lead's course/city so
// nothing is lost and no DB migration is needed.

const SOURCE_PAGE = "/lp/gnm-nursing-mumbai";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function GnmLeadForm({
  waHref,
  callHref,
  phone,
}: {
  waHref: string;
  callHref: string;
  phone?: string;
}) {
  const [nameErr, setNameErr] = useState(false);
  const [mobErr, setMobErr] = useState(false);
  const [submitErr, setSubmitErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [doneName, setDoneName] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    const name = (data.name || "").trim();
    const mob = (data.mobile || "").trim();
    const stream = data.stream || "";
    const area = (data.area || "").trim();

    const badName = !name;
    const badMob = !/^[6-9]\d{9}$/.test(mob);
    setNameErr(badName);
    setMobErr(badMob);
    setSubmitErr("");
    if (badName || badMob) return;

    setLoading(true);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone: mob,
          course: `GNM Nursing${stream ? ` (12th: ${stream})` : ""}`,
          city: area || undefined,
          sourcePage: SOURCE_PAGE,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || "Could not submit. Please call us instead.");

      // Report the lead to GA4 (standard recommended event). Link GA4 → Google
      // Ads and mark this as a key event to use it for ad conversion tracking.
      if (typeof window.gtag === "function") {
        window.gtag("event", "generate_lead", {
          form: "gnm-nursing-mumbai",
          course: "GNM Nursing",
        });
      }
      setDoneName(name);
    } catch (err) {
      setSubmitErr(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (doneName) {
    return (
      <div className="slip" id="apply">
        <div className="thanks">
          <div className="thanks-badge">&#10003;</div>
          <h3>Thank you, {doneName}!</h3>
          <p>
            Your scholarship eligibility check is submitted. Our admission department will connect
            with you soon. You can also reach us directly right now:
          </p>
          <div className="thanks-actions">
            {phone && (
              <a className="btn btn-primary btn-block" href={callHref}>
                &#9742; Call {phone}
              </a>
            )}
            <a className="btn bar-wa btn-block" href={waHref}>
              &#128172; Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="slip" id="apply" onSubmit={onSubmit} noValidate>
      <div className="slip-head">
        <span className="slip-title">Scholarship Eligibility Check</span>
        <span className="slip-batch">FREE &middot; 2026&ndash;27</span>
      </div>
      <span className="seat-stamp">&#127891; Scholarship up to 100%* &middot; Limited Seats</span>
      <ul className="check-list" aria-label="Eligibility checklist">
        <li><span className="tick">&#10003;</span>12th pass &ndash; Arts / Commerce / Science, any stream</li>
        <li><span className="tick">&#10003;</span>Minimum 40% marks in 12th</li>
        <li><span className="tick">&#10003;</span>Minimum 40 marks in English</li>
        <li><span className="tick">&#10003;</span>No NEET / entrance exam needed</li>
        <li><span className="tick">&#10003;</span>Scholarship: girls up to 100%*, boys up to 50%*</li>
      </ul>
      <div className="field">
        <label htmlFor="name">Student name</label>
        <input id="name" name="name" type="text" autoComplete="name" placeholder="Full name" required />
        {nameErr && <div className="err">Please enter the student&apos;s name.</div>}
      </div>
      <div className="field">
        <label htmlFor="mobile">Mobile / WhatsApp number</label>
        <input
          id="mobile"
          name="mobile"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          placeholder="10-digit mobile number"
          required
        />
        {mobErr && <div className="err">Enter a valid 10-digit mobile number.</div>}
      </div>
      <div className="field">
        <label htmlFor="stream">12th stream</label>
        <select id="stream" name="stream" defaultValue="Science">
          <option>Science</option>
          <option>Commerce</option>
          <option>Arts</option>
          <option>12th appearing (2026)</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="area">Your area in Mumbai</label>
        <input id="area" name="area" type="text" placeholder="e.g. Malad, Thane, Nalasopara&hellip;" />
      </div>
      {submitErr && <div className="err" style={{ marginBottom: 8 }}>{submitErr}</div>}
      <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
        {loading ? "Submitting…" : "Check My Scholarship Eligibility →"}
      </button>
      <p className="form-note">
        Free check &ndash; no admission commitment. Our counsellor will call and tell you exactly
        which scholarship applies to you.
      </p>
    </form>
  );
}
