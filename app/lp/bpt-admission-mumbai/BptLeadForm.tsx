"use client";

import { useState } from "react";

import { track } from "@/lib/track";

import { PAGE, THANK_YOU, fireGtag, submitLead, validMobile } from "./lead";

const STAGES = [
  "BPT admission with NEET score",
  "I don't have a NEET score — what are my options?",
  "BPT course fees and scholarships",
  "Eligibility — am I even qualified?",
  "Still in 12th, planning ahead",
];

// Name / mobile / (optional) stage / consent. Used twice on the LP: the hero
// enquiry card and the callback card lower down. On success we redirect to the
// thank-you page — a real page load at a stable URL for a Google Ads
// "page load" conversion, same as the BSc LP.
export default function BptLeadForm({
  idPrefix,
  location,
  withStage = false,
  submitLabel,
}: {
  idPrefix: string;
  location: string;
  withStage?: boolean;
  submitLabel: string;
}) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [stage, setStage] = useState("");
  const [consent, setConsent] = useState(false);
  const [err, setErr] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const bad = {
      name: name.trim().length < 2,
      mobile: !validMobile(mobile),
      stage: withStage && !stage,
      consent: !consent,
    };
    setErr(bad);
    if (bad.name || bad.mobile || bad.stage || bad.consent) return;

    setLoading(true);
    await submitLead({
      name: name.trim(),
      phone: mobile,
      course: `BPT${stage ? ` · ${stage}` : ""}`,
    });
    fireGtag("generate_lead");
    track("form_submit", { page: PAGE, location });
    window.location.assign(THANK_YOU);
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="f">
        <label className="fl" htmlFor={`${idPrefix}Name`}>Student name</label>
        <input
          id={`${idPrefix}Name`}
          type="text"
          autoComplete="name"
          placeholder="Full name"
          value={name}
          onChange={(e) => { setName(e.target.value); setErr((s) => ({ ...s, name: false })); }}
        />
        {err.name && <p className="erl">Please enter the student&apos;s name.</p>}
      </div>

      <div className="f">
        <label className="fl" htmlFor={`${idPrefix}Phone`}>Mobile number</label>
        <input
          id={`${idPrefix}Phone`}
          type="tel"
          inputMode="numeric"
          maxLength={10}
          autoComplete="tel"
          placeholder="10-digit mobile"
          value={mobile}
          onChange={(e) => { setMobile(e.target.value.replace(/\D/g, "").slice(0, 10)); setErr((s) => ({ ...s, mobile: false })); }}
        />
        {err.mobile && <p className="erl">Enter a valid 10-digit Indian mobile number.</p>}
      </div>

      {withStage && (
        <div className="f">
          <label className="fl" htmlFor={`${idPrefix}Stage`}>What you need help with</label>
          <select
            id={`${idPrefix}Stage`}
            value={stage}
            onChange={(e) => { setStage(e.target.value); setErr((s) => ({ ...s, stage: false })); }}
          >
            <option value="">Select one</option>
            {STAGES.map((s) => <option key={s}>{s}</option>)}
          </select>
          {err.stage && <p className="erl">Please pick one so the right counsellor calls.</p>}
        </div>
      )}

      <div className="f">
        <div className="consent-l">
          <input
            type="checkbox"
            id={`${idPrefix}Consent`}
            checked={consent}
            onChange={(e) => { setConsent(e.target.checked); setErr((s) => ({ ...s, consent: false })); }}
          />
          <label htmlFor={`${idPrefix}Consent`}>
            I allow ABS Educational Solution to contact me by phone, SMS and WhatsApp about
            admissions. I can withdraw this any time.
          </label>
        </div>
        {err.consent && <p className="erl">Please tick this so we can call you back.</p>}
      </div>

      <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
        {loading ? "Sending…" : submitLabel}
      </button>
      <p className="mnote">Free. No obligation. We never sell your details.</p>
    </form>
  );
}
