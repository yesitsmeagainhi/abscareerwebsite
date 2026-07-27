import Link from "next/link";

import Breadcrumbs from "@/components/Breadcrumbs";
import EnquiryForm from "@/components/EnquiryForm";
import {
  JsonLd,
  areaCourseSchema,
  branchSchema,
  breadcrumbSchema,
  faqSchema,
  howToSchema,
  speakableSchema,
} from "@/components/Schema";
import type { Course, SiteSettings } from "@/lib/types";
import { courseKeyword, locationSlug } from "@/lib/locations";
import {
  localityFaqs,
  localityIntro,
  type LocalityPage,
} from "@/lib/localities";
import { SITE_URL, whatsappLink } from "@/lib/site";

// Renders a single course×locality area page (e.g. D Pharma admission in
// Naupada). Fully server-rendered. Each page is kept genuinely distinct by the
// locality's real hook (nearest station / landmark) and its serving branch's
// real NAP — a service-area page, not a doorway page. It links UP to the branch
// money page and the course pillar, and SIDEWAYS to other localities nearby.
export default function LocalityCoursePage({
  page,
  settings,
  allCourses,
  siblings,
}: {
  page: LocalityPage;
  settings: SiteSettings;
  allCourses: Course[];
  siblings: LocalityPage[];
}) {
  const { course, locality, branch } = page;
  const kw = courseKeyword(course);
  const phone = branch.phone || settings.phone;
  const courseTitles = allCourses.map((c) => c.courseShortName || c.title);
  const url = `${SITE_URL}/${page.slug}`;
  const areaSlug = locationSlug(course, branch); // the branch money page, e.g. /d-pharma-admission-thane
  const faqs = localityFaqs(page);
  const howTo = howToSchema(course);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: kw, path: `/${course.slug}` },
    { name: `${branch.name}`, path: `/${areaSlug}` },
    { name: locality.name, path: `/${page.slug}` },
  ];

  return (
    <article>
      <JsonLd data={areaCourseSchema(course, branch, settings.orgName, url)} />
      <JsonLd data={branchSchema(branch, settings.orgName, settings.phone)} />
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <JsonLd data={faqSchema(faqs)} />
      {howTo && <JsonLd data={howTo} />}
      <JsonLd data={speakableSchema(url)} />

      {/* Header */}
      <header className="bg-brand-light">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <Breadcrumbs items={crumbs} />
          <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
            {kw} Admission in {locality.name}, Mumbai — 2026
          </h1>
          <p className="speakable-answer mt-4 max-w-2xl text-lg leading-relaxed text-gray-700">
            {localityIntro(page)}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {phone && (
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white transition hover:bg-brand-dark"
              >
                Call {phone}
              </a>
            )}
            {settings.whatsappNumber && (
              <a
                href={whatsappLink(
                  settings.whatsappNumber,
                  `Hi, I want ${kw} admission — I'm from ${locality.name}. Details for 2026?`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-brand px-5 py-2.5 font-semibold text-brand transition hover:bg-white"
              >
                WhatsApp us
              </a>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* Why ABS for this locality */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900">
              {kw} admission for {locality.name} students
            </h2>
            <p className="mt-3 text-gray-700">
              {locality.name} is {locality.hook}. Students from here get {kw} admission guidance at
              our nearby ABS {branch.name} branch — approved colleges only, honest 2026 fees, and
              support through every step, from choosing the right college to confirming your seat.
            </p>
            <ul className="mt-4 grid gap-2 text-gray-700 sm:grid-cols-2">
              <li>✓ Free {kw} counselling near {locality.name}</li>
              <li>✓ Approved / recognised colleges only</li>
              <li>✓ Honest, upfront fee guidance</li>
              <li>✓ Trusted since {settings.foundingYear || "2009"}</li>
            </ul>
          </section>

          {/* Nearest branch + how to reach (real NAP) */}
          {(branch.address || branch.transport) && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                Your nearest branch from {locality.name} — ABS {branch.name}
              </h2>
              {branch.address && <p className="mt-2 text-gray-700">{branch.address}</p>}
              {branch.transport && <p className="mt-2 text-gray-700">{branch.transport}</p>}
              {branch.mapsUrl && (
                <a
                  href={branch.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-semibold text-brand hover:underline"
                >
                  📍 Get directions on Google Maps →
                </a>
              )}
            </section>
          )}

          {/* Quick facts */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900">{kw} — quick facts</h2>
            <table className="mt-3 w-full overflow-hidden rounded-xl border border-gray-200 text-sm">
              <tbody>
                {[
                  { label: "Course", value: kw },
                  { label: "Duration", value: course.quickFacts?.duration },
                  { label: "Eligibility", value: course.quickFacts?.eligibility },
                  { label: "Approved by", value: course.quickFacts?.approvedBy },
                  { label: "Approx. fees", value: course.feesRange },
                  { label: "Admission 2026", value: course.quickFacts?.admissionStatus || "Open" },
                  { label: "Serving branch", value: `ABS ${branch.name}, Mumbai` },
                ]
                  .filter((f) => f.value)
                  .map((f, i) => (
                    <tr key={f.label} className={i % 2 ? "bg-gray-50" : "bg-white"}>
                      <th className="w-44 border-b border-gray-100 px-4 py-3 text-left font-semibold text-gray-700">
                        {f.label}
                      </th>
                      <td className="border-b border-gray-100 px-4 py-3 text-gray-800">
                        {f.value}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </section>

          {/* Eligibility */}
          {course.eligibilityPoints && course.eligibilityPoints.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                {kw} eligibility — can I apply from {locality.name}?
              </h2>
              <ul className="mt-3 space-y-2">
                {course.eligibilityPoints.map((p, i) => (
                  <li key={i} className="flex gap-2 text-gray-700">
                    <span className="mt-1 text-accent">✓</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Admission steps */}
          {course.admissionSteps && course.admissionSteps.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                {kw} admission process from {locality.name} (2026)
              </h2>
              <ol className="mt-3 space-y-3">
                {course.admissionSteps.map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 text-gray-700">{s}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Link equity: up to the branch money page and the course pillar */}
          <section className="rounded-xl border border-brand/20 bg-brand-light p-5">
            <p className="text-gray-800">
              Want {kw} details for the whole {branch.name} area?{" "}
              <Link href={`/${areaSlug}`} className="font-semibold text-brand hover:underline">
                See {kw} admission in {branch.name} →
              </Link>
            </p>
            <p className="mt-2 text-gray-800">
              Or read the full {kw} guide — subjects, career scope, salary and more:{" "}
              <Link href={`/${course.slug}`} className="font-semibold text-brand hover:underline">
                Complete {kw} guide →
              </Link>
            </p>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900">
              {kw} admission in {locality.name} — FAQs
            </h2>
            <div className="mt-4 divide-y divide-gray-200 rounded-xl border border-gray-200">
              {faqs.map((f, i) => (
                <details key={i} className="group p-4">
                  <summary className="cursor-pointer list-none font-medium text-gray-900">
                    {f.question}
                  </summary>
                  <p className="mt-2 text-sm text-gray-600">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Same course in other nearby localities */}
          {siblings.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-gray-900">
                {kw} admission in other areas near {branch.name}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {siblings.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/${s.slug}`}
                    className="rounded-full border border-brand px-4 py-1.5 text-sm font-medium text-brand transition hover:bg-brand-light"
                  >
                    {kw} in {s.locality.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Bottom CTA */}
          <section className="rounded-2xl bg-brand p-6 text-center text-white">
            <h2 className="text-xl font-bold">
              Start your {kw} admission from {locality.name} today
            </h2>
            <p className="mt-1 text-white/90">Free counselling — we&apos;ll call you back.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="rounded-lg bg-white px-5 py-2.5 font-semibold text-brand hover:bg-gray-100"
                >
                  Call {phone}
                </a>
              )}
              {settings.whatsappNumber && (
                <a
                  href={whatsappLink(
                    settings.whatsappNumber,
                    `Hi, I want ${kw} admission — I'm from ${locality.name}.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-white px-5 py-2.5 font-semibold text-white hover:bg-white/10"
                >
                  WhatsApp
                </a>
              )}
            </div>
          </section>
        </div>

        {/* Sticky enquiry sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-20 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">
              Enquire — {kw} in {locality.name}
            </h2>
            <p className="mb-4 mt-1 text-sm text-gray-500">
              Free counselling. We&apos;ll call you back.
            </p>
            <EnquiryForm
              courses={courseTitles}
              defaultCourse={course.courseShortName || course.title}
              variant="compact"
            />
          </div>
        </aside>
      </div>
    </article>
  );
}
