import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd, breadcrumbSchema, organizationSchema } from "@/components/Schema";
import { getBranches, getSiteSettings } from "@/lib/content";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About Us — Nursing & Paramedical Admissions Mumbai",
  description:
    "ABS Educational Solution helps students secure admission into D.Pharm, B.Pharm, Nursing and Paramedical colleges across Mumbai. Trusted since 2009, 6 branches, honest counselling.",
  alternates: { canonical: "/about" },
};

const STATS = [
  { stat: "16+", label: "Years of experience" },
  { stat: "16K+", label: "Students enrolled" },
  { stat: "88K+", label: "Counselling done" },
];

export default async function AboutPage() {
  const [settings, branches] = await Promise.all([getSiteSettings(), getBranches()]);
  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <JsonLd data={organizationSchema(settings, branches)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />

      <h1 className="text-4xl font-bold text-gray-900">About ABS Educational Solution</h1>
      <p className="mt-4 text-lg text-gray-600">{settings.description}</p>

      <div className="mt-10 grid grid-cols-3 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-xl bg-brand-light p-5 text-center">
            <div className="text-3xl font-bold text-brand">{s.stat}</div>
            <div className="mt-1 text-xs text-gray-600 sm:text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="prose-basic mt-10 max-w-none text-gray-700">
        <h2>Who we are</h2>
        <p>
          ABS Educational Solution is a Mumbai-based admission guidance service, trusted since
          2009, focused on D.Pharm, B.Pharm, Nursing and Paramedical careers. With 6 branches
          across Mumbai, we work with students and parents to cut through confusion — recommending
          only recognised colleges, explaining fees honestly, and supporting the entire admission
          journey.
        </p>
        <h2>Why choose us</h2>
        <ul>
          <li>Verified, recognised colleges — no false promises.</li>
          <li>Genuine, one-on-one counselling tailored to your goals and budget.</li>
          <li>Complete support: course selection, documents, and admission follow-through.</li>
          <li>Faster guidance via phone and WhatsApp, the way students actually communicate.</li>
        </ul>
      </div>

      <div className="mt-10 rounded-2xl bg-brand p-8 text-center text-white">
        <h2 className="text-2xl font-bold">Have questions about admissions?</h2>
        <p className="mt-2 text-white/90">Talk to our counsellors — it&apos;s completely free.</p>
        <Link
          href="/contact"
          className="mt-5 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-brand transition hover:bg-gray-100"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
