"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

// Polls the admin for new leads and alerts the moment one arrives:
// on-screen banner + sound + (if granted) an OS notification. Works whenever
// this admin page is open — including as a Home-Screen app on iPhone.
// For alerts when the app is fully closed, a Web Push service worker would be
// needed (follow-up).

type LatestLead = {
  id: number;
  name?: string;
  course?: string;
  city?: string;
  type?: string;
  createdAt?: string;
} | null;

const LS_LAST = "abs_last_lead_id";
const LS_ON = "abs_alerts_on";
const POLL_MS = 20000;

export default function LeadNotifier() {
  const [enabled, setEnabled] = useState(false);
  const [supported, setSupported] = useState(true);
  const [granted, setGranted] = useState(false);
  const [toast, setToast] = useState<LatestLead>(null);

  const lastSeen = useRef(0);
  const baselined = useRef(false);
  const audioCtx = useRef<AudioContext | null>(null);

  useEffect(() => {
    const notifSupported = typeof window !== "undefined" && "Notification" in window;
    setSupported(notifSupported);
    setGranted(notifSupported && Notification.permission === "granted");
    lastSeen.current = Number(localStorage.getItem(LS_LAST) || "0");
    if (localStorage.getItem(LS_ON) === "1") setEnabled(true);
  }, []);

  const beep = useCallback(() => {
    const ctx = audioCtx.current;
    if (!ctx) return;
    try {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.type = "sine";
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      o.start();
      o.stop(ctx.currentTime + 0.5);
    } catch {
      /* audio not available — banner still shows */
    }
  }, []);

  const notify = useCallback(
    (lead: LatestLead) => {
      if (!lead) return;
      setToast(lead);
      beep();
      const detail = [lead.course, lead.city].filter(Boolean).join(" · ") || "New website enquiry";
      if ("Notification" in window && Notification.permission === "granted") {
        try {
          const n = new Notification(`🔔 New lead: ${lead.name || "Enquiry"}`, {
            body: detail,
            tag: `abs-lead-${lead.id}`,
          });
          n.onclick = () => {
            window.focus();
            window.location.href = "/admin/leads";
            n.close();
          };
        } catch {
          /* ignore */
        }
      }
      window.setTimeout(() => setToast((t) => (t && t.id === lead.id ? null : t)), 20000);
    },
    [beep],
  );

  const poll = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/leads/latest", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      const latestId: number = data.latestId || 0;

      // First response after load = baseline; never alert for pre-existing leads.
      if (!baselined.current) {
        baselined.current = true;
        if (lastSeen.current === 0) {
          lastSeen.current = latestId;
          localStorage.setItem(LS_LAST, String(latestId));
          return;
        }
      }
      if (latestId > lastSeen.current) {
        lastSeen.current = latestId;
        localStorage.setItem(LS_LAST, String(latestId));
        if (enabled) notify(data.latest);
      }
    } catch {
      /* transient network error — try again next tick */
    }
  }, [enabled, notify]);

  useEffect(() => {
    poll();
    const id = window.setInterval(poll, POLL_MS);
    const onVis = () => {
      if (document.visibilityState === "visible") poll();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [poll]);

  const enableAlerts = useCallback(async () => {
    // Audio + notification permission must be triggered by a user gesture.
    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (Ctx && !audioCtx.current) audioCtx.current = new Ctx();
      await audioCtx.current?.resume();
    } catch {
      /* ignore */
    }
    if ("Notification" in window && Notification.permission !== "granted") {
      try {
        const p = await Notification.requestPermission();
        setGranted(p === "granted");
      } catch {
        /* ignore */
      }
    } else if ("Notification" in window) {
      setGranted(Notification.permission === "granted");
    }
    setEnabled(true);
    localStorage.setItem(LS_ON, "1");
    beep(); // confirmation ping
  }, [beep]);

  const disableAlerts = useCallback(() => {
    setEnabled(false);
    localStorage.removeItem(LS_ON);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {toast && (
        <div className="w-72 rounded-xl border border-green-200 bg-white p-4 shadow-xl">
          <div className="flex items-start justify-between">
            <span className="text-sm font-bold text-green-700">🔔 New lead!</span>
            <button
              onClick={() => setToast(null)}
              aria-label="Dismiss"
              className="text-gray-400 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <p className="mt-1 font-semibold text-gray-900">{toast.name || "Enquiry"}</p>
          <p className="text-sm text-gray-600">
            {[toast.course, toast.city].filter(Boolean).join(" · ") || "New website enquiry"}
          </p>
          <Link
            href="/admin/leads"
            className="mt-2 inline-block text-sm font-semibold text-brand hover:underline"
          >
            View leads →
          </Link>
        </div>
      )}

      {!enabled ? (
        <button
          onClick={enableAlerts}
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-brand-dark"
        >
          🔔 Enable lead alerts
        </button>
      ) : (
        <button
          onClick={disableAlerts}
          title="Turn off lead alerts"
          className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow hover:bg-gray-50"
        >
          🔔 Alerts on{supported && granted ? "" : " (in-app)"} · turn off
        </button>
      )}
    </div>
  );
}
