import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import AreaCoursePage from "@/components/AreaCoursePage";
import EnquiryForm from "@/components/EnquiryForm";
import {
  JsonLd,
  breadcrumbSchema,
  courseSchema,
  faqSchema,
} from "@/components/Schema";
import {
  getBranches,
  getCourseBySlug,
  getCourseSlugs,
  getCourses,
  getSiteSettings,
} from "@/lib/content";
import {
  getLocationPage,
  getLocationSlugs,
  locationDescription,
  locationSlug,
  locationTitle,
  siblingsForBranch,
  siblingsForCourse,
} from "@/lib/locations";
import { CONTENT_UPDATED, formatDate, whatsappLink } from "@/lib/site";

export const revalidate = 3600;

export async function generateStaticParams() {
  const [courseSlugs, locationSlugs] = await Promise.all([
    getCourseSlugs(),
    getLocationSlugs(),
  ]);
  return [...courseSlugs, ...locationSlugs].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (course) {
    const title = course.seo?.title || `${course.title} | ABS`;
    const description = course.seo?.description || course.shortDescription;
    return {
      // Absolute → the page sets the full <title>, so the "| ABS" template
      // suffix isn't appended (avoids a duplicated brand). og:title/description
      // are auto-derived; omitting openGraph here lets the default OG image apply.
      title: { absolute: title },
      description,
      alternates: { canonical: `/${course.slug}` },
    };
  }
  const loc = await getLocationPage(slug);
  if (loc) {
    return {
      title: { absolute: `${locationTitle(loc)} | ABS` },
      description: locationDescription(loc),
      alternates: { canonical: `/${loc.slug}` },
    };
  }
  return { title: "Page not found" };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [course, settings, allCourses, branches] = await Promise.all([
    getCourseBySlug(slug),
    getSiteSettings(),
    getCourses(),
    getBranches(),
  ]);

  // Not a course? It may be a course×location money page (e.g. /d-pharma-admission-thane).
  if (!course) {
    const loc = await getLocationPage(slug);
    if (loc) {
      const [siblingAreas, otherCourses] = await Promise.all([
        siblingsForCourse(loc),
        siblingsForBranch(loc),
      ]);
      return (
        <AreaCoursePage
          page={loc}
          settings={settings}
          allCourses={allCourses}
          siblingAreas={siblingAreas}
          otherCourses={otherCourses}
        />
      );
    }
    notFound();
  }

  const heroUrl = course.heroImage;
  const updated = formatDate(course.updatedAt || CONTENT_UPDATED);
  const courseTitles = allCourses.map((c) => c.courseShortName || c.title);
  const qf = course.quickFacts;
  const facts = [
    { label: "Course", value: course.courseShortName || course.title },
    { label: "Duration", value: qf?.duration },
    { label: "Eligibility", value: qf?.eligibility },
    { label: "Approved by", value: qf?.approvedBy },
    { label: "Admission 2026", value: qf?.admissionStatus },
  ].filter((f) => f.value);

  return (
    <article>
      <JsonLd data={courseSchema(course, settings.orgName)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Courses", path: "/courses" },
          { name: course.courseShortName || course.title, path: `/${course.slug}` },
        ])}
      />
      {course.faqs && course.faqs.length > 0 && <JsonLd data={faqSchema(course.faqs)} />}

      {/* 1. Header + opening answer */}
      <header className="bg-brand-light">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <nav className="mb-3 text-sm text-gray-500">
            <Link href="/courses" className="hover:text-brand">
              Courses
            </Link>{" "}
            / <span className="text-gray-700">{course.courseShortName || course.title}</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">{course.title}</h1>
          {course.openingAnswer && (
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-700">
              {course.openingAnswer}
            </p>
          )}
          {(settings.reviewerName || updated) && (
            <p className="mt-3 text-sm text-gray-500">
              {settings.reviewerName && (
                <>
                  Reviewed by{" "}
                  <span className="font-medium text-gray-700">{settings.reviewerName}</span>
                  {settings.reviewerCredential ? ` — ${settings.reviewerCredential}` : ""}
                </>
              )}
              {settings.reviewerName && updated ? " · " : ""}
              {updated && <>Last updated {updated}</>}
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            {settings.phone && (
              <a
                href={`tel:${settings.phone.replace(/\s/g, "")}`}
                className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white transition hover:bg-brand-dark"
              >
                Call {settings.phone}
              </a>
            )}
            {settings.whatsappNumber && (
              <a
                href={whatsappLink(
                  settings.whatsappNumber,
                  `Hi, I want details about ${course.courseShortName || course.title} admission 2026.`,
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
        <div className="lg:col-span-2">
          {heroUrl && (
            <Image
              src={heroUrl}
              alt={course.title}
              width={1200}
              height={500}
              className="mb-8 w-full rounded-xl object-cover"
            />
          )}

          {/* 2. What is X */}
          {course.whatIs && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                What is {course.courseShortName || course.title}?
              </h2>
              <div className="prose-basic mt-3 max-w-none text-gray-700">
                <p>{course.whatIs}</p>
              </div>
            </section>
          )}

          {/* Course highlights */}
          {course.highlights && course.highlights.length > 0 && (
            <section className="mb-8 rounded-xl border border-brand/20 bg-brand-light p-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {course.courseShortName || course.title} — course highlights
              </h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {course.highlights.map((h, i) => (
                  <li key={i} className="flex gap-2 text-gray-800">
                    <span className="mt-1 text-accent">✓</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 3. Quick Facts table */}
          {facts.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Quick facts</h2>
              <table className="mt-3 w-full overflow-hidden rounded-xl border border-gray-200 text-sm">
                <tbody>
                  {facts.map((f, i) => (
                    <tr key={f.label} className={i % 2 ? "bg-gray-50" : "bg-white"}>
                      <th className="w-40 border-b border-gray-100 px-4 py-3 text-left font-semibold text-gray-700">
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
          )}

          {/* What you will study */}
          {course.subjects && course.subjects.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">What you will study</h2>
              <p className="mt-2 text-gray-700">
                Main subjects in {course.courseShortName || course.title}:
              </p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {course.subjects.map((s, i) => (
                  <li key={i} className="flex gap-2 text-gray-700">
                    <span className="mt-1 text-brand">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 4. Eligibility checklist */}
          {course.eligibilityPoints && course.eligibilityPoints.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Eligibility — can I apply?</h2>
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

          {/* Documents required */}
          {course.documentsRequired && course.documentsRequired.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Documents required</h2>
              <p className="mt-2 text-gray-700">Keep these ready for admission:</p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {course.documentsRequired.map((d, i) => (
                  <li key={i} className="flex gap-2 text-gray-700">
                    <span className="mt-1 text-accent">✓</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 5. Admission steps */}
          {course.admissionSteps && course.admissionSteps.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Admission process 2026</h2>
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

          {/* 6. Fees & duration */}
          {(course.feesInfo || course.feesRange) && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Fees & duration</h2>
              {course.feesRange && (
                <p className="mt-3 rounded-xl border border-brand/20 bg-brand-light p-4 text-gray-800">
                  <span className="font-semibold">Approximate fees:</span> {course.feesRange}{" "}
                  <span className="text-sm text-gray-500">
                    — exact fees are confirmed during free counselling.
                  </span>
                </p>
              )}
              {course.feesInfo && <p className="mt-3 text-gray-700">{course.feesInfo}</p>}
            </section>
          )}

          {/* Authority citations — approving / regulatory bodies (E-E-A-T) */}
          {course.officialBodies && course.officialBodies.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Approved & regulated by</h2>
              <p className="mt-2 text-gray-700">
                The {course.courseShortName || course.title} colleges we recommend are approved by:
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {course.officialBodies.map((b, i) => (
                  <li key={i}>
                    <a
                      href={b.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-full border border-brand px-4 py-1.5 text-sm font-medium text-brand transition hover:bg-brand-light"
                    >
                      {b.name} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 7. Career, job roles, where you work, salary */}
          {(course.careerScope ||
            course.jobRoles?.length ||
            course.workAreas?.length ||
            course.salaryRange) && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Career & scope after {course.courseShortName || course.title}
              </h2>
              {course.careerScope && <p className="mt-3 text-gray-700">{course.careerScope}</p>}

              {course.jobRoles && course.jobRoles.length > 0 && (
                <div className="mt-5">
                  <h3 className="font-semibold text-gray-900">Job roles you can get</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {course.jobRoles.map((r, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-brand-light px-3 py-1 text-sm font-medium text-brand"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {course.workAreas && course.workAreas.length > 0 && (
                <div className="mt-5">
                  <h3 className="font-semibold text-gray-900">Where you can work</h3>
                  <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                    {course.workAreas.map((w, i) => (
                      <li key={i} className="flex gap-2 text-gray-700">
                        <span className="mt-1 text-brand">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {course.salaryRange && (
                <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <h3 className="font-semibold text-gray-900">Salary you can expect</h3>
                  <p className="mt-1 text-gray-700">{course.salaryRange}</p>
                </div>
              )}
            </section>
          )}

          {/* Higher studies */}
          {course.higherStudies && course.higherStudies.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                What to study after {course.courseShortName || course.title}?
              </h2>
              <ul className="mt-3 space-y-2">
                {course.higherStudies.map((h, i) => (
                  <li key={i} className="flex gap-2 text-gray-700">
                    <span className="mt-1 text-accent">↗</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 8. Why ABS */}
          <section className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-2xl font-bold text-gray-900">Why choose ABS?</h2>
            <ul className="mt-3 grid gap-2 text-gray-700 sm:grid-cols-2">
              <li>✓ Trusted since {settings.foundingYear || "2009"}</li>
              <li>✓ 6 branches across Mumbai — near you</li>
              <li>✓ Free, honest admission counselling</li>
              <li>✓ Recognised colleges & clear fee guidance</li>
            </ul>
          </section>

          {/* Student testimonials (real names only — empty until provided) */}
          {settings.testimonials && settings.testimonials.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">What our students say</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {settings.testimonials.map((t, i) => (
                  <figure key={i} className="rounded-xl border border-gray-200 bg-white p-5">
                    <blockquote className="text-gray-700">“{t.text}”</blockquote>
                    <figcaption className="mt-3 text-sm font-semibold text-gray-900">
                      {t.name}
                      {t.area ? `, ${t.area}` : ""}
                      {t.course ? ` · ${t.course}` : ""}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}

          {/* 9. Course × location — area admission pages (local SEO + branch links) */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {course.courseShortName || course.title} admission near you
            </h2>
            <p className="mt-2 text-gray-700">
              We guide students for {course.courseShortName || course.title} across Mumbai. Pick your
              area for local guidance:
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {branches.map((b) => (
                <Link
                  key={b.slug}
                  href={`/${locationSlug(course, b)}`}
                  className="rounded-full border border-brand px-4 py-1.5 text-sm font-medium text-brand transition hover:bg-brand-light"
                >
                  {course.courseShortName || course.title} in {b.name}
                </Link>
              ))}
            </div>
            <p className="mt-4 text-gray-700">Or visit any of our 6 branches:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {branches.map((b) => (
                <Link
                  key={b.slug}
                  href={`/branches/${b.slug}`}
                  className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 transition hover:border-brand hover:text-brand"
                >
                  📍 {b.name}
                </Link>
              ))}
            </div>
          </section>

          {/* 10. FAQ */}
          {course.faqs && course.faqs.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Frequently asked questions</h2>
              <div className="mt-4 divide-y divide-gray-200 rounded-xl border border-gray-200">
                {course.faqs.map((f, i) => (
                  <details key={i} className="group p-4">
                    <summary className="cursor-pointer list-none font-medium text-gray-900">
                      {f.question}
                    </summary>
                    <p className="mt-2 text-sm text-gray-600">{f.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* 11. Bottom CTA */}
          <section className="rounded-2xl bg-brand p-6 text-center text-white">
            <h2 className="text-xl font-bold">
              Start your {course.courseShortName || course.title} admission today
            </h2>
            <p className="mt-1 text-white/90">Free counselling — we&apos;ll call you back.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {settings.phone && (
                <a
                  href={`tel:${settings.phone.replace(/\s/g, "")}`}
                  className="rounded-lg bg-white px-5 py-2.5 font-semibold text-brand hover:bg-gray-100"
                >
                  Call {settings.phone}
                </a>
              )}
              {settings.whatsappNumber && (
                <a
                  href={whatsappLink(
                    settings.whatsappNumber,
                    `Hi, I want ${course.courseShortName || course.title} admission details.`,
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
              Enquire — {course.courseShortName || course.title}
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
