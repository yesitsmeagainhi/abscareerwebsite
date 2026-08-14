import type { Metadata } from "next";
import Link from "next/link";

import CourseCard from "@/components/CourseCard";
import EnquiryForm from "@/components/EnquiryForm";
import { JsonLd, organizationSchema, websiteSchema } from "@/components/Schema";
import { getBlogPosts } from "@/lib/blog";
import { CAREERS_BASE, getCareers } from "@/lib/careers";
import { getBranches, getCourses, getSiteSettings } from "@/lib/content";
import { courseKeyword, locationSlug } from "@/lib/locations";
import { formatDate } from "@/lib/site";

export const revalidate = 3600; // ISR — refresh from CMS hourly

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const TRUST = [
  { stat: "2009", label: "Guiding students since" },
  { stat: "16,000+", label: "Students guided" },
  { stat: "6", label: "Branches across Mumbai" },
  { stat: "₹0", label: "Our fee to students" },
];

// Decision help, not a sales pitch. Each card answers a question students
// actually arrive with, and sends them to the page that answers it properly.
const DECISIONS = [
  {
    title: "D.Pharma or B.Pharma?",
    body: "D.Pharma is two years and gets you registered as a pharmacist — enough to run your own medical store. B.Pharma is four years and opens QC, QA and the industry ladder. If you want the shop, the diploma is the shorter road; if you want industry, plan for the degree.",
    href: "/careers-after-pharmacy/higher-studies",
    cta: "Compare the study paths",
  },
  {
    title: "A job, or a business of your own?",
    body: "Pharmacy is one of very few courses after 12th where you can end up owning the business, because a retail drug licence needs a registered pharmacist. Most students never hear this until they are already enrolled.",
    href: "/careers-after-pharmacy/medical-store-owner",
    cta: "How the medical-store route works",
  },
  {
    title: "No NEET score. What now?",
    body: "Neither pharmacy course needs NEET — admission runs through DTE on your Class 12 marks. That makes pharmacy the most practical medical-side route for students who did not write NEET or did not clear it.",
    href: "/d-pharma-admission-2026",
    cta: "See the eligibility and process",
  },
];

export default async function HomePage() {
  const [settings, courses, branches, allPosts] = await Promise.all([
    getSiteSettings(),
    getCourses(),
    getBranches(),
    getBlogPosts(),
  ]);
  const courseTitles = courses.map((c) => c.courseShortName || c.title);
  const posts = allPosts.slice(0, 4);
  // A few high-intent local searches for internal linking from the homepage.
  const popularSearches = courses
    .slice(0, 3)
    .flatMap((c) => branches.map((b) => ({ course: c, branch: b })));

  return (
    <>
      <JsonLd data={websiteSchema(settings)} />
      <JsonLd data={organizationSchema(settings, branches)} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-light to-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
          <div>
            <span className="inline-block rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand">
              {settings.tagline}
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
              Build a pharmacy career. Admissions 2026, made simple.
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              D.Pharma and B.Pharma admission guidance in Mumbai — no NEET needed. We start with
              where it leads: your own medical store, hospital and government pharmacist posts, or
              the pharma industry. Nursing and paramedical admissions too.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/careers-after-pharmacy"
                className="rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark"
              >
                Careers After Pharmacy
              </Link>
              <Link
                href="/courses"
                className="rounded-lg border border-brand px-6 py-3 font-semibold text-brand transition hover:bg-brand-light"
              >
                Explore Courses
              </Link>
            </div>
          </div>

          {/* Editorial panel, not a form. The hero's job is to show where the
              course leads — the enquiry form sits at the foot of the page. */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-brand">
              Where it leads
            </h2>
            <ul className="mt-4 divide-y divide-gray-100">
              {getCareers().map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`${CAREERS_BASE}/${c.slug}`}
                    className="flex items-baseline justify-between gap-4 py-2.5 transition hover:text-brand"
                  >
                    <span className="font-medium text-gray-900">{c.name}</span>
                    <span className="shrink-0 text-xs text-gray-500">{c.salary[0]?.range}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-gray-500">
              Indicative starting figures for Mumbai. No one can guarantee a salary or a placement.
            </p>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-gray-100 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 md:grid-cols-4">
          {TRUST.map((t) => (
            <div key={t.label} className="text-center">
              <div className="text-3xl font-bold text-brand">{t.stat}</div>
              <div className="mt-1 text-sm text-gray-600">{t.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">The courses these careers start from</h2>
          <p className="mt-2 text-gray-600">
            Eligibility, duration, fees and the admission process for each.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </section>

      {/* Careers after pharmacy — the site's lead story, and the internal-link
          hub into the six career guides. */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Where a pharmacy course takes you</h2>
            <p className="mx-auto mt-2 max-w-2xl text-gray-600">
              Most families ask what the course costs. The better question is what it leads to —
              including the one path where you end up owning the business.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {getCareers().map((c) => (
              <Link
                key={c.slug}
                href={`${CAREERS_BASE}/${c.slug}`}
                className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-lg"
              >
                <h3 className="font-semibold text-gray-900">{c.name}</h3>
                <p className="mt-2 flex-1 text-sm text-gray-600">{c.summary}</p>
                <span className="mt-3 text-sm font-medium text-gray-500">
                  Starts at {c.salary[0]?.range}
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href={CAREERS_BASE}
              className="rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark"
            >
              See all careers after pharmacy →
            </Link>
          </div>
        </div>
      </section>

      {/* Decision help — replaces the old "why choose us" block. */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-8 max-w-2xl">
            <h2 className="text-3xl font-bold text-gray-900">The three questions students arrive with</h2>
            <p className="mt-2 text-gray-600">
              Worth working out before you pick a course, not after.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {DECISIONS.map((d) => (
              <div key={d.title} className="flex flex-col rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900">{d.title}</h3>
                <p className="mt-2 flex-1 text-sm text-gray-600">{d.body}</p>
                <Link href={d.href} className="mt-4 text-sm font-semibold text-brand hover:underline">
                  {d.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Branches */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">6 branches across Mumbai</h2>
          <p className="mt-2 text-gray-600">
            There&apos;s always an ABS office near you for free, face-to-face counselling.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {branches.map((b) => (
            <Link
              key={b.slug}
              href={`/branches/${b.slug}`}
              className="rounded-full border border-brand px-5 py-2 font-medium text-brand transition hover:bg-brand-light"
            >
              📍 {b.name}
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/branches" className="text-sm font-semibold text-brand underline">
            See all branches
          </Link>
        </div>
      </section>

      {/* Popular local searches — internal links into the money pages */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Guidance near you</h2>
            <p className="mt-2 text-gray-600">
              Get local, area-specific admission guidance across Mumbai.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {popularSearches.map(({ course, branch }) => (
              <Link
                key={`${course.slug}-${branch.slug}`}
                href={`/${locationSlug(course, branch)}`}
                className="rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 transition hover:border-brand hover:text-brand"
              >
                {courseKeyword(course)} in {branch.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest from the blog */}
      {posts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Admission guides & advice</h2>
              <p className="mt-2 text-gray-600">
                Honest guides on fees, eligibility and choosing the right course.
              </p>
            </div>
            <Link href="/blog" className="hidden text-sm font-semibold text-brand underline sm:block">
              View all →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-lg"
              >
                <h3 className="font-semibold text-gray-900">{post.title}</h3>
                <p className="mt-2 flex-1 text-sm text-gray-600">
                  {post.excerpt || post.description}
                </p>
                <time className="mt-3 text-xs text-gray-500" dateTime={post.datePublished}>
                  {formatDate(post.datePublished)}
                </time>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* One quiet enquiry point, at the foot of the page rather than in the hero. */}
      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-2xl border border-gray-200 bg-white p-8">
          <h2 className="text-2xl font-bold text-gray-900">Have a question?</h2>
          <p className="mb-6 mt-1 text-gray-600">
            Ask it and a counsellor will answer — about a course, a career path, fees, or whether
            any of this fits your marks. There is no charge, and no obligation to enrol anywhere.
          </p>
          <EnquiryForm courses={courseTitles} />
        </div>
      </section>
    </>
  );
}
