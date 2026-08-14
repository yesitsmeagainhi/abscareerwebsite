import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Breadcrumbs from "@/components/Breadcrumbs";
import EnquiryForm from "@/components/EnquiryForm";
import {
  JsonLd,
  breadcrumbSchema,
  faqSchema,
  occupationSchema,
} from "@/components/Schema";
import {
  CAREERS_BASE,
  SALARY_DISCLAIMER,
  getCareerBySlug,
  getCareerSlugs,
  getCareers,
} from "@/lib/careers";
import { getCourses, getSiteSettings } from "@/lib/content";
import { CONTENT_UPDATED, formatDate } from "@/lib/site";

export const revalidate = 3600;

export function generateStaticParams() {
  return getCareerSlugs().map((career) => ({ career }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ career: string }>;
}): Promise<Metadata> {
  const { career: slug } = await params;
  const career = getCareerBySlug(slug);
  if (!career) return {};
  return {
    title: { absolute: career.metaTitle },
    description: career.metaDescription,
    alternates: { canonical: `${CAREERS_BASE}/${career.slug}` },
  };
}

export default async function CareerPage({
  params,
}: {
  params: Promise<{ career: string }>;
}) {
  const { career: slug } = await params;
  const career = getCareerBySlug(slug);
  if (!career) notFound();

  const [settings, courses] = await Promise.all([getSiteSettings(), getCourses()]);
  const courseTitles = courses.map((c) => c.courseShortName || c.title);
  const related = getCareers().filter((c) => career.relatedCareers.includes(c.slug));

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Careers after pharmacy", path: CAREERS_BASE },
    { name: career.name, path: `${CAREERS_BASE}/${career.slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <JsonLd data={occupationSchema(career)} />
      <JsonLd data={faqSchema(career.faqs)} />

      <section className="bg-gradient-to-b from-brand-light to-white">
        <div className="mx-auto max-w-4xl px-4 py-10 md:py-14">
          <Breadcrumbs items={crumbs} />
          <div className="mt-4 flex flex-wrap gap-1.5">
            {career.entryVia.map((q) => (
              <span
                key={q}
                className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand"
              >
                After {q}
              </span>
            ))}
          </div>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            {career.h1}
          </h1>
          {career.intro.map((p) => (
            <p key={p.slice(0, 40)} className="mt-4 text-lg text-gray-600">
              {p}
            </p>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* What you do */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900">What the work actually involves</h2>
          <ul className="mt-4 space-y-3">
            {career.whatYouDo.map((item) => (
              <li key={item} className="flex gap-3 text-gray-600">
                <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-sm bg-brand" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Salary */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900">What it pays</h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
            {career.salary.map((band, i) => (
              <div
                key={band.stage}
                className={`flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 ${
                  i % 2 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <span className="text-sm font-medium text-gray-700">{band.stage}</span>
                <span className="font-semibold text-gray-900">{band.range}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-gray-500">{SALARY_DISCLAIMER}</p>
        </section>

        {/* How to get there */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900">How to get there</h2>
          <ol className="mt-5 space-y-6">
            {career.steps.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-brand text-sm font-bold text-brand">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900">{step.title}</h3>
                  <p className="mt-1 text-gray-600">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Suits you if */}
        <section className="mt-12 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-bold text-gray-900">This suits you if</h2>
          <ul className="mt-4 space-y-2.5">
            {career.suitsYouIf.map((item) => (
              <li key={item} className="flex gap-3 text-gray-600">
                <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-sm bg-brand" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* The honest bit */}
        <section className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-xl font-bold text-gray-900">The part nobody tells you</h2>
          <p className="mt-2 text-gray-700">{career.reality}</p>
        </section>

        {/* FAQs */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900">Questions students ask</h2>
          <div className="mt-4 divide-y divide-gray-200 border-t border-gray-200">
            {career.faqs.map((f) => (
              <details key={f.question} className="py-4">
                <summary className="cursor-pointer list-none font-semibold text-gray-900 marker:hidden">
                  {f.question}
                </summary>
                <p className="mt-2 text-gray-600">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Where it starts */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900">Where this path starts</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {career.relatedCourses.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-brand hover:shadow-md"
              >
                <span className="font-semibold text-gray-900">{c.label}</span>
                <span className="mt-1 block text-sm text-brand">Eligibility, fees & process →</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Related careers */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">Other paths worth comparing</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {related.map((c) => (
                <Link
                  key={c.slug}
                  href={`${CAREERS_BASE}/${c.slug}`}
                  className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-brand hover:shadow-md"
                >
                  <span className="font-semibold text-gray-900">{c.name}</span>
                  <span className="mt-1 block text-sm text-gray-600">{c.summary}</span>
                </Link>
              ))}
            </div>
            <Link
              href={CAREERS_BASE}
              className="mt-5 inline-block text-sm font-semibold text-brand underline"
            >
              ← All careers after pharmacy
            </Link>
          </section>
        )}

        {/* Enquiry */}
        <section className="mt-12 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900">Talk it through with a counsellor</h2>
          <p className="mb-4 mt-1 text-sm text-gray-600">
            {settings.orgName || "ABS"} has guided students into pharmacy since 2009. Tell us where
            you are and we&apos;ll call you back — free, at any of our six Mumbai branches or on the
            phone.
          </p>
          <EnquiryForm courses={courseTitles} />
        </section>

        <p className="mt-8 text-xs text-gray-500">
          Reviewed on {formatDate(CONTENT_UPDATED)}. Rules, fees and recruitment processes referred
          to here are set by DTE Maharashtra, the Pharmacy Council of India, the State Pharmacy
          Council and the FDA, and change from time to time — always confirm the current position
          before you act on it.
        </p>
      </div>
    </>
  );
}
