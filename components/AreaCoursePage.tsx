import Link from "next/link";

import Breadcrumbs from "@/components/Breadcrumbs";
import EnquiryForm from "@/components/EnquiryForm";
import {
  JsonLd,
  areaCourseSchema,
  branchSchema,
  breadcrumbSchema,
  faqSchema,
} from "@/components/Schema";
import type { Course, SiteSettings } from "@/lib/types";
import {
  courseKeyword,
  locationFaqs,
  locationIntro,
  type LocationPage,
} from "@/lib/locations";
import { SITE_URL, whatsappLink } from "@/lib/site";

// Renders a single course×location "money page" (e.g. D Pharma admission in
// Thane). Fully server-rendered, with unique local content (the branch's real
// localities, transport, address) so each of the 36 pages is genuinely distinct.
export default function AreaCoursePage({
  page,
  settings,
  allCourses,
  siblingAreas,
  otherCourses,
}: {
  page: LocationPage;
  settings: SiteSettings;
  allCourses: Course[];
  siblingAreas: LocationPage[];
  otherCourses: LocationPage[];
}) {
  const { course, branch } = page;
  const kw = courseKeyword(course);
  const phone = branch.phone || settings.phone;
  const courseTitles = allCourses.map((c) => c.courseShortName || c.title);
  const url = `${SITE_URL}/${page.slug}`;
  const faqs = locationFaqs(page);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: kw, path: `/${course.slug}` },
    { name: `${branch.name}`, path: `/${page.slug}` },
  ];

  return (
    <article>
      <JsonLd data={areaCourseSchema(course, branch, settings.orgName, url)} />
      <JsonLd data={branchSchema(branch, settings.orgName, settings.phone)} />
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <JsonLd data={faqSchema(faqs)} />

      {/* Header */}
      <header className="bg-brand-light">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <Breadcrumbs items={crumbs} />
          <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
            {kw} Admission in {branch.name}, Mumbai — 2026
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-700">
            {locationIntro(page)}
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
                  `Hi, I want ${kw} admission near ${branch.name} for 2026.`,
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
          {/* Why ABS branch for this course */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900">
              Why choose ABS {branch.name} for {kw} admission?
            </h2>
            <p className="mt-3 text-gray-700">
              {branch.intro ||
                `Our ${branch.name} branch helps students across the area get admission with free, honest counselling.`}{" "}
              For {kw}, our {branch.name} counsellors guide you to approved colleges, explain the
              real 2026 fees, and support you through every step — from choosing the right college to
              confirming your seat.
            </p>
            <ul className="mt-4 grid gap-2 text-gray-700 sm:grid-cols-2">
              <li>✓ Free {kw} counselling near {branch.name}</li>
              <li>✓ Approved / recognised colleges only</li>
              <li>✓ Honest, upfront fee guidance</li>
              <li>✓ Trusted since {settings.foundingYear || "2009"}</li>
            </ul>
          </section>

          {/* Localities served — unique per branch */}
          {branch.localities && branch.localities.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                Areas near {branch.name} we serve for {kw}
              </h2>
              <p className="mt-2 text-gray-700">
                Students from these areas around {branch.name} come to ABS for {kw} admission:
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {branch.localities.map((a) => (
                  <span
                    key={a}
                    className="rounded-full bg-brand-light px-3 py-1 text-sm font-medium text-brand"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* How to reach + address */}
          {(branch.address || branch.transport) && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                ABS {branch.name} branch — how to reach
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
                  { label: "Location", value: `${branch.name}, Mumbai` },
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
                {kw} eligibility — can I apply from {branch.name}?
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
                {kw} admission process from {branch.name} (2026)
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

          {/* Read more about the course (link equity to the pillar page) */}
          <section className="rounded-xl border border-brand/20 bg-brand-light p-5">
            <p className="text-gray-800">
              Want the full {kw} course details — subjects, career scope, salary and more?{" "}
              <Link href={`/${course.slug}`} className="font-semibold text-brand hover:underline">
                Read the complete {kw} guide →
              </Link>
            </p>
            <p className="mt-2 text-gray-800">
              Prefer to visit us?{" "}
              <Link
                href={`/branches/${branch.slug}`}
                className="font-semibold text-brand hover:underline"
              >
                See the ABS {branch.name} branch page →
              </Link>
            </p>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900">
              {kw} admission in {branch.name} — FAQs
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

          {/* Same course in other areas */}
          {siblingAreas.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-gray-900">
                {kw} admission in other Mumbai areas
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {siblingAreas.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/${s.slug}`}
                    className="rounded-full border border-brand px-4 py-1.5 text-sm font-medium text-brand transition hover:bg-brand-light"
                  >
                    {kw} in {s.branch.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Other courses at this branch */}
          {otherCourses.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-gray-900">
                Other courses at ABS {branch.name}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {otherCourses.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/${s.slug}`}
                    className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 transition hover:border-brand hover:text-brand"
                  >
                    {courseKeyword(s.course)} in {branch.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Bottom CTA */}
          <section className="rounded-2xl bg-brand p-6 text-center text-white">
            <h2 className="text-xl font-bold">
              Start your {kw} admission in {branch.name} today
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
                    `Hi, I want ${kw} admission near ${branch.name}.`,
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
              Enquire — {kw} in {branch.name}
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
