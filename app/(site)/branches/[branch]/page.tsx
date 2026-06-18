import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import EnquiryForm from "@/components/EnquiryForm";
import { JsonLd, branchSchema, breadcrumbSchema, faqSchema } from "@/components/Schema";
import {
  getBranchBySlug,
  getBranchSlugs,
  getCourses,
  getSiteSettings,
} from "@/lib/content";
import { courseKeyword, locationSlug } from "@/lib/locations";
import { CONTENT_UPDATED, formatDate, whatsappLink } from "@/lib/site";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getBranchSlugs();
  return slugs.map((branch) => ({ branch }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ branch: string }>;
}): Promise<Metadata> {
  const { branch: slug } = await params;
  const branch = await getBranchBySlug(slug);
  if (!branch) return { title: "Branch not found" };
  const description =
    branch.intro ||
    `Visit ABS Educational Solution in ${branch.name}, Mumbai for free D.Pharm, B.Pharm, Nursing and Paramedical admission counselling.`;
  return {
    title: { absolute: `${branch.name} Branch — D.Pharm & Nursing Admission | ABS` },
    description: description.slice(0, 160),
    alternates: { canonical: `/branches/${branch.slug}` },
  };
}

export default async function BranchPage({
  params,
}: {
  params: Promise<{ branch: string }>;
}) {
  const { branch: slug } = await params;
  const [branch, settings, courses] = await Promise.all([
    getBranchBySlug(slug),
    getSiteSettings(),
    getCourses(),
  ]);

  if (!branch) notFound();

  const phone = branch.phone || settings.phone;
  const courseTitles = courses.map((c) => c.courseShortName || c.title);
  const updated = formatDate(branch.updatedAt || CONTENT_UPDATED);

  return (
    <article>
      <JsonLd data={branchSchema(branch, settings.orgName, settings.phone)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Branches", path: "/branches" },
          { name: branch.name, path: `/branches/${branch.slug}` },
        ])}
      />
      {branch.faqs && branch.faqs.length > 0 && <JsonLd data={faqSchema(branch.faqs)} />}

      <header className="bg-brand-light">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <nav className="mb-3 text-sm text-gray-500">
            <Link href="/branches" className="hover:text-brand">
              Branches
            </Link>{" "}
            / <span className="text-gray-700">{branch.name}</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            ABS Educational Solution — {branch.name}
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-gray-700">
            {branch.intro ||
              `Free admission counselling for D.Pharm, B.Pharm, Nursing and Paramedical courses at our ${branch.name} branch.`}
          </p>
          {(settings.reviewerName || updated) && (
            <p className="mt-3 text-sm text-gray-500">
              {settings.reviewerName && (
                <>
                  Reviewed by{" "}
                  <span className="font-medium text-gray-700">{settings.reviewerName}</span>
                </>
              )}
              {settings.reviewerName && updated ? " · " : ""}
              {updated && <>Last updated {updated}</>}
            </p>
          )}
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
                  `Hi, I want admission guidance at the ABS ${branch.name} branch.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-brand px-5 py-2.5 font-semibold text-brand transition hover:bg-white"
              >
                WhatsApp us
              </a>
            )}
            {branch.mapsUrl && (
              <a
                href={branch.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-brand px-5 py-2.5 font-semibold text-brand transition hover:bg-white"
              >
                Get directions
              </a>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900">Branch details</h2>
            <dl className="mt-3 space-y-3">
              {branch.address && (
                <div className="rounded-xl border border-gray-200 p-4">
                  <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Address
                  </dt>
                  <dd className="mt-1 text-gray-800">{branch.address}</dd>
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
                </div>
              )}
              {phone && (
                <div className="rounded-xl border border-gray-200 p-4">
                  <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Phone
                  </dt>
                  <dd className="mt-1 text-gray-800">
                    <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-brand">
                      {phone}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
            {branch.mapEmbedUrl && (
              <iframe
                src={branch.mapEmbedUrl}
                title={`Map of ABS ${branch.name}`}
                className="mt-4 h-64 w-full rounded-xl border border-gray-200"
                loading="lazy"
              />
            )}
          </section>

          {branch.localities && branch.localities.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                Areas we serve from {branch.name}
              </h2>
              <p className="mt-2 text-gray-700">
                Students from these nearby areas come to our {branch.name} branch:
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

          {branch.transport && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900">How to reach</h2>
              <p className="mt-2 text-gray-700">{branch.transport}</p>
            </section>
          )}

          <section>
            <h2 className="text-2xl font-bold text-gray-900">
              Courses we guide for at {branch.name}
            </h2>
            <p className="mt-2 text-gray-700">
              Get local, area-specific admission guidance for {branch.name} and nearby areas:
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {courses.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${locationSlug(c, branch)}`}
                  className="rounded-full border border-brand px-4 py-1.5 text-sm font-medium text-brand transition hover:bg-brand-light"
                >
                  {courseKeyword(c)} in {branch.name}
                </Link>
              ))}
            </div>
            <p className="mt-4 text-gray-700">Read the full course guides:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {courses.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${c.slug}`}
                  className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 transition hover:border-brand hover:text-brand"
                >
                  {courseKeyword(c)}
                </Link>
              ))}
            </div>
          </section>

          {branch.faqs && branch.faqs.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                {branch.name} branch — FAQs
              </h2>
              <div className="mt-4 divide-y divide-gray-200 rounded-xl border border-gray-200">
                {branch.faqs.map((f, i) => (
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
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-20 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Enquire at {branch.name}</h2>
            <p className="mb-4 mt-1 text-sm text-gray-500">
              Free counselling. We&apos;ll call you back.
            </p>
            <EnquiryForm courses={courseTitles} variant="compact" />
          </div>
        </aside>
      </div>
    </article>
  );
}
