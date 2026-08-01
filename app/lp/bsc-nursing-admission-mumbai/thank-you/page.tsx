import type { Metadata } from "next";
import Link from "next/link";
import { Archivo } from "next/font/google";

import TrackedLink from "@/components/lp/TrackedLink";
import { getSiteSettings } from "@/lib/content";
import { whatsappLink } from "@/lib/site";

import "../bsc-lp.css";

const archivo = Archivo({ subsets: ["latin"], weight: ["500", "600", "700"] });

const PAGE = "bsc-nursing-admission-mumbai";

// Dedicated thank-you page. The BSc form redirects here after the lead saves —
// a real page load at a stable URL for a Google Ads "page load" conversion.
export const metadata: Metadata = {
  title: { absolute: "Thank You — BSc Nursing Admission Enquiry Received | ABS" },
  description: "Your BSc Nursing admission enquiry has been received.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/lp/bsc-nursing-admission-mumbai/thank-you" },
};

export default async function BscThankYouPage() {
  const settings = await getSiteSettings();
  const phone = settings.phone;
  const phoneRaw = phone ? phone.replace(/\s/g, "") : "";
  const waHref = whatsappLink(
    settings.whatsappNumber,
    "Hi, I just submitted my BSc Nursing admission enquiry (Mumbai, 2026-27).",
  );
  const callHref = phoneRaw ? `tel:${phoneRaw}` : waHref;

  return (
    <div className="bsc-lp" style={{ ["--sans" as string]: archivo.style.fontFamily } as React.CSSProperties}>
      <header className="hdr">
        <div className="wrap">
          <div className="brand">{settings.orgName || "ABS Educational Solution"}<em>Nursing admissions since 2010</em></div>
          <TrackedLink event="call_click" page={PAGE} location="thankyou" className="hdr-call" href={callHref}>
            {phone ? `Call ${phone}` : "Call us"}
          </TrackedLink>
        </div>
      </header>

      <div className="ty-wrap">
        <div className="card ty-card">
          <div className="ty-badge">&#10003;</div>
          <h2>Thank you! Your enquiry is received.</h2>
          <p>
            A counsellor will call you within 2 hours with the colleges that have seats open for your
            profile, and your scholarship position. Keep your marksheet handy.
          </p>
          <p>You can also reach us directly right now:</p>
          <div className="ty-actions">
            {phone && (
              <TrackedLink event="call_click" page={PAGE} location="thankyou" className="btn" href={callHref}>
                &#9742; Call {phone}
              </TrackedLink>
            )}
            <TrackedLink event="whatsapp_click" page={PAGE} location="thankyou" className="btn bar-wa" href={waHref}>
              &#128172; Message us on WhatsApp
            </TrackedLink>
          </div>
          <Link href="/lp/bsc-nursing-admission-mumbai" className="ty-back">&larr; Back to BSc Nursing admission page</Link>
        </div>
      </div>
    </div>
  );
}
