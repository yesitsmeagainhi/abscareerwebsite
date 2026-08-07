"use client";

import { useSearchParams } from "next/navigation";

// Ad-group message match. Ads pass ?s=fees / ?s=neet / ?s=eligibility /
// ?s=admission / ?s=colleges (or we fall back to utm_term). Every variant below
// is true regardless of the keyword — this tightens message match, it does not
// change what we claim. Rendered inside a Suspense boundary whose fallback is
// the default copy, so the page still prerenders statically.

const VARIANTS: Record<string, { kicker: string; lede: string }> = {
  admission: {
    kicker: "BPT admission process 2026–27",
    lede: "The full BPT admission process for the 2026–27 intake — eligibility, CAP counselling steps, documents and deadlines. Free guidance from a consultancy that has guided 16,000+ students in 16 years.",
  },
  neet: {
    kicker: "BPT admission through NEET UG 2026",
    lede: "BPT admission in Maharashtra runs on NEET UG merit — a valid score is compulsory, and what you do with it decides your seat. We help you order your CAP choices, target the right round and claim your fee waiver. Free, and without any donation.",
  },
  fees: {
    kicker: "BPT course fees 2026–27",
    lede: "BPT course fees, the fee structure by institution type, and the Maharashtra scholarship schemes that can bring a large part of it back. Free guidance from 16 years of admission counselling.",
  },
  eligibility: {
    kicker: "BPT course eligibility after 12th",
    lede: "Check your BPT course eligibility after 12th — PCB percentage, subject requirements, age and NEET status. Takes three questions and costs nothing.",
  },
  colleges: {
    kicker: "BPT colleges — Mumbai & Maharashtra",
    lede: "Searching for BPT colleges near you tells you what exists, not what you are eligible for or what it will cost after your scholarship. We work that out with you, free, at any of our six Mumbai branches.",
  },
};

function variantKey(qs: URLSearchParams): string {
  const s = (qs.get("s") || "").toLowerCase();
  if (s) return s;
  const t = (qs.get("utm_term") || "").toLowerCase();
  if (/without neet|need neet|through neet/.test(t)) return "neet";
  if (/fee/.test(t)) return "fees";
  if (/eligib|qualif|12th/.test(t)) return "eligibility";
  if (/college|near me/.test(t)) return "colleges";
  if (/admission/.test(t)) return "admission";
  return "";
}

/** The hero copy itself. Also used as the Suspense fallback with the default copy. */
export function HeroBlock({ kicker, lede }: { kicker: string; lede: string }) {
  return (
    <>
      <span className="session"><i />{kicker}</span>
      <h1>
        BPT admission in Mumbai &amp; Maharashtra, <span className="hl">2026–27</span>
      </h1>
      <p className="lede">{lede}</p>
    </>
  );
}

export default function HeroCopy({ kicker, lede }: { kicker: string; lede: string }) {
  const params = useSearchParams();
  const v = VARIANTS[variantKey(params)];
  return <HeroBlock kicker={v?.kicker ?? kicker} lede={v?.lede ?? lede} />;
}
