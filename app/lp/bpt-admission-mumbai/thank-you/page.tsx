import type { Metadata } from "next";
import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";

import TrackedLink from "@/components/lp/TrackedLink";
import { getSiteSettings } from "@/lib/content";
import { whatsappLink } from "@/lib/site";

import "../bpt-lp.css";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], axes: ["wdth"] });

const PAGE = "bpt-admission-mumbai";

// Dedicated thank-you page. Every BPT form redirects here after the lead saves —
// a real page load at a stable URL for a Google Ads "page load" conversion.
export const metadata: Metadata = {
  title: { absolute: "Thank You — BPT Admission Enquiry Received | ABS" },
  description: "Your BPT admission enquiry has been received.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/lp/bpt-admission-mumbai/thank-you" },
};

export default async function BptThankYouPage() {
  const settings = await getSiteSettings();
  const brand = settings.orgName || "ABS Educational Solution";
  const phone = settings.phone;
  const phoneRaw = phone ? phone.replace(/\s/g, "") : "";
  const waHref = whatsappLink(
    settings.whatsappNumber,
    "Hi ABS, I just submitted my BPT admission enquiry (Mumbai, 2026-27).",
  );
  const callHref = phoneRaw ? `tel:${phoneRaw}` : waHref;

  return (
    <div
      className="bpt-lp"
      style={{ ["--sans" as string]: bricolage.style.fontFamily } as React.CSSProperties}
    >
      <header className="bar">
        <div className="row">
          <div className="logo">{brand}<span>Since 2009 · Mumbai</span></div>
          <TrackedLink event="call_click" page={PAGE} location="thankyou-header" className="btn btn-line" href={callHref}>
            Call now
          </TrackedLink>
        </div>
      </header>

      <div className="ty-wrap">
        <div className="ty-card">
          <div className="ty-badge">&#10003;</div>
          <h2>Got it — we&apos;ll call you.</h2>
          <p>
            A counsellor will ring the number you gave us with your BPT options, the colleges worth
            targeting and your fee-waiver position. Keep your marksheet and NEET scorecard handy.
          </p>
          <p>You can also reach us right now:</p>
          <div className="ty-actions">
            <TrackedLink event="whatsapp_click" page={PAGE} location="thankyou" className="btn bar-wa" href={waHref} target="_blank" rel="noopener">
              Open WhatsApp
            </TrackedLink>
            {phone && (
              <TrackedLink event="call_click" page={PAGE} location="thankyou" className="btn btn-line" href={callHref}>
                Call {phone}
              </TrackedLink>
            )}
          </div>
          <Link href="/lp/bpt-admission-mumbai" className="ty-back">&larr; Back to the BPT admission page</Link>
        </div>
      </div>
    </div>
  );
}
