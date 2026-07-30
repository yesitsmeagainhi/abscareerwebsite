// Client-side tracking helper. Sends LP interaction events to /api/track using
// sendBeacon (survives the tel:/wa.me navigation). An anonymous per-browser
// visitor id (localStorage) lets the dashboard count unique users.

const VID_KEY = "abs_vid";

function visitorId(): string {
  try {
    let v = localStorage.getItem(VID_KEY);
    if (!v) {
      v = Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(VID_KEY, v);
    }
    return v;
  } catch {
    return "";
  }
}

export function track(event: string, params: { page?: string; location?: string } = {}): void {
  if (typeof window === "undefined") return;
  try {
    const payload = JSON.stringify({
      event,
      page: params.page || "gnm-nursing-mumbai",
      location: params.location,
      visitor: visitorId(),
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }));
    } else {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    /* never break the page for analytics */
  }
}
