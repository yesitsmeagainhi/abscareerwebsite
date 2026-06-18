import type { Branch, Course, FAQ } from "./types";
import { getBranches, getCourses } from "./content";

// ---------------------------------------------------------------------------
// Course × Location "money pages" — the local-SEO engine.
//
// For every course (6) and every branch (6) we generate a high-intent landing
// page at a flat URL like `/d-pharma-admission-thane`. These target the exact
// queries people search ("d pharma admission in thane") and are fully
// server-rendered with UNIQUE local content (each branch's real localities,
// station and address) so they are not thin/duplicate pages.
//
// The slug base is the course slug minus its `-admission-2026` suffix, so:
//   d-pharma-admission-2026  +  thane   ->  d-pharma-admission-thane
// Course slugs end in `-2026`, branch routes live under `/branches/`, so these
// flat slugs never collide with an existing route.
// ---------------------------------------------------------------------------

export type LocationPage = {
  slug: string;
  course: Course;
  branch: Branch;
};

/** "d-pharma-admission-2026" -> "d-pharma". Tolerates a bare "-2026" suffix. */
export function courseBaseSlug(course: Course): string {
  return course.slug.replace(/-admission-2026$/, "").replace(/-2026$/, "");
}

/** Flat money-page slug, e.g. "d-pharma-admission-thane". */
export function locationSlug(course: Course, branch: Branch): string {
  return `${courseBaseSlug(course)}-admission-${branch.slug}`;
}

/** The human keyword for a course in copy, e.g. "D Pharma" / "GNM Nursing". */
export function courseKeyword(course: Course): string {
  return course.courseShortName || course.title;
}

/** Build the full course × branch matrix (36 pages for 6×6). */
export async function getLocationPages(): Promise<LocationPage[]> {
  const [courses, branches] = await Promise.all([getCourses(), getBranches()]);
  const pages: LocationPage[] = [];
  for (const course of courses) {
    for (const branch of branches) {
      pages.push({ slug: locationSlug(course, branch), course, branch });
    }
  }
  return pages;
}

export async function getLocationSlugs(): Promise<string[]> {
  return (await getLocationPages()).map((p) => p.slug);
}

export async function getLocationPage(slug: string): Promise<LocationPage | null> {
  const pages = await getLocationPages();
  return pages.find((p) => p.slug === slug) ?? null;
}

/** Other branches offering the same course (for "also available in" links). */
export async function siblingsForCourse(page: LocationPage): Promise<LocationPage[]> {
  const pages = await getLocationPages();
  return pages.filter(
    (p) => p.course.slug === page.course.slug && p.branch.slug !== page.branch.slug,
  );
}

/** Other courses at the same branch (for "other courses here" links). */
export async function siblingsForBranch(page: LocationPage): Promise<LocationPage[]> {
  const pages = await getLocationPages();
  return pages.filter(
    (p) => p.branch.slug === page.branch.slug && p.course.slug !== page.course.slug,
  );
}

// --- On-page copy generated per combo (kept unique via branch + course data) ---

export function locationTitle(page: LocationPage): string {
  return `${courseKeyword(page.course)} Admission in ${page.branch.name}, Mumbai (2026)`;
}

export function locationDescription(page: LocationPage): string {
  const kw = courseKeyword(page.course);
  return `Looking for ${kw} admission in ${page.branch.name}, Mumbai? ABS Educational Solution offers free counselling, approved colleges and honest fee guidance for the 2026 batch near ${page.branch.name}.`.slice(
    0,
    160,
  );
}

export function locationIntro(page: LocationPage): string {
  const kw = courseKeyword(page.course);
  return `${kw} admission in ${page.branch.name} for 2026 is open. ABS Educational Solution helps students from ${page.branch.name} and nearby areas get ${kw} admission into approved colleges — with free, friendly counselling close to home, honest fee guidance and full support from form to seat confirmation.`;
}

/** Combo-specific FAQs — unique per course AND branch, good for FAQ rich results. */
export function locationFaqs(page: LocationPage): FAQ[] {
  const kw = courseKeyword(page.course);
  const b = page.branch.name;
  const faqs: FAQ[] = [
    {
      question: `How can I get ${kw} admission in ${b}, Mumbai for 2026?`,
      answer: `Call or WhatsApp ABS with your 12th marks and tell us you are from ${b}. Our ${b} counsellors shortlist approved ${kw} colleges near you, help you fill the form and arrange documents, and confirm your seat for the 2026 batch — completely free.`,
    },
    {
      question: `Is there a good ${kw} college near ${b}?`,
      answer: `Yes. There are approved ${kw} colleges reachable from ${b} and the surrounding areas. During free counselling we match you to the best-fit approved college based on your marks, budget and how far you can travel from ${b}.`,
    },
    {
      question: `What are the ${kw} fees near ${b}?`,
      answer: page.course.feesRange
        ? `${kw} fees are approximately ${page.course.feesRange}, depending on the college and quota. We share the exact, current 2026 fees for colleges near ${b} during free counselling — with no hidden charges.`
        : `${kw} fees vary by college and quota. We share the exact, current 2026 fees for colleges near ${b} during free counselling — with no hidden charges.`,
    },
    {
      question: `Where is the ABS ${b} branch?`,
      answer: page.branch.address
        ? `Our ${b} branch is at ${page.branch.address}. ${page.branch.transport || ""}`.trim()
        : `Our ${b} branch is easy to reach${page.branch.transport ? ` — ${page.branch.transport}` : ""}. Call us and we will guide you with directions.`,
    },
  ];
  return faqs;
}
