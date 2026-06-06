import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd, breadcrumbSchema, organizationSchema } from "@/components/Schema";
import { getBranches, getCourses, getSiteSettings } from "@/lib/content";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Our Branches in Mumbai — D.Pharm & Nursing Admission",
  description:
    "ABS Educational Solution has 6 branches across Mumbai — Thane, Kurla, Malad, Bhayandar, Nalasopara and Andheri. Visit your nearest branch for free admission counselling.",
  alternates: { canonical: "/branches" },
};

export default async function BranchesPage() {
  const [settings, branches, courses] = await Promise.all([
    getSiteSettings(),
    getBranches(),
    getCourses(),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <JsonLd data={organizationSchema(settings, branches)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Branches", path: "/branches" },
        ])}
      />

      <h1 className="text-4xl font-bold text-gray-900">Our branches across Mumbai</h1>
      <p className="mt-3 max-w-3xl text-gray-600">
        ABS Educational Solution has {branches.length} branches across Mumbai — in Thane, Kurla,
        Malad, Bhayandar, Nalasopara and Andheri. Wherever you stay, there is an ABS office near
        you for free, face-to-face admission counselling. Visit your nearest branch to plan your
        D.Pharm, B.Pharm, Nursing or Paramedical admission with a counsellor who knows your area.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {branches.map((b) => (
          <Link
            key={b.slug}
            href={`/branches/${b.slug}`}
            className="group rounded-xl border border-gray-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-lg"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-light text-brand">
                📍
              </span>
              <h2 className="text-lg font-semibold text-gray-900 group-hover:text-brand">
                {b.name}
              </h2>
            </div>
            {b.area && <p className="mt-3 text-sm text-gray-600">{b.area}</p>}
            {b.localities && b.localities.length > 0 && (
              <p className="mt-2 text-xs text-gray-500">
                Serves: {b.localities.slice(0, 4).join(", ")}
                {b.localities.length > 4 ? " & more" : ""}
              </p>
            )}
            <span className="mt-4 inline-block text-sm font-semibold text-brand">
              View branch &rarr;
            </span>
          </Link>
        ))}
      </div>

      {/* Courses available at every branch */}
      <section className="mt-14">
        <h2 className="text-2xl font-bold text-gray-900">Courses available at every branch</h2>
        <p className="mt-2 max-w-2xl text-gray-600">
          We guide students for all of these courses at each of our {branches.length} branches.
          Tap a course to see eligibility, fees, and the admission process.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 transition hover:border-brand hover:text-brand"
            >
              {c.courseShortName || c.title}
              <span className="ml-1 text-brand">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Why visit a branch */}
      <section className="mt-14 rounded-2xl border border-gray-200 bg-gray-50 p-8">
        <h2 className="text-2xl font-bold text-gray-900">Why visit an ABS branch?</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <h3 className="font-semibold text-gray-900">Face-to-face counselling</h3>
            <p className="mt-1 text-sm text-gray-600">
              Sit with a counsellor, ask every question, and get clear answers — for free.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Local & convenient</h3>
            <p className="mt-1 text-sm text-gray-600">
              A branch near your home means less travel and faster help during admission season.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Document help</h3>
            <p className="mt-1 text-sm text-gray-600">
              Bring your marksheets — we help you check eligibility and complete the process.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
