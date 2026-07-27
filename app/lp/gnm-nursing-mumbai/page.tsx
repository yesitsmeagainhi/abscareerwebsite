import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";

import { JsonLd, faqSchema } from "@/components/Schema";
import { getSiteSettings } from "@/lib/content";
import { whatsappLink } from "@/lib/site";

import GnmLeadForm from "./GnmLeadForm";
import "./gnm-lp.css";

// Bespoke landing-page fonts — loaded here (not in the root layout) so they
// only ship on this ad page.
const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["600", "700", "800"] });
const body = Instrument_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

// Paid Google-Ads landing page → keep it OUT of the organic index (avoids
// thin-content / doorway signals on the SEO side). Flip `index` to true if you
// ever want it to rank organically too.
export const metadata: Metadata = {
  title: {
    absolute: "GNM Nursing Admission in Mumbai 2026–27 | Scholarship Up to 100%* — ABS",
  },
  description:
    "GNM admission open 2026–27 in Mumbai with scholarship up to 100%* for girls and 50%* for boys. 12th pass any stream eligible — no entrance exam. Check your scholarship eligibility free. Limited seats.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/lp/gnm-nursing-mumbai" },
};

const WA_MESSAGE =
  "Hi, I want to check my scholarship eligibility for GNM Nursing Admission 2026-27 (Mumbai).";

const FAQS = [
  {
    question: "Is NEET or any entrance exam required for GNM?",
    answer:
      "No. GNM admission does not require NEET or any CET. Eligibility is based on your 12th marks — minimum 40% aggregate and 40 marks in English.",
  },
  {
    question: "How do I apply for GNM admission 2026–27?",
    answer:
      "Fill the short form on this page — it's a free scholarship & eligibility check, not a final admission commitment. Our Mumbai team will call you, confirm your scholarship benefit, and then guide you through the complete admission process and form fill-up — free of cost.",
  },
  {
    question: "How do I get the scholarship?",
    answer:
      "Scholarship benefits depend on your category and eligibility. Our counsellors check your documents and tell you exactly which benefits apply to you — before admission.",
  },
  {
    question: "I'm from Commerce / Arts. Can I really do nursing?",
    answer:
      "Yes. GNM is open to 12th pass students from Arts, Commerce and Science — any stream.",
  },
  {
    question: "How long is the GNM course?",
    answer: "GNM (General Nursing & Midwifery) is a 3-year diploma programme.",
  },
  {
    question: "Which college is this? Where will I study?",
    answer:
      "Complete college, campus and hostel details are shared during your free counselling session, so you can make a fully informed decision before confirming your seat.",
  },
];

export default async function GnmNursingLandingPage() {
  const settings = await getSiteSettings();
  const phone = settings.phone;
  const waHref = whatsappLink(settings.whatsappNumber, WA_MESSAGE);
  // Call buttons fall back to WhatsApp if no phone number is configured, so a
  // CTA is never dead.
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
      <JsonLd data={faqSchema(FAQS)} />

      <div className="topbar">
        <div className="wrap">
          <span className="brand">ABS Educational Solution</span>
          <span className="open">Admissions Open &middot; 2026&ndash;27</span>
          <a className="btn btn-primary" href={callHref} style={{ padding: "8px 16px", fontSize: "13.5px" }}>
            Call Now
          </a>
        </div>
      </div>

      <header className="hero">
        <div className="wrap">
          <div>
            <span className="eyebrow">Admissions Open &middot; Scholarship Up to 100%*</span>
            <h1>
              GNM Nursing Admission <span className="accent">in Mumbai</span> &ndash; 2026&ndash;27
            </h1>
            <p className="sub">
              Admission open for the 3-year GNM nursing course. 12th pass from{" "}
              <strong>any stream</strong> &ndash; Arts, Commerce or Science &ndash; is eligible. No
              NEET, no entrance exam. Check your scholarship eligibility free &ndash;{" "}
              <strong>girls up to 100%*, boys up to 50%*</strong>.
            </p>
            <div className="chips">
              <span className="chip hot"><span className="dot"></span>Scholarship up to 100%* &ndash; Girls</span>
              <span className="chip"><span className="dot"></span>Boys: up to 50%*</span>
              <span className="chip"><span className="dot"></span>All streams eligible</span>
              <span className="chip"><span className="dot"></span>Limited seats &ndash; admission open</span>
            </div>
            <div className="cta-row">
              <a className="btn btn-primary" href="#apply">Check Scholarship Eligibility</a>
              <a className="btn btn-ghost" href={waHref}>WhatsApp Us</a>
            </div>
          </div>

          <GnmLeadForm />
        </div>
      </header>

      <section className="sch">
        <div className="wrap">
          <p className="sec-eyebrow">Scholarship Support</p>
          <h2>Check your scholarship eligibility &ndash; up to 100%*</h2>
          <p className="lead">
            Fill the short form above and our counsellors will check your category and documents
            &ndash; and tell you exactly which scholarship benefit applies to you. Completely free.
          </p>
          <div className="sch-grid">
            <div className="sch-card"><div className="pct">100%</div><div className="who">Girl students</div><div className="cond">Scholarship up to 100%*</div></div>
            <div className="sch-card"><div className="pct">50%</div><div className="who">Boy students</div><div className="cond">Scholarship up to 50%*</div></div>
            <div className="sch-card"><div className="pct">&#8377;50,000</div><div className="who">Minority category</div><div className="cond">Per year, as applicable*</div></div>
          </div>
          <p className="sch-fine">
            *Scholarships are subject to student eligibility, category, documentation and applicable
            government / institutional norms. Final benefit confirmed during counselling.
          </p>
          <div className="cta-row" style={{ marginTop: "22px" }}>
            <a className="btn btn-primary" href="#apply">Check Scholarship Eligibility</a>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <p className="sec-eyebrow">Eligibility</p>
          <h2>Who can apply for GNM?</h2>
          <p className="lead">
            GNM is one of the few nursing courses open to every stream &ndash; you don&apos;t need
            PCB or NEET to start your healthcare career.
          </p>
          <div className="grid-3">
            <div className="card"><span className="big">Any stream</span><h3>Arts &middot; Commerce &middot; Science</h3><p>12th pass students from all streams are eligible to apply.</p></div>
            <div className="card"><span className="big">40%</span><h3>Minimum marks in 12th</h3><p>An aggregate of 40% in your 12th board exams is required.</p></div>
            <div className="card"><span className="big">40</span><h3>Marks in English</h3><p>Minimum 40 marks in English subject in 12th standard.</p></div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <p className="sec-eyebrow">Career Scope</p>
          <h2>Where GNM takes you</h2>
          <div className="grid-4">
            <div className="card"><h3>Staff Nurse</h3><p>Work in private and government hospitals, clinics and nursing homes after registration.</p></div>
            <div className="card"><h3>Government jobs</h3><p>Apply for nursing posts in government health services and public hospitals.</p></div>
            <div className="card"><h3>Higher studies</h3><p>Continue with Post Basic B.Sc Nursing and grow into senior nursing roles.</p></div>
            <div className="card"><h3>Global demand</h3><p>Nursing is in high demand in India and abroad &ndash; a stable, respected career.</p></div>
          </div>
        </div>
      </section>

      <section style={{ background: "#fff", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <p className="sec-eyebrow">Admission Process</p>
          <h2>4 simple steps to your seat</h2>
          <div className="grid-4">
            <div className="card"><div className="step-num">1</div><h3>Check scholarship eligibility</h3><p>Fill the short form &ndash; a free scholarship &amp; eligibility check, no commitment.</p></div>
            <div className="card"><div className="step-num">2</div><h3>Free counselling</h3><p>Meet our counsellor at your nearest Mumbai branch &ndash; course, college and scholarship details explained clearly.</p></div>
            <div className="card"><div className="step-num">3</div><h3>Document check</h3><p>We verify your 12th marksheet and eligibility, and guide you on scholarship documents.</p></div>
            <div className="card"><div className="step-num">4</div><h3>Seat confirmation</h3><p>Confirm your admission &ndash; seats are allotted on a first-come, first-served basis.</p></div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <p className="sec-eyebrow">FAQs</p>
          <h2>Common questions</h2>
          {FAQS.map((f, i) => (
            <details key={i} open={i === 0}>
              <summary>{f.question}</summary>
              <p>{f.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="branches">
        <div className="wrap">
          <p className="sec-eyebrow">Counselling Centres</p>
          <h2>Meet us across Mumbai</h2>
          <p className="lead">Walk in for free counselling at any of our six branches:</p>
          <div className="branch-tags">
            <span>Bhayandar</span><span>Nalasopara</span><span>Malad</span><span>Andheri</span><span>Thane</span><span>Kurla</span>
          </div>
          <div className="cta-row" style={{ marginTop: "26px" }}>
            <a className="btn btn-primary" href="#apply">Check Scholarship Eligibility</a>
            <a className="btn btn-ghost" href={waHref}>Chat on WhatsApp</a>
          </div>
        </div>
      </section>

      <footer className="lp-footer">
        <div className="wrap">
          <p>
            <strong>{settings.orgName || "ABS Educational Solution"}</strong> &middot; Paramedical &amp;
            Nursing Admission Guidance &middot; {settings.domain || "absadmission.com"}
          </p>
          <p style={{ marginTop: "8px" }}>
            {settings.orgName || "ABS Educational Solution"} is an admission counselling service.
            Course, college and fee details are shared transparently during counselling. Scholarships
            are subject to eligibility, category and applicable government / institutional norms.
            Seats are limited and allotted on a first-come, first-served basis. *T&amp;C apply.
          </p>
        </div>
      </footer>

      <div className="sticky-bar">
        <a className="btn bar-call" href={callHref}>&#9742; Call Now</a>
        <a className="btn bar-wa" href="#apply">Check My Scholarship</a>
      </div>
    </div>
  );
}
