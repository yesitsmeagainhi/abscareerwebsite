"use client";

import { useEffect, useRef, useState } from "react";

import { track } from "@/lib/track";

// Reusable timed lead-capture popup (WhatsApp / call back), parameterised per
// landing page. Appears after `delayMs` (default 6s), once per calendar day.
// Saves to /api/enquiry with sourcePage `/lp/<page>#popup` so leads are tagged
// as popup-channel for that specific LP. Requires a `.lp-popup-*` style scope
// on an ancestor (each LP's scoped CSS provides it).

const DELAY_MS = 6000;

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function LeadPopup({
  page,
  courseLabel,
  whatsappNumber,
  title,
  sub,
}: {
  page: string;
  courseLabel: string;
  whatsappNumber?: string;
  title: string;
  sub: string;
}) {
  const storeKey = `abs_popup_day_${page}`;
  const [open, setOpen] = useState(false);
  const [thanks, setThanks] = useState(false);
  const [nameErr, setNameErr] = useState(false);
  const [mobErr, setMobErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(storeKey) === today()) return;
    } catch {
      /* ignore */
    }
    const t = window.setTimeout(() => {
      setOpen(true);
      try {
        localStorage.setItem(storeKey, today());
      } catch {
        /* ignore */
      }
    }, DELAY_MS);
    return () => window.clearTimeout(t);
  }, [storeKey]);

  function fireGtag(event: string) {
    try {
      (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", event, {
        location: "popup",
        page,
      });
    } catch {
      /* ignore */
    }
  }

  async function submit(mode: "wa" | "call") {
    const form = formRef.current;
    if (!form) return;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const name = (data.pname || "").trim();
    const mob = (data.pmobile || "").trim();
    const badName = name.length < 2;
    const badMob = !/^[6-9]\d{9}$/.test(mob);
    setNameErr(badName);
    setMobErr(badMob);
    if (badName || badMob) return;

    setLoading(true);
    try {
      await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone: mob,
          course: `${courseLabel} (popup ${mode === "wa" ? "WhatsApp" : "call back"})`,
          sourcePage: `/lp/${page}#popup`,
        }),
      });
    } catch {
      /* best-effort */
    }

    const ev = mode === "wa" ? "whatsapp_click" : "form_submit";
    track(ev, { page, location: "popup" });
    fireGtag(ev);
    setLoading(false);

    if (mode === "wa" && whatsappNumber) {
      const num = whatsappNumber.replace(/[^\d]/g, "");
      const msg = encodeURIComponent(
        `Hi, I'm ${name}. Please share ${courseLabel} admission & scholarship details (Mumbai, 2026-27). My number: ${mob}.`,
      );
      window.open(`https://wa.me/${num}?text=${msg}`, "_blank");
    }
    setThanks(true);
  }

  if (!open) return null;

  return (
    <div className="lp-popup-overlay" onClick={() => setOpen(false)}>
      <div className="lp-popup-card" onClick={(e) => e.stopPropagation()}>
        <button className="lp-popup-close" aria-label="Close" onClick={() => setOpen(false)}>
          &times;
        </button>

        {!thanks ? (
          <>
            <span className="lp-popup-eyebrow">Free Expert Guidance</span>
            <h3 className="lp-popup-title">{title}</h3>
            <p className="lp-popup-sub">{sub}</p>
            <form ref={formRef} onSubmit={(e) => e.preventDefault()} noValidate>
              <div className="field">
                <input name="pname" type="text" autoComplete="name" placeholder="Your name" />
                {nameErr && <div className="err show">Please enter your name.</div>}
              </div>
              <div className="field">
                <input
                  name="pmobile"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                />
                {mobErr && <div className="err show">Enter a valid 10-digit mobile number.</div>}
              </div>
              <div className="lp-popup-actions">
                {whatsappNumber && (
                  <button
                    type="button"
                    className="btn bar-wa"
                    disabled={loading}
                    onClick={() => submit("wa")}
                  >
                    &#128172; Get details on WhatsApp
                  </button>
                )}
                <button
                  type="button"
                  className="btn"
                  disabled={loading}
                  onClick={() => submit("call")}
                >
                  &#9742; Request a call back
                </button>
              </div>
              <p className="lp-popup-note">No spam. Our Mumbai expert will contact you shortly.</p>
            </form>
          </>
        ) : (
          <div className="lp-popup-thanks">
            <div className="lp-popup-badge">&#10003;</div>
            <h3>Thank you!</h3>
            <p>Our admission expert will contact you shortly with admission &amp; scholarship guidance.</p>
            <button className="btn" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
