"use client";

import { useState } from "react";

// The signature "eligibility slip" form. On submit it posts a single lead to
// the site's real /api/enquiry endpoint (→ MySQL + counsellor email), then
// redirects to the dedicated /thank-you page — a real page load at a stable URL
// so it can be used as a Google Ads "page load" lead conversion trigger.
// The 12th stream and Mumbai area ride along in the lead's course/city.

const SOURCE_PAGE = "/lp/gnm-nursing-mumbai";
const THANK_YOU_URL = "/lp/gnm-nursing-mumbai/thank-you";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function GnmLeadForm() {
  const [nameErr, setNameErr] = useState(false);
  const [mobErr, setMobErr] = useState(false);
  const [submitErr, setSubmitErr] = useState("");
  const [loading, setLoading] = useState(false);

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

      // Report the lead to GA4 (survives the redirect via sendBeacon).
      if (typeof window.gtag === "function") {
        window.gtag("event", "generate_lead", {
          form: "gnm-nursing-mumbai",
          course: "GNM Nursing",
        });
      }

      // Real page load at a stable URL → Google Ads "page load" conversion.
      window.location.assign(THANK_YOU_URL);
    } catch (err) {
      setSubmitErr(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
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
