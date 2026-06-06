import type { Metadata } from "next";

import EnquiryForm from "@/components/EnquiryForm";
import { JsonLd, breadcrumbSchema, organizationSchema } from "@/components/Schema";
import { getBranches, getCourses, getSiteSettings } from "@/lib/content";
import { whatsappLink } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contact Us — Nursing & Paramedical Admission Mumbai",
  description:
    "Contact ABS Educational Solution for D.Pharm, B.Pharm, Nursing and Paramedical admission guidance in Mumbai. Call, WhatsApp, or send an enquiry — free counselling.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const [settings, courses, branches] = await Promise.all([
    getSiteSettings(),
    getCourses(),
    getBranches(),
  ]);
  const courseTitles = courses.map((c) => c.courseShortName || c.title);

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <JsonLd data={organizationSchema(settings, branches)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />

      <h1 className="text-4xl font-bold text-gray-900">Contact us</h1>
      <p className="mt-3 text-gray-600">
        Have a question about courses, eligibility, or fees? Reach out — our counsellors respond
        quickly.
      </p>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        {/* Contact details */}
        <div className="space-y-5">
          {settings.phone && (
            <ContactRow label="Call us">
              <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="text-brand">
                {settings.phone}
              </a>
            </ContactRow>
          )}
          {settings.whatsappNumber && (
            <ContactRow label="WhatsApp">
              <a
                href={whatsappLink(settings.whatsappNumber, "Hi, I have an admission query.")}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand"
              >
                Chat on WhatsApp
              </a>
            </ContactRow>
          )}
          {settings.email && (
            <ContactRow label="Email">
              <a href={`mailto:${settings.email}`} className="text-brand">
                {settings.email}
              </a>
            </ContactRow>
          )}
          {settings.address && <ContactRow label="Address">{settings.address}</ContactRow>}

          {settings.mapEmbedUrl && (
            <iframe
              src={settings.mapEmbedUrl}
              title="Location map"
              className="h-56 w-full rounded-xl border border-gray-200"
              loading="lazy"
            />
          )}
        </div>

        {/* Enquiry form */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Send an enquiry</h2>
          <p className="mb-4 mt-1 text-sm text-gray-500">
            Fill the form and we&apos;ll call you back.
          </p>
          <EnquiryForm courses={courseTitles} />
        </div>
      </div>
    </div>
  );
}

function ContactRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 font-medium text-gray-900">{children}</div>
    </div>
  );
}
