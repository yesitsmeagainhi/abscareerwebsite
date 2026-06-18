export type FAQ = { question: string; answer: string };

/** A regulatory/approving body to cite for E-E-A-T (e.g. PCI, MSBTE, INC). */
export type OfficialBody = { name: string; url: string };

/** A student testimonial / review shown on the site (real names only). */
export type Testimonial = {
  name: string;
  area?: string; // e.g. "Andheri"
  course?: string; // e.g. "D.Pharm"
  text: string;
};

export type QuickFacts = {
  duration?: string;
  eligibility?: string;
  approvedBy?: string;
  admissionStatus?: string;
};

export type Course = {
  title: string; // SEO H1, e.g. "D Pharma Admission 2026 in Mumbai"
  slug: string; // flat URL, e.g. "d-pharma-admission-2026"
  courseShortName?: string; // e.g. "D.Pharm"
  shortDescription: string; // card / preview text
  /** First 2 lines — direct answer that wins AI Overviews. */
  openingAnswer?: string;
  /** Plain "What is X" explanation. */
  whatIs?: string;
  /** Uploaded image path, e.g. "/uploads/dpharm.jpg". */
  heroImage?: string;
  quickFacts?: QuickFacts;
  /** Key selling points — scannable bullets near the top. */
  highlights?: string[];
  /** Main subjects taught — "what you will study". */
  subjects?: string[];
  eligibilityPoints?: string[];
  /** Documents needed for admission. */
  documentsRequired?: string[];
  admissionSteps?: string[];
  feesInfo?: string;
  /** Short approximate fee range shown on-page, e.g. "₹15,000–₹1,00,000/year". */
  feesRange?: string;
  /** Approving / regulatory bodies — rendered as outbound authority citations. */
  officialBodies?: OfficialBody[];
  careerScope?: string;
  /** Specific job roles after the course. */
  jobRoles?: string[];
  /** Sectors / places you can work. */
  workAreas?: string[];
  /** Starting salary guidance. */
  salaryRange?: string;
  /** What you can study after this course. */
  higherStudies?: string[];
  faqs?: FAQ[];
  seo?: { title?: string; description?: string };
  order?: number;
  /** ISO date string — when this content was last reviewed (freshness / E-E-A-T). */
  updatedAt?: string;
};

export type Branch = {
  name: string; // e.g. "Andheri"
  slug: string; // e.g. "andheri"
  area?: string; // landmark, e.g. "near Andheri station"
  address?: string;
  postalCode?: string;
  phone?: string;
  /** Google Maps share/place link for the "Get directions" button. */
  mapsUrl?: string;
  mapEmbedUrl?: string;
  /** Unique 1-2 line intro about this branch / area. */
  intro?: string;
  /** Nearby localities / areas this branch serves. */
  localities?: string[];
  /** How to reach — nearest station / landmark. */
  transport?: string;
  /** Branch-specific FAQs. */
  faqs?: FAQ[];
  order?: number;
  /** ISO date string — when this branch info was last reviewed. */
  updatedAt?: string;
};

export type SiteSettings = {
  orgName: string;
  tagline?: string;
  description?: string;
  domain?: string;
  foundingYear?: string;
  logo?: string;
  phone?: string;
  whatsappNumber?: string;
  email?: string;
  address?: string;
  mapEmbedUrl?: string;
  socials?: { facebook?: string; instagram?: string; youtube?: string };
  /** Named reviewer/author shown as a byline (E-E-A-T for YMYL pages). */
  reviewerName?: string;
  reviewerCredential?: string;
  /** Real student testimonials shown across the site. */
  testimonials?: Testimonial[];
};

/**
 * A blog article. The body is stored as ready-to-render HTML so the full
 * content ships in the server-rendered page (best for Google + AI crawlers) —
 * no client-side rendering of the article text.
 */
export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  /** ISO date string, e.g. "2026-06-10". */
  datePublished: string;
  dateModified?: string;
  author?: string;
  /** Short category/keyword tags shown on the post. */
  tags?: string[];
  heroImage?: string;
  /** A one-paragraph standfirst shown under the title. */
  excerpt?: string;
  /** Server-rendered article HTML (headings, paragraphs, lists, tables, links). */
  bodyHtml: string;
  faqs?: FAQ[];
  /** Slugs of related course pages to surface as internal links. */
  relatedCourses?: string[];
  /** Slugs of related blog posts. */
  relatedPosts?: string[];
};

export type Lead = {
  id?: number;
  createdAt?: string;
  name: string;
  phone: string;
  email?: string;
  course?: string;
  city?: string;
  sourcePage?: string;
  ip?: string;
  /** 'enquiry' (default) | 'scholarship' */
  type?: string;
  caste?: string;
  category?: string;
  percentage12?: string;
};
