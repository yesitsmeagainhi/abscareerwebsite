import type { Branch, Course, FAQ } from "./types";
import { getBranches, getCourses } from "./content";
import { courseBaseSlug, courseKeyword } from "./locations";

// ---------------------------------------------------------------------------
// Course × Locality "area pages" — the second layer of the local-SEO engine.
//
// The course×branch engine (lib/locations.ts) covers our 6 branch cities. This
// layer goes one level finer: the real neighbourhoods each branch actually
// serves (Naupada, Chembur, Goregaon…). Each locality is mapped to exactly ONE
// parent branch and carries a genuine local `hook` (nearest station / landmark /
// which line) so the page is a real service-area page, NOT a doorway page:
//   - unique H1 + title + opening answer per locality
//   - a real, locality-specific travel fact (the `hook`)
//   - the serving branch's real NAP (address, phone, directions)
//   - links up to the branch money page + the course pillar, and to siblings
//
// Slug pattern mirrors the branch money pages so it reads naturally and never
// collides (locality slugs are disjoint from the 6 branch slugs):
//   d-pharma  +  naupada  ->  d-pharma-admission-naupada
//
// ⚠️ YMYL: keep this list to genuinely-distinct places with a real hook. Do not
// pad it with pincodes or "(nearby)" duplicates — that turns area pages into
// doorway pages and gets a YMYL site demoted. Curate over multiply.
// ---------------------------------------------------------------------------

export type Locality = {
  name: string; // display name, e.g. "Naupada"
  slug: string; // URL part, e.g. "naupada" (must not equal any branch slug)
  branchSlug: string; // the parent branch that serves this locality
  /** A real, locality-specific detail woven into the copy (station / line / landmark). */
  hook: string;
};

// Curated real Mumbai neighbourhoods, each assigned to the single ABS branch
// that genuinely serves it. Hooks are real geography — edit/extend as needed,
// but every entry must keep a distinct local hook (see the YMYL note above).
export const localities: Locality[] = [
  // --- Thane branch ---
  { name: "Naupada", slug: "naupada", branchSlug: "thane", hook: "one of Thane's oldest residential areas, a short auto ride from Thane station" },
  { name: "Ghodbunder Road", slug: "ghodbunder-road", branchSlug: "thane", hook: "the Kasarvadavali–Waghbil corridor along Ghodbunder Road in western Thane" },
  { name: "Majiwada", slug: "majiwada", branchSlug: "thane", hook: "the junction where the Eastern Express Highway meets Ghodbunder Road" },
  { name: "Wagle Estate", slug: "wagle-estate", branchSlug: "thane", hook: "Thane's MIDC industrial and residential belt near Mulund Check Naka" },
  { name: "Kalwa", slug: "kalwa", branchSlug: "thane", hook: "just across the creek from Thane on the Central line" },
  { name: "Mumbra", slug: "mumbra", branchSlug: "thane", hook: "on the Central line towards Kalyan, a few stops from Thane" },
  { name: "Mulund", slug: "mulund", branchSlug: "thane", hook: "the adjoining Central-line suburb, easily reached from our Thane branch" },

  // --- Kurla branch ---
  { name: "Chembur", slug: "chembur", branchSlug: "kurla", hook: "a well-connected central suburb on the Harbour line and Monorail" },
  { name: "Ghatkopar", slug: "ghatkopar", branchSlug: "kurla", hook: "on the Central line and Metro Line 1, one stop from Kurla" },
  { name: "Sion", slug: "sion", branchSlug: "kurla", hook: "on the central-Mumbai border, close to Kurla on the Central line" },
  { name: "Tilak Nagar", slug: "tilak-nagar", branchSlug: "kurla", hook: "a Kurla-East neighbourhood beside Tilak Nagar station" },
  { name: "Chunabhatti", slug: "chunabhatti", branchSlug: "kurla", hook: "a Harbour-line halt between Kurla and Chembur" },

  // --- Malad branch ---
  { name: "Goregaon", slug: "goregaon", branchSlug: "malad", hook: "the adjoining Western-line suburb, minutes from our Malad branch" },
  { name: "Kandivali", slug: "kandivali", branchSlug: "malad", hook: "one stop north of Malad on the Western line" },
  { name: "Malvani", slug: "malvani", branchSlug: "malad", hook: "the Malad-West locality near Marve Road" },
  { name: "Borivali", slug: "borivali", branchSlug: "malad", hook: "the busy Western-line hub just north, reachable from our Malad branch" },

  // --- Bhayandar branch ---
  { name: "Mira Road", slug: "mira-road", branchSlug: "bhayandar", hook: "the fast-growing township one stop south of Bhayandar on the Western line" },
  { name: "Naigaon", slug: "naigaon", branchSlug: "bhayandar", hook: "on the Western line towards Vasai, reachable from our Bhayandar branch" },
  { name: "Uttan", slug: "uttan", branchSlug: "bhayandar", hook: "the coastal belt west of Bhayandar" },

  // --- Nalasopara branch ---
  { name: "Vasai", slug: "vasai", branchSlug: "nalasopara", hook: "the Vasai-Road side of the Vasai–Virar belt on the Western line" },
  { name: "Virar", slug: "virar", branchSlug: "nalasopara", hook: "the northern end of the Western line, close to our Nalasopara branch" },

  // --- Andheri branch ---
  { name: "Lokhandwala", slug: "lokhandwala", branchSlug: "andheri", hook: "the Andheri-West residential and market hub" },
  { name: "Versova", slug: "versova", branchSlug: "andheri", hook: "on Metro Line 1 near Versova beach, in western Andheri" },
  { name: "Jogeshwari", slug: "jogeshwari", branchSlug: "andheri", hook: "one stop north of Andheri on the Western line" },
  { name: "Vile Parle", slug: "vile-parle", branchSlug: "andheri", hook: "one stop south of Andheri on the Western and Harbour lines" },
  { name: "Marol", slug: "marol", branchSlug: "andheri", hook: "the Andheri-East MIDC and office belt on Metro Line 1" },
];

export type LocalityPage = {
  slug: string;
  course: Course;
  locality: Locality;
  branch: Branch; // the parent branch that serves this locality (real NAP)
};

/** Flat area-page slug, e.g. "d-pharma-admission-naupada". */
export function localitySlug(course: Course, locality: Locality): string {
  return `${courseBaseSlug(course)}-admission-${locality.slug}`;
}

/** Build the full course × locality matrix (courses × curated localities). */
export async function getLocalityPages(): Promise<LocalityPage[]> {
  const [courses, branches] = await Promise.all([getCourses(), getBranches()]);
  const branchBySlug = new Map(branches.map((b) => [b.slug, b]));
  const pages: LocalityPage[] = [];
  for (const course of courses) {
    for (const locality of localities) {
      const branch = branchBySlug.get(locality.branchSlug);
      if (!branch) continue; // locality with no live parent branch is skipped
      pages.push({ slug: localitySlug(course, locality), course, locality, branch });
    }
  }
  return pages;
}

export async function getLocalitySlugs(): Promise<string[]> {
  return (await getLocalityPages()).map((p) => p.slug);
}

export async function getLocalityPage(slug: string): Promise<LocalityPage | null> {
  const pages = await getLocalityPages();
  return pages.find((p) => p.slug === slug) ?? null;
}

/** All locality area pages for a given course under a given branch (down-links). */
export async function localitiesForArea(
  courseSlug: string,
  branchSlug: string,
): Promise<LocalityPage[]> {
  const pages = await getLocalityPages();
  return pages.filter((p) => p.course.slug === courseSlug && p.branch.slug === branchSlug);
}

/** Other localities under the SAME branch for the same course (sideways links). */
export async function localitySiblings(page: LocalityPage): Promise<LocalityPage[]> {
  const pages = await getLocalityPages();
  return pages.filter(
    (p) =>
      p.course.slug === page.course.slug &&
      p.branch.slug === page.branch.slug &&
      p.locality.slug !== page.locality.slug,
  );
}

// --- On-page copy, generated per combo and kept unique via the locality hook ---

export function localityTitle(page: LocalityPage): string {
  return `${courseKeyword(page.course)} Admission in ${page.locality.name}, Mumbai (2026)`;
}

export function localityDescription(page: LocalityPage): string {
  const kw = courseKeyword(page.course);
  return `${kw} admission in ${page.locality.name}? ABS guides ${page.locality.name} students into approved colleges for 2026 — free counselling from our ${page.branch.name} branch, honest fees, full support.`.slice(
    0,
    160,
  );
}

export function localityIntro(page: LocalityPage): string {
  const kw = courseKeyword(page.course);
  const { locality, branch } = page;
  return `${kw} admission in ${locality.name} for 2026 is open. ${locality.name} is ${locality.hook}, and ABS Educational Solution guides students from ${locality.name} into approved ${kw} colleges through our nearby ${branch.name} branch — with free, friendly counselling, honest fee guidance and full support from form to seat confirmation.`;
}

/** Combo-specific FAQs — unique per course AND locality (good for FAQ rich results). */
export function localityFaqs(page: LocalityPage): FAQ[] {
  const kw = courseKeyword(page.course);
  const { locality, branch } = page;
  return [
    {
      question: `How can a student from ${locality.name} get ${kw} admission for 2026?`,
      answer: `Call or WhatsApp ABS and tell us you are from ${locality.name} with your 12th marks. Our ${branch.name} counsellors — who serve ${locality.name} (${locality.hook}) — shortlist approved ${kw} colleges near you, help with the form and documents, and confirm your seat for the 2026 batch, completely free.`,
    },
    {
      question: `Which ABS branch is nearest to ${locality.name}?`,
      answer: branch.address
        ? `Our ${branch.name} branch serves ${locality.name}. It is at ${branch.address}.${branch.transport ? ` ${branch.transport}` : ""}`
        : `Our ${branch.name} branch serves ${locality.name}.${branch.transport ? ` ${branch.transport}` : ""} Call us and we will guide you with directions.`,
    },
    {
      question: `Is there a good ${kw} college near ${locality.name}?`,
      answer: `Yes. There are approved ${kw} colleges reachable from ${locality.name} and the wider ${branch.name} area. During free counselling we match you to the best-fit approved college based on your marks, budget and how far you can travel.`,
    },
    {
      question: `What are the ${kw} fees for ${locality.name} students?`,
      answer: page.course.feesRange
        ? `${kw} fees are approximately ${page.course.feesRange}, depending on the college and quota. We share the exact, current 2026 fees during free counselling — with no hidden charges.`
        : `${kw} fees vary by college and quota. We share the exact, current 2026 fees during free counselling — with no hidden charges.`,
    },
  ];
}
