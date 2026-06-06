import type { Branch, Course, SiteSettings } from "@/lib/types";
import { SITE_URL } from "@/lib/site";

// Renders a JSON-LD <script>. Next.js allows this in the App Router; search
// engines read it for rich results.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * EducationalOrganization + LocalBusiness with all branches as `department`.
 * This is the structured-data backbone for local ranking — it tells Google ABS
 * is one org with multiple physical branches across Mumbai.
 */
export function organizationSchema(settings: SiteSettings, branches: Branch[] = []) {
  return {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    name: settings.orgName,
    description: settings.description,
    url: SITE_URL,
    ...(settings.foundingYear ? { foundingDate: settings.foundingYear } : {}),
    ...(settings.email ? { email: settings.email } : {}),
    ...(settings.phone ? { telephone: settings.phone } : {}),
    ...(branches.length
      ? {
          department: branches.map((b) => ({
            "@type": "LocalBusiness",
            name: `${settings.orgName} — ${b.name}`,
            ...(settings.phone ? { telephone: b.phone || settings.phone } : {}),
            address: {
              "@type": "PostalAddress",
              ...(b.address ? { streetAddress: b.address } : {}),
              addressLocality: `${b.name}, Mumbai`,
              addressRegion: "Maharashtra",
              ...(b.postalCode ? { postalCode: b.postalCode } : {}),
              addressCountry: "IN",
            },
            url: `${SITE_URL}/branches/${b.slug}`,
          })),
        }
      : {}),
  };
}

export function branchSchema(branch: Branch, orgName: string, phone?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `${orgName} — ${branch.name}`,
    telephone: branch.phone || phone,
    address: {
      "@type": "PostalAddress",
      ...(branch.address ? { streetAddress: branch.address } : {}),
      addressLocality: `${branch.name}, Mumbai`,
      addressRegion: "Maharashtra",
      ...(branch.postalCode ? { postalCode: branch.postalCode } : {}),
      addressCountry: "IN",
    },
    url: `${SITE_URL}/branches/${branch.slug}`,
    ...(branch.mapsUrl ? { hasMap: branch.mapsUrl } : {}),
    parentOrganization: { "@type": "EducationalOrganization", name: orgName, url: SITE_URL },
  };
}

export function courseSchema(course: Course, providerName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.shortDescription,
    provider: {
      "@type": "EducationalOrganization",
      name: providerName,
      sameAs: SITE_URL,
    },
    url: `${SITE_URL}/${course.slug}`,
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}
