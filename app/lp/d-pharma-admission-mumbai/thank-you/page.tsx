import type { Metadata } from "next";
import Link from "next/link";
import { Archivo } from "next/font/google";

import TrackedLink from "@/components/lp/TrackedLink";
import { getSiteSettings } from "@/lib/content";
import { whatsappLink } from "@/lib/site";

import "../dpharma-lp.css";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"] });

const PAGE = "d-pharma-admission-mumbai";

// Dedicated thank-you page. Both D.Pharma forms redirect here after the lead
// saves — the Google Ads conversion fires on this PAGEVIEW, not on the button
// click, which is what double-counted on the GNM campaign.
export const metadata: Metadata = {
  title: { absolute: "Thank You — D.Pharma Admission Enquiry Received | ABS" },
  description: "Your D.Pharma admission enquiry has been received.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/lp/d-pharma-admission-mumbai/thank-you" },
};

export default async function DpharmaThankYouPage() {
  const settings = await getSiteSettings();
  const brand = settings.orgName || "ABS Educational Solution";
  const phone = settings.phone;
  const phoneRaw = phone ? phone.replace(/\s/g, "") : "";
  const waHref = whatsappLink(
    settings.whatsappNumber,
    "Hi, I just enquired about D.Pharma admission and the fee waiver.",
  );
  const callHref = phoneRaw ? `tel:${phoneRaw}` : waHref;

  return (
    <div
      className={`dpharma-lp ${archivo.className}`}
      style={{ ["--display" as string]: archivo.style.fontFamily } as React.CSSProperties}
    >
      <header className="abs-head" style={{ top: 0 }}>
        <div className="abs-head-in">
          <div className="abs-logo">ABS<span>.</span><small>Educational Solution</small></div>
          <TrackedLink event="call_click" page={PAGE} location="thankyou-header" className="abs-head-call" href={callHref}>
            Call now
          </TrackedLink>
        </div>
      </header>

      <div className="abs-ty">
        <div className="abs-wrap">
          <div className="abs-ty-card">
            <div className="abs-ty-badge">&#10003;</div>
            <h2 className="abs-h2">Thank you &mdash; we have your number.</h2>
            <p>
              A counsellor from {brand} will call you between <b>10am and 7pm</b> to check your
              eligibility, go through the scholarship and talk through your college options.
            </p>
            <p>Keep your HSC marksheet handy. There is nothing to pay, at any stage.</p>

            <div className="abs-ty-acts">
              <TrackedLink event="whatsapp_click" page={PAGE} location="thankyou" className="is-wa" href={waHref} target="_blank" rel="noopener">
                Message us on WhatsApp
              </TrackedLink>
              {phone && (
                <TrackedLink event="call_click" page={PAGE} location="thankyou" className="is-call" href={callHref}>
                  Call {phone}
                </TrackedLink>
              )}
            </div>

            <Link href="/lp/d-pharma-admission-mumbai" className="abs-ty-back">
              &larr; Back to the D.Pharma admission page
            </Link>
          </div>
        </div>
      </div>

      <footer className="abs-foot" style={{ paddingBottom: "26px" }}>
        <div className="abs-wrap">
          <p>
            <b>{brand}</b> is an independent admission guidance service. We are not a college, a
            university, or a government body. The scholarship referred to is a scheme of the
            Government of Maharashtra and eligibility is determined solely by the government.
          </p>
        </div>
      </footer>
    </div>
  );
}
