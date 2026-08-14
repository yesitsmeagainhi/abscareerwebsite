import type { Branch, BlogPost, Course, SiteSettings } from "@/lib/types";
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
  const sameAs = [
    settings.socials?.facebook,
    settings.socials?.instagram,
    settings.socials?.youtube,
  ].filter(Boolean) as string[];
  return {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    name: settings.orgName,
    description: settings.description,
    url: SITE_URL,
    areaServed: { "@type": "City", name: "Mumbai" },
    ...(settings.logo ? { logo: settings.logo, image: settings.logo } : {}),
    ...(settings.foundingYear ? { foundingDate: settings.foundingYear } : {}),
    ...(settings.email ? { email: settings.email } : {}),
    ...(settings.phone ? { telephone: settings.phone } : {}),
    ...(sameAs.length ? { sameAs } : {}),
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
    areaServed: { "@type": "City", name: "Mumbai" },
    priceRange: "₹₹",
    ...(branch.mapsUrl ? { hasMap: branch.mapsUrl } : {}),
    parentOrganization: { "@type": "EducationalOrganization", name: orgName, url: SITE_URL },
  };
}

export function courseSchema(course: Course, providerName: string) {
  const prerequisites =
    course.quickFacts?.eligibility ||
    (course.eligibilityPoints && course.eligibilityPoints.length
      ? course.eligibilityPoints.join("; ")
      : undefined);
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.shortDescription,
    inLanguage: "en",
    provider: {
      "@type": "EducationalOrganization",
      name: providerName,
      url: SITE_URL,
      sameAs: SITE_URL,
      areaServed: { "@type": "City", name: "Mumbai" },
    },
    url: `${SITE_URL}/${course.slug}`,
    ...(course.courseShortName
      ? { educationalCredentialAwarded: course.courseShortName }
      : {}),
    ...(prerequisites ? { coursePrerequisites: prerequisites } : {}),
    ...(course.subjects && course.subjects.length ? { teaches: course.subjects } : {}),
    // Required-ish for Course rich results: at least one instance with a mode + location.
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "onsite",
      inLanguage: "en",
      ...(course.quickFacts?.duration ? { courseWorkload: course.quickFacts.duration } : {}),
      location: {
        "@type": "Place",
        name: "Mumbai, Maharashtra",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Mumbai",
          addressRegion: "Maharashtra",
          addressCountry: "IN",
        },
      },
    },
  };
}

/**
 * HowTo schema for the admission process — lets Google show a step-by-step rich
 * result and helps AI answer engines extract the exact steps. (AEO)
 */
export function howToSchema(course: Course) {
  if (!course.admissionSteps || course.admissionSteps.length === 0) return null;
  const name = course.courseShortName || course.title;
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to get ${name} admission in Mumbai (2026)`,
    description: `Step-by-step ${name} admission process in Mumbai for the 2026 batch with ABS Educational Solution.`,
    step: course.admissionSteps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: `Step ${i + 1}`,
      text: s,
    })),
  };
}

/**
 * Speakable spec — marks the concise answer + headings for voice assistants and
 * answer engines to read aloud. (AEO)
 */
export function speakableSchema(url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".speakable-answer"],
    },
  };
}

/**
 * Course schema for a course×location money page. Same Course type, but the
 * CourseInstance is located at the specific branch and the canonical url points
 * to the money page — so each local page carries its own structured data.
 */
export function areaCourseSchema(
  course: Course,
  branch: Branch,
  providerName: string,
  url: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${course.courseShortName || course.title} Admission in ${branch.name}, Mumbai`,
    description: course.shortDescription,
    inLanguage: "en",
    provider: { "@type": "EducationalOrganization", name: providerName, url: SITE_URL },
    url,
    ...(course.courseShortName ? { educationalCredentialAwarded: course.courseShortName } : {}),
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "onsite",
      ...(course.quickFacts?.duration ? { courseWorkload: course.quickFacts.duration } : {}),
      location: {
        "@type": "Place",
        name: `${branch.name}, Mumbai`,
        address: {
          "@type": "PostalAddress",
          ...(branch.address ? { streetAddress: branch.address } : {}),
          addressLocality: `${branch.name}, Mumbai`,
          addressRegion: "Maharashtra",
          ...(branch.postalCode ? { postalCode: branch.postalCode } : {}),
          addressCountry: "IN",
        },
      },
    },
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

/** Site-wide WebSite node — ties pages to one publisher entity for Google. */
export function websiteSchema(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.orgName,
    url: SITE_URL,
    inLanguage: "en-IN",
    publisher: {
      "@type": "EducationalOrganization",
      name: settings.orgName,
      url: SITE_URL,
      ...(settings.logo ? { logo: settings.logo } : {}),
    },
  };
}

/** BlogPosting / Article schema for a blog post (E-E-A-T: author + dates). */
export function articleSchema(post: BlogPost, settings: SiteSettings) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    inLanguage: "en-IN",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    author: {
      "@type": "Organization",
      name: post.author || settings.reviewerName || settings.orgName,
      url: SITE_URL,
    },
    publisher: {
      "@type": "EducationalOrganization",
      name: settings.orgName,
      url: SITE_URL,
      ...(settings.logo ? { logo: { "@type": "ImageObject", url: settings.logo } } : {}),
    },
    ...(post.heroImage ? { image: post.heroImage } : {}),
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

/**
 * Occupation schema for a "career after pharmacy" page. Salary is deliberately
 * omitted from the structured data — the on-page ranges are indicative and
 * publishing them as machine-readable `estimatedSalary` would overstate their
 * precision.
 */
export function occupationSchema(career: {
  name: string;
  metaDescription: string;
  slug: string;
  entryVia: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Occupation",
    name: career.name,
    description: career.metaDescription,
    url: `${SITE_URL}/careers-after-pharmacy/${career.slug}`,
    occupationLocation: { "@type": "City", name: "Mumbai" },
    qualifications: career.entryVia.join(", "),
    industry: "Pharmacy and pharmaceuticals",
  };
}
