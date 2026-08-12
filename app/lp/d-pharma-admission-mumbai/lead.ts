// Shared client-side helpers for the D.Pharma landing page forms.

export const PAGE = "d-pharma-admission-mumbai";
export const THANK_YOU = `/lp/${PAGE}/thank-you`;

export function validMobile(v: string): boolean {
  return /^[6-9]\d{9}$/.test((v || "").replace(/\D/g, ""));
}

export function fireGtag(event: string, params: Record<string, unknown> = {}): void {
  try {
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", event, {
      page: PAGE,
      ...params,
    });
  } catch {
    /* never break the page for analytics */
  }
}

/** Branch from ?branch=, falling back to the default. Kept in sync with the branch cards. */
export function branchFromUrl(fallback = "bhayandar"): string {
  if (typeof window === "undefined") return fallback;
  const b = (new URLSearchParams(window.location.search).get("branch") || "").toLowerCase();
  return b || fallback;
}

/** Best-effort POST to the site's lead API. Never throws — the redirect follows either way. */
export async function submitLead(lead: {
  name: string;
  phone: string;
  source: string;
}): Promise<void> {
  const branch = branchFromUrl();
  try {
    await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: lead.name,
        phone: lead.phone,
        course: `D.Pharma · ${lead.source}`.slice(0, 120),
        city: branch,
        sourcePage: `/lp/${PAGE}`,
      }),
    });
  } catch {
    /* best-effort */
  }
}
