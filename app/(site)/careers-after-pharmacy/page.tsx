import type { Metadata } from "next";
import Link from "next/link";

import Breadcrumbs from "@/components/Breadcrumbs";
import EnquiryForm from "@/components/EnquiryForm";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/Schema";
import { CAREERS_BASE, SALARY_DISCLAIMER, getCareers } from "@/lib/careers";
import { getCourses, getSiteSettings } from "@/lib/content";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Careers After Pharmacy: Jobs, Salary & Scope After D.Pharma and B.Pharm",
  description:
    "What you can actually do after a pharmacy course — own a medical store, hospital and government pharmacist posts, pharma industry, medical representative and higher studies. Honest salary ranges and how to get there.",
  alternates: { canonical: CAREERS_BASE },
};

const HUB_FAQS = [
  {
    question: "Which career after pharmacy pays the most?",
    answer:
      "Over a full career, the pharmaceutical industry — quality assurance and regulatory affairs in particular — has the highest ceiling, and it is the path where a B.Pharm matters most. In the first year, a medical representative role often pays the most because of incentives. Owning a medical store has no ceiling at all, but it depends entirely on location, capital and how long you can wait for the store to establish.",
  },
  {
    question: "Can I get a good job with just D.Pharma?",
    answer:
      "Yes. D.Pharma qualifies you to register as a pharmacist, which opens retail and hospital pharmacy, most government pharmacist posts, medical representative roles, and production or stores work in industry. Where the diploma alone limits you is the senior industry ladder — QC, QA and regulatory affairs generally want a degree.",
  },
  {
    question: "Is pharmacy a good career in India right now?",
    answer:
      "It is a stable one. Demand is driven by an ageing population, chronic-disease medication and a large domestic manufacturing base, and the pharmacist registration requirement legally protects the role. It is not a get-rich-quick field — starting salaries are modest across the board — but it is one of the few courses after 12th that lets you own a licensed business of your own.",
  },
  {
    question: "Do I need NEET for a pharmacy course?",
    answer:
      "No. Neither D.Pharma nor B.Pharm requires NEET. Admission in Maharashtra runs through DTE on your Class 12 marks, which is why pharmacy is the most practical medical-side route for students who did not write NEET or did not clear it.",
  },
];

export default async function CareersHubPage() {
  const [settings, careers, courses] = await Promise.all([
    getSiteSettings(),
    Promise.resolve(getCareers()),
    getCourses(),
  ]);
  const courseTitles = courses.map((c) => c.courseShortName || c.title);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Careers after pharmacy", path: CAREERS_BASE },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <JsonLd data={faqSchema(HUB_FAQS)} />

      <section className="bg-gradient-to-b from-brand-light to-white">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <Breadcrumbs items={crumbs} />
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
            Careers after pharmacy
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-gray-600">
            Students ask us what a pharmacy course leads to long before they ask what it costs. So
            here is the honest map: six real paths after D.Pharma and B.Pharm, what each one pays to
            start, what it pays later, and what nobody tells you about it.
          </p>
          <p className="mt-3 max-w-3xl text-gray-600">
            The short version — pharmacy is one of the very few courses after 12th where you can end
            up <strong className="font-semibold text-gray-900">owning the business</strong>, because
            a medical store can only hold a drug licence with a registered pharmacist. That is the
            path most families do not know about when they walk in.
          </p>
        </div>
      </section>

      {/* The six paths */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-3xl font-bold text-gray-900">Six paths, and who each one suits</h2>
        <p className="mt-2 max-w-3xl text-gray-600">
          Every card below is a full guide — the work, the pay at each stage, how to get there, and
          the honest caveat.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {careers.map((c) => (
            <Link
              key={c.slug}
              href={`${CAREERS_BASE}/${c.slug}`}
              className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900">{c.name}</h3>
              <p className="mt-2 flex-1 text-sm text-gray-600">{c.summary}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {c.entryVia.map((q) => (
                  <span
                    key={q}
                    className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand"
                  >
                    {q}
                  </span>
                ))}
              </div>
              <span className="mt-4 text-sm font-semibold text-brand">Read the guide →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* At a glance */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-3xl font-bold text-gray-900">Starting pay, side by side</h2>
          <p className="mt-2 max-w-3xl text-gray-600">
            What a fresher realistically earns in each path in and around Mumbai. These are the
            numbers we quote to families at the branch — not brochure figures.
          </p>
          <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Path</th>
                  <th className="px-4 py-3 font-semibold">Typical start</th>
                  <th className="px-4 py-3 font-semibold">Opens with</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {careers.map((c) => (
                  <tr key={c.slug}>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      <Link href={`${CAREERS_BASE}/${c.slug}`} className="hover:text-brand">
                        {c.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{c.salary[0]?.range}</td>
                    <td className="px-4 py-3 text-gray-600">{c.entryVia.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 max-w-3xl text-xs text-gray-500">{SALARY_DISCLAIMER}</p>
        </div>
      </section>

      {/* Where it starts */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-3xl font-bold text-gray-900">All of it starts with one admission</h2>
        <p className="mt-2 max-w-3xl text-gray-600">
          Every career on this page begins with a pharmacy qualification — and neither needs NEET.
          Admission in Maharashtra runs through DTE on your Class 12 marks.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link
            href="/d-pharma-admission-2026"
            className="rounded-xl border border-gray-200 bg-white p-6 transition hover:border-brand hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900">D.Pharma — 2 years after 12th</h3>
            <p className="mt-2 text-sm text-gray-600">
              The fastest route to registering as a pharmacist, and the qualification behind your own
              medical store. Eligibility, fees and the CAP process.
            </p>
            <span className="mt-3 inline-block text-sm font-semibold text-brand">
              D.Pharma admission 2026 →
            </span>
          </Link>
          <Link
            href="/b-pharma-admission-2026"
            className="rounded-xl border border-gray-200 bg-white p-6 transition hover:border-brand hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900">B.Pharma — 4 years after 12th</h3>
            <p className="mt-2 text-sm text-gray-600">
              The degree that opens QC, QA and the industry career ladder — and the one diploma
              holders enter in the second year through lateral entry.
            </p>
            <span className="mt-3 inline-block text-sm font-semibold text-brand">
              B.Pharma admission 2026 →
            </span>
          </Link>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-3xl font-bold text-gray-900">Questions about pharmacy careers</h2>
          <div className="mt-6 divide-y divide-gray-200 border-t border-gray-200">
            {HUB_FAQS.map((f) => (
              <details key={f.question} className="group py-4">
                <summary className="cursor-pointer list-none font-semibold text-gray-900 marker:hidden">
                  {f.question}
                </summary>
                <p className="mt-2 max-w-3xl text-gray-600">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry */}
      <section className="mx-auto max-w-3xl px-4 py-14">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900">
            Not sure which path fits you?
          </h2>
          <p className="mb-4 mt-1 text-sm text-gray-600">
            Tell us where you are and a counsellor from {settings.orgName || "ABS"} will call you
            back. Free, and no obligation.
          </p>
          <EnquiryForm courses={courseTitles} />
        </div>
      </section>
    </>
  );
}
