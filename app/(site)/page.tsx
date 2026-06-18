import type { Metadata } from "next";
import Link from "next/link";

import CourseCard from "@/components/CourseCard";
import EnquiryForm from "@/components/EnquiryForm";
import { JsonLd, organizationSchema, websiteSchema } from "@/components/Schema";
import { getBlogPosts } from "@/lib/blog";
import { getBranches, getCourses, getSiteSettings } from "@/lib/content";
import { courseKeyword, locationSlug } from "@/lib/locations";
import { formatDate } from "@/lib/site";

export const revalidate = 3600; // ISR — refresh from CMS hourly

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const TRUST = [
  { stat: "16+", label: "Years of experience" },
  { stat: "16K+", label: "Students enrolled" },
  { stat: "88K+", label: "Counselling sessions" },
  { stat: "6", label: "Branches in Mumbai" },
];

const WHY = [
  {
    title: "Verified colleges only",
    body: "We recommend INC / State-Council recognised institutes — no fake promises, no surprises.",
  },
  {
    title: "End-to-end support",
    body: "From course selection to document submission, our counsellors handle the whole process with you.",
  },
  {
    title: "Honest fee guidance",
    body: "We explain the real fee structure upfront so you can plan with confidence.",
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
              D.Pharm, Nursing & Paramedical Admissions 2026, made simple.
            </h1>
            <p className="mt-4 text-lg text-gray-600">{settings.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/courses"
                className="rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark"
              >
                Explore Courses
              </Link>
              <Link
                href="/contact"
                className="rounded-lg border border-brand px-6 py-3 font-semibold text-brand transition hover:bg-brand-light"
              >
                Talk to a Counsellor
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900">Get Free Admission Guidance</h2>
            <p className="mb-4 mt-1 text-sm text-gray-500">
              Tell us a bit about you — we&apos;ll call you back.
            </p>
            <EnquiryForm courses={courseTitles} variant="compact" />
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
          <h2 className="text-3xl font-bold text-gray-900">Courses we help you get into</h2>
          <p className="mt-2 text-gray-600">
            Choose a course to see eligibility, scope, and admission guidance.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </section>

      {/* Why ABS */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
            Why students choose ABS
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {WHY.map((w) => (
              <div key={w.title} className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-gray-900">{w.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{w.body}</p>
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
            <h2 className="text-3xl font-bold text-gray-900">Popular admission searches</h2>
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

      {/* Closing CTA with full form */}
      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Ready to start your admission?
          </h2>
          <p className="mb-6 mt-1 text-center text-gray-600">
            Fill the form and our counsellor will guide you for free.
          </p>
          <EnquiryForm courses={courseTitles} />
        </div>
      </section>
    </>
  );
}
