// Shared client-side helpers for the BPT landing page forms.

export const PAGE = "bpt-admission-mumbai";
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

/** Best-effort POST to the site's lead API. Never throws — the redirect follows either way. */
export async function submitLead(lead: {
  name: string;
  phone: string;
  course: string;
  category?: string;
  percentage12?: string;
}): Promise<void> {
  try {
    await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...lead,
        course: lead.course.slice(0, 120),
        sourcePage: `/lp/${PAGE}`,
      }),
    });
  } catch {
    /* best-effort */
  }
}
