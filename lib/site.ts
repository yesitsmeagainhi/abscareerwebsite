// Site-wide constants. SITE_URL is read from env (used for metadata, sitemap,
// canonical URLs) and falls back to the production domain.

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://abscareer.com";

// Fallback "last reviewed" date for content served from the built-in seed
// (the DB surfaces its own real updated_at). Keep current when content changes.
export const CONTENT_UPDATED = "2026-06-18";

/** Format an ISO date / Date into a readable "18 June 2026" for on-page display. */
export function formatDate(input?: string): string {
  if (!input) return "";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/branches", label: "Branches" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function whatsappLink(number?: string, message?: string) {
  const num = (number || "").replace(/[^\d]/g, "");
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${num}${text}`;
}
