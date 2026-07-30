"use client";

import { useEffect, useRef, useState } from "react";

import { track } from "@/lib/track";

// Timed lead-capture popup: appears 10s after load (once per browser session),
// offers a WhatsApp chat or a call back from a GNM admission expert, capturing
// just name + number. Saves to the same /api/enquiry pipeline as the main form.

const SESSION_KEY = "abs_popup_seen";
const DELAY_MS = 10000;

function fireGtag(event: string) {
  try {
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", event, {
      location: "popup",
      page: "gnm-nursing-mumbai",
    });
  } catch {
    /* ignore */
  }
}

export default function LpPopup({ whatsappNumber }: { whatsappNumber?: string }) {
  const [open, setOpen] = useState(false);
  const [thanks, setThanks] = useState(false);
  const [nameErr, setNameErr] = useState(false);
  const [mobErr, setMobErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      /* ignore */
    }
    const t = window.setTimeout(() => {
      setOpen(true);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
    }, DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

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
          course: `GNM Nursing (popup ${mode === "wa" ? "WhatsApp" : "call back"})`,
          sourcePage: "/lp/gnm-nursing-mumbai#popup",
        }),
      });
    } catch {
      /* lead best-effort; still proceed */
    }

    const ev = mode === "wa" ? "whatsapp_click" : "form_submit";
    track(ev, { location: "popup" });
    fireGtag(ev);
    setLoading(false);

    if (mode === "wa" && whatsappNumber) {
      const num = whatsappNumber.replace(/[^\d]/g, "");
      const msg = encodeURIComponent(
        `Hi, I'm ${name}. Please share GNM Nursing admission & scholarship details for 2026-27 (Mumbai). My number: ${mob}.`,
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
            <h3 className="lp-popup-title">Talk to a GNM Admission Expert</h3>
            <p className="lp-popup-sub">
              Get admission &amp; scholarship guidance on WhatsApp or a quick call back — just leave
              your name &amp; number.
            </p>
            <form ref={formRef} onSubmit={(e) => e.preventDefault()} noValidate>
              <div className="field">
                <input name="pname" type="text" autoComplete="name" placeholder="Your name" />
                {nameErr && <div className="err">Please enter your name.</div>}
              </div>
              <div className="field">
                <input
                  name="pmobile"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                />
                {mobErr && <div className="err">Enter a valid 10-digit mobile number.</div>}
              </div>
              <div className="lp-popup-actions">
                {whatsappNumber && (
                  <button
                    type="button"
                    className="btn bar-wa btn-block"
                    disabled={loading}
                    onClick={() => submit("wa")}
                  >
                    &#128172; Get details on WhatsApp
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  disabled={loading}
                  onClick={() => submit("call")}
                >
                  &#9742; Request a call back
                </button>
              </div>
              <p className="form-note">No spam. Our Mumbai expert will contact you shortly.</p>
            </form>
          </>
        ) : (
          <div className="thanks">
            <div className="thanks-badge">&#10003;</div>
            <h3>Thank you!</h3>
            <p>
              Our GNM admission expert will contact you shortly with admission &amp; scholarship
              guidance.
            </p>
            <button className="btn btn-primary btn-block" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
