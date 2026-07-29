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

// Convert a base64url VAPID key to the Uint8Array the Push API expects.
function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

// Register the service worker and subscribe this device to Web Push so leads
// notify even when the tab is closed (Chrome/Android/desktop; iOS 16.4+ PWA).
// Returns a human-readable reason so the admin can see if it failed.
async function subscribeToPush(): Promise<{ ok: boolean; reason: string }> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return { ok: false, reason: "This browser can't do push (use Chrome; on iPhone, Add to Home Screen first)." };
  }
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return { ok: false, reason: "Allow notifications when the browser asks." };
  }
  try {
    const reg = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;
    const res = await fetch("/api/admin/push/public-key", { cache: "no-store" });
    if (!res.ok) return { ok: false, reason: `Server push key unavailable (HTTP ${res.status}).` };
    const { publicKey } = await res.json();
    if (!publicKey) return { ok: false, reason: "Server returned no push key." };
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
      });
    }
    const save = await fetch("/api/admin/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sub),
    });
    if (!save.ok) return { ok: false, reason: `Couldn't save subscription (HTTP ${save.status}).` };
    return { ok: true, reason: "Push subscribed on this device ✓" };
  } catch (e) {
    return { ok: false, reason: (e as Error)?.message || "Subscription failed." };
  }
}

export default function LeadNotifier() {
  const [enabled, setEnabled] = useState(false);
  const [supported, setSupported] = useState(true);
  const [granted, setGranted] = useState(false);
  const [toast, setToast] = useState<LatestLead>(null);
  const [pushMsg, setPushMsg] = useState("");
  const [testing, setTesting] = useState(false);

  const lastSeen = useRef(0);
  const baselined = useRef(false);
  const audioCtx = useRef<AudioContext | null>(null);

  useEffect(() => {
    const notifSupported = typeof window !== "undefined" && "Notification" in window;
    setSupported(notifSupported);
    setGranted(notifSupported && Notification.permission === "granted");
    lastSeen.current = Number(localStorage.getItem(LS_LAST) || "0");
    if (localStorage.getItem(LS_ON) === "1") {
      setEnabled(true);
      // Re-affirm the push subscription for this device on load.
      if (notifSupported && Notification.permission === "granted") subscribeToPush();
    }
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
    let ok = false;
    if ("Notification" in window && Notification.permission !== "granted") {
      try {
        const p = await Notification.requestPermission();
        ok = p === "granted";
        setGranted(ok);
      } catch {
        /* ignore */
      }
    } else if ("Notification" in window) {
      ok = Notification.permission === "granted";
      setGranted(ok);
    }
    setEnabled(true);
    localStorage.setItem(LS_ON, "1");
    beep(); // confirmation ping
    // If permission granted, register for real Web Push (works when tab closed).
    if (ok) {
      setPushMsg("Setting up push…");
      const r = await subscribeToPush();
      setPushMsg(r.reason);
    } else {
      setPushMsg("Notifications blocked — allow them in the browser to get alerts.");
    }
  }, [beep]);

  const disableAlerts = useCallback(() => {
    setEnabled(false);
    setPushMsg("");
    localStorage.removeItem(LS_ON);
  }, []);

  const sendTest = useCallback(async () => {
    setTesting(true);
    setPushMsg("Sending test…");
    try {
      const res = await fetch("/api/admin/push/test", { method: "POST" });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPushMsg(`Test failed (HTTP ${res.status}).`);
      } else if (!d.subscriptions) {
        setPushMsg("0 devices subscribed — click Enable & Allow on this device first.");
      } else if (d.sent > 0) {
        setPushMsg(`Test sent to ${d.sent}/${d.subscriptions} device(s). Check for the notification.`);
      } else {
        setPushMsg(`0 delivered of ${d.subscriptions}. ${(d.errors || []).join("; ").slice(0, 160)}`);
      }
    } catch (e) {
      setPushMsg((e as Error)?.message || "Test failed.");
    } finally {
      setTesting(false);
    }
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

      {pushMsg && (
        <div className="max-w-xs rounded-lg bg-gray-900/90 px-3 py-2 text-xs text-white shadow-lg">
          {pushMsg}
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
        <div className="flex items-center gap-2">
          <button
            onClick={sendTest}
            disabled={testing}
            className="rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-brand-dark disabled:opacity-60"
          >
            {testing ? "Sending…" : "Send test"}
          </button>
          <button
            onClick={disableAlerts}
            title="Turn off lead alerts"
            className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow hover:bg-gray-50"
          >
            🔔 On{supported && granted ? "" : " (in-app)"} · off
          </button>
        </div>
      )}
    </div>
  );
}
