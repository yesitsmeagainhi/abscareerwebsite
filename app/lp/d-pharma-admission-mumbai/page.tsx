import { Suspense } from "react";
import type { Metadata } from "next";
import { Archivo } from "next/font/google";

import LeadPopup from "@/components/lp/LeadPopup";
import LpTracker from "@/components/lp/LpTracker";
import TrackedLink from "@/components/lp/TrackedLink";
import { getBranches, getSiteSettings } from "@/lib/content";
import { whatsappLink } from "@/lib/site";

import BranchCards, { BranchList, type LpBranch } from "./BranchCards";
import DpharmaLeadForm from "./DpharmaLeadForm";
import "./dpharma-lp.css";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"] });

const PAGE = "d-pharma-admission-mumbai";
const DEFAULT_BRANCH = "bhayandar";
// The branches this campaign runs to. ?branch=<slug> highlights one of them.
const LP_BRANCH_SLUGS = ["bhayandar", "nalasopara"];
const TIMING = "Mon–Sat, 10am–7pm";

export const metadata: Metadata = {
  title: {
    absolute: "D.Pharma Admission 2026-27 Mumbai | Girls up to 100% Fees Waived | ABS",
  },
  description:
    "D.Pharma (Diploma in Pharmacy) admission guidance for Mumbai, Bhayandar, Nalasopara, Vasai and Virar. No NEET needed. Girls up to 100% fees waived, boys up to 50%. Free counselling.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/lp/d-pharma-admission-mumbai" },
};

export default async function DpharmaLandingPage() {
  const [settings, allBranches] = await Promise.all([getSiteSettings(), getBranches()]);

  const brand = settings.orgName || "ABS Educational Solution";
  const phone = settings.phone;
  const phoneRaw = phone ? phone.replace(/\s/g, "") : "";
  const waHref = whatsappLink(
    settings.whatsappNumber,
    "Hi, I want to know about D.Pharma admission and the fee waiver.",
  );
  const callHref = phoneRaw ? `tel:${phoneRaw}` : waHref;

  const branches: LpBranch[] = LP_BRANCH_SLUGS.flatMap((slug) => {
    const b = allBranches.find((x) => x.slug === slug);
    const branchPhone = b?.phone || phone;
    if (!b || !branchPhone) return [];
    return [{
      slug: b.slug,
      name: b.name,
      // Stored addresses usually already end with the pincode — only append it if not.
      address:
        (b.address && b.postalCode && !b.address.includes(b.postalCode)
          ? `${b.address} ${b.postalCode}`
          : b.address) || b.area || b.name,
      mapsUrl: b.mapsUrl,
      phone: branchPhone,
      timing: TIMING,
    }];
  });

  return (
    <div
      className={`dpharma-lp ${archivo.className}`}
      style={{ ["--display" as string]: archivo.style.fontFamily } as React.CSSProperties}
    >
      <LpTracker page={PAGE} />
      <LeadPopup
        page={PAGE}
        courseLabel="D.Pharma"
        whatsappNumber={settings.whatsappNumber}
        title="Find out what you would actually pay"
        sub="Girls up to 100% of fees covered, boys up to 50%. Leave your number and a counsellor will call you — free, no charge at any stage."
      />

      {/* Urgency bar. Swap in the real DTE deadline as soon as it is published,
          e.g. "Round 2 closes 28 August · Enquire today". A dated line converts
          better than a generic one and does not go stale in the reader's mind. */}
      <a className="abs-alert" href="#form-top"><i />Admissions closing soon &middot; Enquire today</a>

      <header className="abs-head">
        <div className="abs-head-in">
          <div className="abs-logo">ABS<span>.</span><small>Educational Solution</small></div>
          <TrackedLink event="call_click" page={PAGE} location="header" className="abs-head-call" href={callHref}>
            Call now
          </TrackedLink>
        </div>
      </header>

      {/* ================= HERO + FORM ================= */}
      <section className="abs-hero">
        <div className="abs-wrap">
          <p className="abs-eyebrow">Mumbai &middot; Mira-Bhayandar &middot; Vasai&ndash;Virar</p>
          <h1 className="abs-h1">D.Pharma Admission<br /><span className="abs-h1-yr">2026-27</span></h1>

          <div className="abs-schol">
            <span className="abs-schol-tag">Government scholarship available</span>
            <div className="abs-schol-cell">
              <span className="abs-schol-n">100%</span>
              <span className="abs-schol-l"><b>Girls</b> &mdash; up to</span>
            </div>
            <div className="abs-schol-cell is-boys">
              <span className="abs-schol-n">50%</span>
              <span className="abs-schol-l"><b>Boys</b> &mdash; up to</span>
            </div>
          </div>

          <p className="abs-hook">
            Diploma in Pharmacy &mdash; two years after 12th.{" "}
            <strong>No NEET, no entrance exam.</strong> Admission on your HSC marks.
          </p>

          <div className="abs-card" id="form-top">
            <p className="abs-card-h">Talk to a counsellor</p>
            <p className="abs-card-sub">We will check your eligibility and go through your options.</p>
            <DpharmaLeadForm idPrefix="hero" source="hero_form" />
            <div className="abs-trustline">
              <span><i>&#10003;</i> Free for students</span>
              <span><i>&#10003;</i> No registration fee</span>
              <span><i>&#10003;</i> Since 2009</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TRUST BAND ================= */}
      <div className="abs-band">
        <div className="abs-wrap">
          <div className="abs-band-grid">
            <div><b>2009</b><small>Guiding students since</small></div>
            <div><b>16,000+</b><small>Students placed</small></div>
            <div><b>6</b><small>Branches across MMR</small></div>
            <div><b>&#8377;0</b><small>Our fee to students</small></div>
          </div>
        </div>
      </div>

      {/* ================= SCHOLARSHIP ================= */}
      <section className="abs-sec" id="scholarship">
        <div className="abs-wrap">
          <p className="abs-eyebrow">Scholarship</p>
          <h2 className="abs-h2">Most of your fees can be covered</h2>
          <p>
            The Government of Maharashtra runs a scholarship that pays the tuition and examination
            fees for eligible students in professional courses. D.Pharma qualifies.
          </p>

          <div className="abs-waiver">
            <div className="abs-w-card abs-w-card--hero">
              <div className="abs-w-pct">100%</div>
              <div className="abs-w-who">Girls &mdash; up to</div>
              <p>Tuition fees <em>and</em> exam fees covered.</p>
            </div>
            <div className="abs-w-card">
              <div className="abs-w-pct">50%</div>
              <div className="abs-w-who">Boys &mdash; up to</div>
              <p>Tuition plus part of the exam fee.</p>
            </div>
          </div>

          <div className="abs-cond">
            <h3>Broadly, it is for students who</h3>
            <ul>
              <li>Come from a family earning <b>up to &#8377;8 lakh</b> a year</li>
              <li>Hold a <b>Maharashtra domicile</b> certificate</li>
              <li>Take admission <b>through the government process</b></li>
            </ul>
          </div>

          <p style={{ marginTop: "14px", fontSize: "14.5px" }}>
            There are conditions and deadlines beyond these, and they decide whether an application
            is approved or rejected. Our counsellor will go through your case, tell you honestly what
            you qualify for, and handle the paperwork with you. {brand} does not award the
            scholarship &mdash; the government does.
          </p>

          <a className="abs-nudge is-amber" href="#form-top">Ask a counsellor about my case</a>
        </div>
      </section>

      {/* ================= NO NEET ================= */}
      <section className="abs-sec abs-sec--white">
        <div className="abs-wrap">
          <p className="abs-eyebrow">Clearing up the biggest myth</p>
          <h2 className="abs-h2">You do not need NEET for D.Pharma</h2>
          <p>
            There is no entrance exam. No NEET, no MHT-CET, no college test. Admission to the Diploma
            in Pharmacy in Maharashtra is decided on your Class 12 marks alone.
          </p>
          <ul className="abs-list">
            <li>Pass HSC with <b>Physics and Chemistry</b>, plus <b>Maths or Biology</b>, and English</li>
            <li>The merit list is built from your <b>HSC marks</b></li>
            <li>Minimum marks differ by category &mdash; the DTE brochure is the final word, and we will check yours</li>
          </ul>
          <p style={{ marginTop: "14px" }}>
            This is why D.Pharma is the fastest route into a medical career after 12th for students
            who did not write NEET, or did not clear it.
          </p>
        </div>
      </section>

      {/* ================= FEES + RECEIPT ================= */}
      <section className="abs-sec">
        <div className="abs-wrap">
          <p className="abs-eyebrow">What it actually costs</p>
          <h2 className="abs-h2">Real fees, and what the waiver removes</h2>
          <p>
            Fees are set by the Fee Regulating Authority and revised every year, so treat these as
            approximate ranges for 2026-27. Government seats are cheap. Private unaided colleges are
            where the waiver changes everything.
          </p>

          <table className="abs-fee">
            <thead><tr><th>College type</th><th className="abs-amt-h">Tuition per year</th></tr></thead>
            <tbody>
              <tr><td>Government &amp; aided</td><td className="abs-amt">&#8377;10,000 &ndash; &#8377;25,000</td></tr>
              <tr><td>Private unaided</td><td className="abs-amt">&#8377;60,000 &ndash; &#8377;1,25,000</td></tr>
            </tbody>
          </table>

          <div className="abs-receipt">
            <p className="abs-rc-head">Diploma in Pharmacy</p>
            <p className="abs-rc-sub">Private unaided &middot; 2 years &middot; example</p>
            <div className="abs-rc-line"><b>Tuition, year 1</b><span className="abs-rc-amt">&#8377;1,00,000</span></div>
            <div className="abs-rc-line"><b>Tuition, year 2</b><span className="abs-rc-amt">&#8377;1,00,000</span></div>
            <div className="abs-rc-line"><b>Examination fees</b><span className="abs-rc-amt">&#8377;8,000</span></div>
            <hr className="abs-rc-rule" />
            <div className="abs-rc-total"><b>Total payable</b><span className="abs-rc-amt">&#8377;2,08,000</span></div>
            <div className="abs-rc-stamp">
              <span>Eligible girl &middot; scholarship applied</span>
              <b>&#8377;0</b>
            </div>
            <p className="abs-rc-foot">
              Illustration only. Actual fees depend on the college and are fixed by the Fee
              Regulating Authority. Waiver subject to government approval.
            </p>
          </div>

          <a className="abs-nudge" href="#form-top">Find out what I would pay</a>
        </div>
      </section>

      {/* ================= CAREER ================= */}
      <section className="abs-sec abs-sec--pale">
        <div className="abs-wrap">
          <p className="abs-eyebrow">After the diploma</p>
          <h2 className="abs-h2">Two years, then you can run your own medical store</h2>
          <p>
            D.Pharma is the minimum qualification needed to register as a pharmacist and apply for a
            drug licence. That is the part students underestimate &mdash; it is a business you can
            own, not only a job you can take.
          </p>
          <ul className="abs-list">
            <li><b>Your own medical store</b> &mdash; register as a pharmacist, then apply for a drug licence</li>
            <li><b>Hospital pharmacist</b> &mdash; private and government hospitals</li>
            <li><b>Government pharmacist</b> &mdash; municipal, state health services and railways</li>
            <li><b>Pharma industry</b> &mdash; production, quality control, packaging, warehousing</li>
            <li><b>Medical representative</b> &mdash; field sales for pharmaceutical companies</li>
            <li><b>B.Pharm later</b> &mdash; enter the second year directly through DTE lateral entry, so the diploma is not a dead end</li>
          </ul>
          <p style={{ marginTop: "16px", fontSize: "14.5px" }}>
            Honest numbers: retail pharmacy freshers usually start around &#8377;10,000&ndash;&#8377;18,000
            a month. Government pharmacist posts start higher, roughly &#8377;18,000&ndash;&#8377;28,000.
            With five years of experience, &#8377;35,000&ndash;&#8377;70,000 is realistic. Anyone
            promising more than that is selling you something.
          </p>
        </div>
      </section>

      {/* ================= PROCESS ================= */}
      <section className="abs-sec">
        <div className="abs-wrap">
          <p className="abs-eyebrow">How admission works</p>
          <h2 className="abs-h2">The CAP process, in five steps</h2>
          <ol className="abs-steps">
            <li><b>Pass HSC</b>Physics and Chemistry, with Maths or Biology, and English.</li>
            <li><b>Register on the DTE portal</b>Fill the online form, upload documents and complete verification inside the notified window.</li>
            <li><b>DTE publishes the merit list</b>Your rank is calculated from your HSC marks and category.</li>
            <li><b>Fill the CAP option form</b>List your preferred colleges in order. Getting this order right is the single decision that determines where you study.</li>
            <li><b>Accept, report and pay</b>Confirm your allotted seat, report to the college with original documents and pay the fees.</li>
          </ol>
          <p style={{ marginTop: "6px", fontSize: "14.5px" }}>
            Seats left vacant after the CAP rounds are filled by colleges under DTE rules, on merit.
            DTE registration is required for every seat type, including institute-level seats.
          </p>
          <a className="abs-nudge" href="#form-top">Get help with my option form</a>
        </div>
      </section>

      {/* ================= BRANCHES ================= */}
      <section className="abs-sec abs-sec--white" id="branches">
        <div className="abs-wrap">
          <p className="abs-eyebrow">Come and sit with us</p>
          <h2 className="abs-h2">We are down the road, not on the other end of a phone</h2>
          <p>
            Bring your marksheet and your parents. Counselling is free, there is nothing to pay, and
            you will leave knowing exactly where you stand.
          </p>
          <Suspense fallback={<BranchList branches={branches} active={DEFAULT_BRANCH} />}>
            <BranchCards branches={branches} defaultBranch={DEFAULT_BRANCH} />
          </Suspense>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="abs-sec">
        <div className="abs-wrap">
          <p className="abs-eyebrow">Questions students actually ask</p>
          <h2 className="abs-h2">Straight answers</h2>

          <div className="abs-faq">
            <details open>
              <summary>Do I need NEET for D.Pharma?</summary>
              <div className="abs-a"><p>No. There is no entrance exam of any kind. Selection is on your HSC marks in Physics, Chemistry and Maths or Biology.</p></div>
            </details>

            <details>
              <summary>Can I really get 100% of my fees covered?</summary>
              <div className="abs-a">
                <p>Girls can get up to 100% of tuition and exam fees under the state scholarship. Boys can get up to 50%. It depends on your family income, your domicile and how you take admission.</p>
                <p>Eligibility is decided by the government, not by us. Our counsellor will check your specific case and tell you honestly what you qualify for.</p>
              </div>
            </details>

            <details>
              <summary>I missed the DTE registration date. What are my options?</summary>
              <div className="abs-a">
                <p>Registration for 2026-27 closed on 31 July 2026, and DTE registration is required for every seat type &mdash; including institute-level seats. So this needs a proper conversation rather than a form.</p>
                <p>Call us. Depending on your situation we will look at what is genuinely still open this year, other paramedical courses with live admissions, or planning properly for the next cycle.</p>
              </div>
            </details>

            <details>
              <summary>How long is the course?</summary>
              <div className="abs-a"><p>Two years full time after 12th, plus 500 hours of practical training. It is regulated by the Pharmacy Council of India and conducted under MSBTE in Maharashtra.</p></div>
            </details>

            <details>
              <summary>Do I have to clear an exit exam to become a registered pharmacist?</summary>
              <div className="abs-a">
                <p>As of February 2026, the Pharmacy Council of India suspended the Diploma in Pharmacy Exit Examination requirement and asked State Pharmacy Councils to resume registering pass-out students under Section 32(2) of the Pharmacy Act, 1948.</p>
                <p>This rule has changed more than once since 2022, so confirm the position again when you finish the course.</p>
              </div>
            </details>

            <details>
              <summary>Can I do B.Pharm after D.Pharma?</summary>
              <div className="abs-a"><p>Yes. Diploma holders can enter the second year of B.Pharm through DTE&apos;s lateral entry process, which runs as a separate admission cycle.</p></div>
            </details>

            <details>
              <summary>Which colleges will you suggest?</summary>
              <div className="abs-a"><p>That depends on your marks, your category, your budget and how far you are willing to travel. We go through the realistic options with you on the call or at the branch, rather than publishing a list that may not suit you.</p></div>
            </details>

            <details>
              <summary>What does {brand} charge?</summary>
              <div className="abs-a"><p>Nothing. Our guidance is free for students and their families. We are paid by our partner institutions, not by you.</p></div>
            </details>
          </div>
        </div>
      </section>

      {/* ================= FINAL FORM ================= */}
      <section className="abs-sec abs-sec--pale">
        <div className="abs-wrap">
          <p className="abs-eyebrow">Still deciding?</p>
          <h2 className="abs-h2">Ask a counsellor</h2>
          <p>Leave your number and we will call you back. No fee, no obligation.</p>
          <div className="abs-card" style={{ marginTop: "16px" }}>
            <DpharmaLeadForm idPrefix="foot" source="footer_form" />
          </div>
        </div>
      </section>

      <footer className="abs-foot">
        <div className="abs-wrap">
          <p>
            <b>{brand}</b> &mdash; admission guidance for paramedical and nursing courses across
            Mumbai, Thane and Palghar. Branches at Bhayandar, Nalasopara, Malad, Andheri, Thane and
            Kurla.
          </p>
          <p>
            {brand} is an independent admission guidance service. We are not a college, a university,
            or a government body.
          </p>
          <p>
            The scholarship described on this page is a scheme of the Government of Maharashtra.
            Eligibility is determined solely by the government, and amounts shown are the maximum
            available to eligible students. Course fees are regulated by the Fee Regulating Authority
            and admission dates are notified by DTE Maharashtra; both are revised periodically and
            may change without notice.
          </p>
        </div>
      </footer>

      <nav className="abs-bar">
        <TrackedLink event="call_click" page={PAGE} location="sticky" className="abs-bar-call" href={callHref}>
          Call
        </TrackedLink>
        <TrackedLink event="whatsapp_click" page={PAGE} location="sticky" className="abs-bar-wa" href={waHref} target="_blank" rel="noopener">
          WhatsApp
        </TrackedLink>
      </nav>
    </div>
  );
}
