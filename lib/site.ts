// Site-wide constants. SITE_URL is read from env (used for metadata, sitemap,
// canonical URLs) and falls back to the production domain.

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://abscareer.com";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/branches", label: "Branches" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function whatsappLink(number?: string, message?: string) {
  const num = (number || "").replace(/[^\d]/g, "");
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${num}${text}`;
}
