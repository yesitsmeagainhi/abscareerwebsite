"use client";

import { useState } from "react";

import { track } from "@/lib/track";

import { PAGE, THANK_YOU, fireGtag, submitLead, validMobile } from "./lead";

// Two-field lead form (name + mobile). Used twice on the page: the hero card
// and the closing card. On success we redirect to the thank-you page, where the
// Google Ads conversion fires on PAGEVIEW — firing on click double-counted on
// the GNM campaign.
export default function DpharmaLeadForm({
  idPrefix,
  source,
}: {
  idPrefix: string;
  source: string;
}) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) {
      setErr("Please enter your name.");
      return;
    }
    if (!validMobile(mobile)) {
      setErr("Enter a valid 10-digit mobile number.");
      return;
    }
    setErr("");
    setLoading(true);

    await submitLead({ name: name.trim(), phone: mobile, source });
    fireGtag("generate_lead", { location: source });
    track("form_submit", { page: PAGE, location: source });
    window.location.assign(THANK_YOU);
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <label className="abs-field" htmlFor={`${idPrefix}Name`}>
        <span>Your name</span>
        <input
          type="text"
          id={`${idPrefix}Name`}
          autoComplete="name"
          placeholder="Full name"
          value={name}
          onChange={(e) => { setName(e.target.value); setErr(""); }}
        />
      </label>
      <label className="abs-field" htmlFor={`${idPrefix}Phone`}>
        <span>Mobile number</span>
        <input
          type="tel"
          id={`${idPrefix}Phone`}
          autoComplete="tel"
          inputMode="numeric"
          maxLength={10}
          placeholder="10-digit mobile"
          value={mobile}
          onChange={(e) => { setMobile(e.target.value.replace(/\D/g, "").slice(0, 10)); setErr(""); }}
        />
      </label>
      <button className="abs-submit" type="submit" disabled={loading}>
        {loading ? "Sending…" : "Request a call back"}
      </button>
      {err && <p className="abs-err">{err}</p>}
      <p className="abs-formnote">We call between 10am and 7pm. Your number is not shared with anyone.</p>
    </form>
  );
}
