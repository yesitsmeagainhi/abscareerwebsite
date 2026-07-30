import type { Metadata } from "next";
import Link from "next/link";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";

import { getSiteSettings } from "@/lib/content";
import { whatsappLink } from "@/lib/site";

import TrackedLink from "../TrackedLink";
import "../gnm-lp.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["600", "700", "800"] });
const body = Instrument_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

// Dedicated thank-you page. The GNM form redirects here after the lead is
// saved, giving a real page load at a stable URL — the trigger for a Google Ads
// "page load" lead conversion. noindex (paid-funnel page, not for organic).
export const metadata: Metadata = {
  title: { absolute: "Thank You — GNM Nursing Admission Enquiry Received | ABS" },
  description: "Your GNM Nursing scholarship eligibility check has been received.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/lp/gnm-nursing-mumbai/thank-you" },
};

const WA_MESSAGE =
  "Hi, I just submitted my scholarship eligibility check for GNM Nursing Admission 2026-27 (Mumbai).";

export default async function GnmThankYouPage() {
  const settings = await getSiteSettings();
  const phone = settings.phone;
  const waHref = whatsappLink(settings.whatsappNumber, WA_MESSAGE);
  const callHref = phone ? `tel:${phone.replace(/\s/g, "")}` : waHref;

  return (
    <div
      className="gnm-lp"
      style={
        {
          "--display": display.style.fontFamily,
          "--body": body.style.fontFamily,
        } as React.CSSProperties
      }
    >
      <div className="topbar">
        <div className="wrap">
          <span className="brand">ABS Educational Solution</span>
          <span className="open">Admissions Open &middot; 2026&ndash;27</span>
          <a className="btn btn-primary" href={callHref} style={{ padding: "8px 16px", fontSize: "13.5px" }}>
            Call Now
          </a>
        </div>
      </div>

      <div className="ty-wrap">
        <div className="ty-card">
          <div className="thanks">
            <div className="thanks-badge">&#10003;</div>
            <h3>Thank you! Your enquiry is received.</h3>
            <p>
              Your GNM Nursing scholarship eligibility check has been submitted successfully. Our
              admission department will connect with you soon with your scholarship details and
              admission guidance. You can also reach us directly right now:
            </p>
            <div className="thanks-actions">
              {phone && (
                <TrackedLink
                  event="call_click"
                  eventParams={{ location: "thankyou" }}
                  className="btn btn-primary btn-block"
                  href={callHref}
                >
                  &#9742; Call {phone}
                </TrackedLink>
              )}
              <TrackedLink
                event="whatsapp_click"
                eventParams={{ location: "thankyou" }}
                className="btn bar-wa btn-block"
                href={waHref}
              >
                &#128172; Chat on WhatsApp
              </TrackedLink>
            </div>
            <p className="ty-sub">
              <Link href="/lp/gnm-nursing-mumbai">&larr; Back to GNM Nursing admission page</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
