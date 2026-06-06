export type FAQ = { question: string; answer: string };

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
