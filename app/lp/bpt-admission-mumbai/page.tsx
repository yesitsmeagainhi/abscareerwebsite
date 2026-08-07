import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";

import LeadPopup from "@/components/lp/LeadPopup";
import LpTracker from "@/components/lp/LpTracker";
import TrackedLink from "@/components/lp/TrackedLink";
import { getSiteSettings } from "@/lib/content";
import { CONTENT_UPDATED, formatDate, whatsappLink } from "@/lib/site";

import BptEligibilityCheck from "./BptEligibilityCheck";
import BptLeadForm from "./BptLeadForm";
import HeroCopy, { HeroBlock } from "./HeroCopy";
import "./bpt-lp.css";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], axes: ["wdth"] });

const PAGE = "bpt-admission-mumbai";

const DEFAULT_KICKER = "2026–27 admissions open";
const DEFAULT_LEDE =
  "Bachelor of Physiotherapy admission guidance for students across Maharashtra — eligibility, course fees, NEET UG merit and the full CAP counselling process, step by step. Free counselling from a consultancy that has guided 16,000+ students in 16 years.";

export const metadata: Metadata = {
  title: {
    absolute: "BPT Admission 2026-27 in Mumbai | BPT Course Fees & Eligibility",
  },
  description:
    "BPT admission 2026-27 in Mumbai and Maharashtra. Check BPT course eligibility, fees, duration and the full NEET-based admission process. Free counselling, 16,000+ students guided.",
  // Ad landing page — kept out of the index so it can't compete with the site's
  // own course pages, same as the other /lp pages.
  robots: { index: false, follow: true },
  alternates: { canonical: "/lp/bpt-admission-mumbai" },
};

function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2.01c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.16-1.35a9.93 9.93 0 0 0 4.88 1.27h.01c5.5 0 9.96-4.46 9.96-9.96a9.9 9.9 0 0 0-2.91-7.04 9.9 9.9 0 0 0-7.06-2.91zm0 18.2h-.01a8.27 8.27 0 0 1-4.21-1.15l-.3-.18-3.13.82.84-3.05-.2-.31a8.24 8.24 0 0 1-1.26-4.37c0-4.56 3.71-8.27 8.28-8.27 2.21 0 4.29.86 5.85 2.42a8.22 8.22 0 0 1 2.42 5.86c0 4.57-3.71 8.28-8.28 8.28zm4.54-6.2c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.98-.14.16-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.43.06-.65.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.54c.12.17 1.73 2.64 4.19 3.7.59.25 1.04.4 1.4.52.59.19 1.12.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.11-.22-.17-.47-.29z" />
    </svg>
  );
}

export default async function BptLandingPage() {
  const settings = await getSiteSettings();
  const brand = settings.orgName || "ABS Educational Solution";
  const phone = settings.phone;
  const phoneRaw = phone ? phone.replace(/\s/g, "") : "";
  const waHref = whatsappLink(
    settings.whatsappNumber,
    "Hi ABS, I want details about BPT admission 2026-27.",
  );
  const callHref = phoneRaw ? `tel:${phoneRaw}` : waHref;
  const address = settings.address || "Mumbai, Maharashtra";
  const reviewed = formatDate(CONTENT_UPDATED) || "recently";

  return (
    <div
      className="bpt-lp"
      style={{ ["--sans" as string]: bricolage.style.fontFamily } as React.CSSProperties}
    >
      <LpTracker page={PAGE} />
      <LeadPopup
        page={PAGE}
        courseLabel="BPT (Bachelor of Physiotherapy)"
        whatsappNumber={settings.whatsappNumber}
        title="Still deciding about BPT?"
        sub="Leave your number and a counsellor calls you back with your eligibility and fee options. Free, no obligation."
      />

      <header className="bar">
        <div className="row">
          <div className="logo">{brand}<span>Since 2009 · Mumbai</span></div>
          <TrackedLink event="call_click" page={PAGE} location="header" className="btn btn-line" href={callHref}>
            Call now
          </TrackedLink>
        </div>
      </header>

      <nav className="jumpbar" aria-label="Page sections">
        <div className="jump">
          <a href="#admission-process">BPT admission process</a>
          <a href="#course">Course details</a>
          <a href="#eligibility">BPT eligibility</a>
          <a href="#check">Check eligibility</a>
          <a href="#fees">BPT course fees</a>
          <a href="#colleges">Branches</a>
          <a href="#faq">FAQs</a>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <div className="hero">
        <div className="wrap hero-grid">
          <div>
            <Suspense fallback={<HeroBlock kicker={DEFAULT_KICKER} lede={DEFAULT_LEDE} />}>
              <HeroCopy kicker={DEFAULT_KICKER} lede={DEFAULT_LEDE} />
            </Suspense>
            <div className="hero-cta">
              <span className="free-tag">✓ Free counselling · ✓ No donation · ✓ 6 Mumbai branches</span>
            </div>
          </div>

          <div className="enq" id="enquiry">
            <div className="rule" />
            <h3>Enquire about BPT admission</h3>
            <p className="small">Tell us where you stand and a counsellor calls you back with your options.</p>
            <div style={{ marginTop: "18px" }}>
              <BptLeadForm idPrefix="e" location="hero" submitLabel="Get admission details" />
            </div>
          </div>
        </div>
      </div>

      <div className="ribbon">
        <div className="wrap">
          <div className="inner">
            <div className="cell"><b>16,000+</b><span>Students guided</span></div>
            <div className="cell"><b>16+ yrs</b><span>Admission legacy</span></div>
            <div className="cell"><b>6</b><span>Mumbai branches</span></div>
            <div className="cell"><b>₹0</b><span>Donation. Ever.</span></div>
          </div>
        </div>
      </div>

      {/* ================= COURSE AT A GLANCE ================= */}
      <section className="bg-white" id="course">
        <div className="wrap">
          <div className="sec-head">
            <span className="kicker">BPT course details</span>
            <h2>BPT course details: duration, eligibility and fees</h2>
            <p className="lede">
              Bachelor of Physiotherapy, the BPT course, is an undergraduate BPT paramedical course
              that trains you to treat pain, injury and movement problems without surgery or
              medication. Here are the BPT course details students ask about most.
            </p>
          </div>
          <dl className="facts">
            <div className="rw"><dt>Full form</dt><dd>Bachelor of Physiotherapy (BPT / BPTh)<small>A BPT degree is classified as a paramedical / allied health course</small></dd></div>
            <div className="rw"><dt>BPT course duration</dt><dd>4.5 years<small>BPT duration is 4 years of academics plus a compulsory 6-month clinical internship. Asked another way — BPT how many years — four and a half.</small></dd></div>
            <div className="rw"><dt>BPT course eligibility</dt><dd>12th pass with Physics, Chemistry, Biology and English<small>Around 50% aggregate in PCB for open category, 40–45% for reserved categories — the exact bar is set by the admitting authority</small></dd></div>
            <div className="rw"><dt>Minimum age</dt><dd>17 years by the date specified in the admission rules</dd></div>
            <div className="rw"><dt>Entrance exam</dt><dd>NEET UG — compulsory<small>BPT admission in Maharashtra runs on NEET UG merit through the State CET Cell. There is no admission route without a valid NEET score.</small></dd></div>
            <div className="rw"><dt>BPT course fees</dt><dd>Roughly ₹2 lakh to ₹15 lakh for the full course<small>Varies widely between government, private-unaided and deemed institutions</small></dd></div>
            <div className="rw"><dt>After BPT</dt><dd>Practise as a physiotherapist, or continue to MPT and specialise</dd></div>
          </dl>
        </div>
      </section>

      {/* ================= ADMISSION PROCESS ================= */}
      <section id="admission-process">
        <div className="wrap">
          <div className="sec-head">
            <span className="kicker">BPT admission process 2026–27</span>
            <h2>BPT course admission process, step by step</h2>
            <p className="lede">
              Full BPT course information, step by step. Most students lose seats not because of
              marks, but because they miss a step or a deadline — so here is the sequence, with the
              BPT details that actually decide the outcome.
            </p>
          </div>
          <div className="steps">
            <div className="st"><div className="n" /><h3>Clear the eligibility bar</h3>
              <p>Pass 12th with Physics, Chemistry, Biology and English individually, and meet the minimum PCB percentage for your category.</p></div>
            <div className="st"><div className="n" /><h3>Appear for NEET UG, if you want a CAP seat</h3>
              <p>Maharashtra&apos;s centralised admission process runs on NEET UG merit. NEET UG 2026 was held as a re-exam on 21 June 2026 and results were declared on 16 July 2026.</p></div>
            <div className="st"><div className="n" /><h3>Register for state CAP counselling</h3>
              <p>The State CET Cell under DMER conducts CAP for BPTh alongside BOTh, BASLP and B(P&amp;O). Registration, document upload and fee payment happen on cetcell.mahacet.org.</p></div>
            <div className="st"><div className="n" /><h3>Fill and lock your choices</h3>
              <p>This is where guidance pays for itself. A well-ordered choice list across rounds matters far more than the first allotment you receive.</p></div>
            <div className="st"><div className="n" /><h3>Seat allotment and reporting</h3>
              <p>Multiple rounds run, including mop-up and stray vacancy rounds. Seats vacated by candidates moving up open at lower ranks in later rounds.</p></div>
            <div className="st"><div className="n" /><h3>Document verification and fee payment</h3>
              <p>Report to the allotted institution with originals. Apply for your scholarship on MahaDBT in parallel — the deadlines do not wait for your admission to settle.</p></div>
          </div>

          <div className="notice">
            <b>About &ldquo;direct admission in BPT in Mumbai&rdquo;</b>
            <p>
              People search this a lot, so let&apos;s be plain. There is no legal shortcut that buys
              you a seat in Maharashtra — the Maharashtra Educational Institutions (Prohibition of
              Capitation Fee) Act makes selling seats an offence, and anyone quoting you a price for
              one is putting your admission and your money at risk. Every BPT seat in the state is
              allotted on NEET UG merit under the rules published for that year. What we do is make
              sure your choice list, documents and round timing give you the best outcome your score
              allows. We do not collect donations, and we do not sell seats.
            </p>
          </div>
        </div>
      </section>

      {/* ================= ELIGIBILITY ================= */}
      <section className="bg-white" id="eligibility">
        <div className="wrap">
          <div className="sec-head">
            <span className="kicker">BPT eligibility criteria</span>
            <h2>BPT eligibility: who can apply after 12th</h2>
            <p className="lede">
              The BPT eligibility criteria are set by the admitting authority and vary slightly by
              category and institution. This is the baseline every BPT course after 12th works from.
            </p>
          </div>
          <div className="grid2">
            <div className="box">
              <h3>Academic qualification for BPT course</h3>
              <ul className="ticks">
                <li>Passed 12th / HSC with <b>Physics, Chemistry, Biology and English</b>, each passed individually</li>
                <li>Around <b>50% aggregate in PCB</b> for open category; <b>40–45%</b> for reserved categories</li>
                <li>Any recognised board — state, CBSE, ICSE or NIOS</li>
                <li>Students who took Mathematics instead of Biology are <b>not</b> eligible for a BPT course after 12th</li>
              </ul>
            </div>
            <div className="box">
              <h3>Other admission criteria for physiotherapy</h3>
              <ul className="ticks">
                <li><b>17 years of age</b> by the date specified in the admission rules</li>
                <li>A valid <b>NEET UG 2026 score</b> — compulsory, there is no BPT admission without it</li>
                <li><b>Maharashtra domicile</b> documents for state-quota seats and state scholarships</li>
                <li>Physical fitness certificate, where the institution asks for one</li>
              </ul>
              <p className="tiny" style={{ marginTop: "14px" }}>
                BPT ke liye qualification har college mein thodi alag ho sakti hai — apne marksheet
                ke saath ek baar check karwa lena behtar hai.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ELIGIBILITY CHECKER ================= */}
      <div className="check" id="check">
        <div className="wrap" style={{ maxWidth: "720px" }}>
          <span className="kicker inv">Free eligibility check</span>
          <h2>Check your BPT admission eligibility in 3 questions</h2>
          <p className="lede" style={{ marginTop: "12px" }}>
            No phone number needed to see your result. Answer three questions and we&apos;ll tell you
            which admission routes are open to you and which fee waivers you may claim.
          </p>
          <BptEligibilityCheck />
        </div>
      </div>

      {/* ================= FEES ================= */}
      <section id="fees">
        <div className="wrap">
          <div className="sec-head">
            <span className="kicker">BPT course fees</span>
            <h2>BPT course fees in Mumbai and Maharashtra</h2>
            <p className="lede">
              Bachelor of Physiotherapy fees vary enormously by institution type, and the
              physiotherapy fee structure is reset every academic year. Below is the BPT course
              duration and fees picture, and what BPT course fees per year work out to. What most
              families miss is how much of it comes back through MahaDBT schemes when the paperwork
              is filed correctly and on time.
            </p>
          </div>

          <div className="tw">
            <table>
              <thead><tr><th>Institution type</th><th>Indicative total course fees</th><th>What decides it</th></tr></thead>
              <tbody>
                <tr><td><b>Government &amp; aided</b></td><td>Lowest of the three brackets</td><td>Fees approved by the Fees Regulating Authority; allotted through CAP on NEET merit</td></tr>
                <tr><td><b>Private unaided</b></td><td>BPT fees in private colleges sit in the mid to upper range of ₹2–15 lakh</td><td>FRA-approved fee for that academic year; CAP and institute-level seats</td></tr>
                <tr><td><b>Deemed university</b></td><td>Generally the highest</td><td>Fee set by the university itself, and not regulated by the FRA</td></tr>
              </tbody>
            </table>
          </div>
          <p className="tiny" style={{ margin: "10px 0 26px" }}>
            Indicative ranges only. Final tuition is whatever the Fees Regulating Authority and the
            institution have approved for that academic year, and it is revised annually. We show you
            the approved fee notification for any college we discuss with you.
          </p>

          <h3 style={{ marginBottom: "14px" }}>Maharashtra scholarship and fee-waiver schemes</h3>
          <div className="schemes">
            <div className="scheme"><b>Rajarshi Chhatrapati Shahu Maharaj tuition fee scholarship — girl students</b>
              <span>Under the GR dated 8 July 2024, eligible girl students in professional courses receive 100% of tuition and exam fees, subject to category, income limit and admission conditions.</span>
              <span className="amt">Up to 100% tuition + exam fee</span></div>
            <div className="scheme"><b>Rajarshi Shahu Maharaj Shikshan Shulk Shishyavrutti (EBC)</b>
              <span>Fee reimbursement for economically backward students in professional courses, with an annual family income ceiling.</span>
              <span className="amt">Partial fee reimbursement</span></div>
            <div className="scheme"><b>Post-Matric Scholarship &amp; freeship — SC and ST</b>
              <span>Tuition, exam and maintenance support through the Social Justice and Tribal Development departments.</span>
              <span className="amt">Fees + maintenance</span></div>
            <div className="scheme"><b>OBC, VJNT and SBC schemes</b>
              <span>Tuition and exam fee payment schemes run by the OBC, SEBC, VJNT &amp; SBC Welfare Department, including dedicated schemes for girls in professional courses.</span>
              <span className="amt">Tuition + exam fee</span></div>
            <div className="scheme"><b>Dr. Panjabrao Deshmukh Vasatigruh Nirvah Bhatta</b>
              <span>Hostel maintenance allowance for eligible hostellers, with a higher slab where a parent is a small landholder or registered agricultural labourer.</span>
              <span className="amt">Annual hostel allowance</span></div>
            <div className="scheme"><b>Minority community scholarships</b>
              <span>Schemes for students from notified minority communities pursuing higher and professional education.</span>
              <span className="amt">Fee assistance</span></div>
          </div>

          <div className="notice">
            <b>Know your waiver before the counselling desk asks for money</b>
            <p>
              Fee-concession students have repeatedly reported that some physiotherapy and AYUSH
              institutes in Maharashtra demand the full tuition amount at admission despite an
              eligible waiver, because state reimbursement to colleges runs late. Know which scheme
              you fall under, keep your documents ready, and put any excess demand in writing to the
              CET Cell.
            </p>
          </div>
        </div>
      </section>

      {/* ================= AFTER BPT ================= */}
      <section className="bg-white">
        <div className="wrap">
          <div className="sec-head">
            <span className="kicker">After BPT</span>
            <h2>After BPT: jobs and further study</h2>
            <p className="lede">
              Demand comes from three directions at once — an ageing population, lifestyle conditions
              like back pain and cervical spondylosis, and a sports and fitness industry that now
              hires trained rehab staff.
            </p>
          </div>
          <div className="grid2">
            <div className="box">
              <h3>Where physiotherapists work</h3>
              <ul className="ticks">
                <li>Hospitals and post-surgical rehabilitation units</li>
                <li>Orthopaedic, neuro and cardio-respiratory rehab centres</li>
                <li>Sports teams, academies and performance clinics</li>
                <li>Geriatric care and home-visit practice</li>
                <li>Independent clinic — a licensed BPT graduate can practise on their own</li>
                <li>Government health services, and abroad after local licensing</li>
              </ul>
            </div>
            <div className="box">
              <h3>Study options after BPT</h3>
              <ul className="ticks">
                <li><b>MPT</b> — the standard next step, with specialisations in ortho, neuro, sports, cardio-respiratory and paediatrics</li>
                <li>Certification courses in manual therapy, dry needling and sports rehab</li>
                <li>MPT is a separate university-level admission — no NEET involved</li>
                <li>Teaching and academic roles generally need a postgraduate degree</li>
              </ul>
              <p className="tiny" style={{ marginTop: "14px" }}>
                Career paths vary by individual. No institution or consultancy can guarantee
                placement or salary.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CALLBACK ================= */}
      <section id="callback">
        <div className="wrap cbwrap">
          <div>
            <span className="kicker">Talk to a counsellor</span>
            <h2>Still not sure where you stand?</h2>
            <p className="lede" style={{ marginTop: "14px" }}>
              Leave your number and a counsellor calls you back. No script, no pressure — they&apos;ll
              ask where you stand and tell you plainly what&apos;s open to you.
            </p>
            <ul className="ticks" style={{ marginTop: "18px" }}>
              <li>One counsellor, one call — we don&apos;t pass your number around</li>
              <li>Free, whether or not you enrol anywhere</li>
              <li>₹0 donation. We don&apos;t collect capitation fees or sell seats.</li>
              <li>Walk into any of our six Mumbai branches instead, if you prefer</li>
            </ul>
          </div>
          <div className="cbcard">
            <BptLeadForm idPrefix="cb" location="callback" withStage submitLabel="Request a callback" />
          </div>
        </div>
      </section>

      {/* ================= BRANCHES ================= */}
      <section className="bg-ink tight" id="colleges">
        <div className="wrap">
          <div className="sec-head">
            <span className="kicker inv">Walk in and talk</span>
            <h2>Six branches across Mumbai</h2>
            <p className="lede">
              Searching for BPT colleges near me, or for a BPT course near me, only tells you what
              exists — not which ones you are actually eligible for, or what they will cost you after
              your scholarship. Bring your marksheet, NEET scorecard and category documents to any
              branch and a counsellor goes through your real options in one sitting, at no charge.
            </p>
          </div>
          <div className="branches">
            <div className="branch"><b>Bhayandar</b><span>Mira-Bhayandar</span></div>
            <div className="branch"><b>Nalasopara</b><span>Vasai-Virar</span></div>
            <div className="branch"><b>Malad</b><span>Western suburbs</span></div>
            <div className="branch"><b>Andheri</b><span>Western suburbs</span></div>
            <div className="branch"><b>Thane</b><span>Thane city</span></div>
            <div className="branch"><b>Kurla</b><span>Central suburbs</span></div>
          </div>
          <p className="small" style={{ color: "#A7AEBB", marginTop: "16px" }}>
            We work with Bachelor of Physiotherapy colleges across Maharashtra and beyond. Which of
            those Bachelor in Physiotherapy colleges you are actually eligible for depends on your
            merit, category and budget — that is the conversation to have at a branch, not on a
            webpage.
          </p>
          <TrackedLink event="call_click" page={PAGE} location="branches" className="btn btn-mark" href={callHref} style={{ marginTop: "20px" }}>
            Call to fix a branch visit
          </TrackedLink>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section id="faq">
        <div className="wrap">
          <div className="sec-head">
            <span className="kicker">BPT admission FAQs</span>
            <h2>Questions we get every single day</h2>
          </div>
          <div className="faq">
            <details><summary>BPT kya hota hai? What is the BPT course?</summary>
              <div className="a">BPT ka full form hai Bachelor of Physiotherapy. Ye ek undergraduate degree hai jisme aap seekhte hain ki injury, pain aur movement problems ka ilaaj bina surgery aur bina dawai ke kaise kiya jaata hai — exercise therapy, electrotherapy aur manual techniques se. Course 4.5 saal ka hota hai, jisme 4 saal padhai aur 6 mahine ki compulsory internship shaamil hai.</div></details>
            <details><summary>BPT kitne saal ka course hai? How many years is the BPT course?</summary>
              <div className="a">The BPT course duration is four and a half years in total — four years of academic study followed by a compulsory six-month clinical internship. Some universities structure it slightly differently, so confirm with the specific institution.</div></details>
            <details><summary>Is NEET compulsory for BPT admission in Maharashtra?</summary>
              <div className="a">Yes. BPTh admission is filled through the State CET Cell&apos;s centralised admission process on NEET UG merit, alongside BOTh, BASLP and B(P&amp;O). A valid NEET UG score is required — there is no separate non-NEET route into a BPT seat in Maharashtra.</div></details>
            <details><summary>Can I get BPT admission without NEET in Mumbai?</summary>
              <div className="a">No. BPT admission in Maharashtra runs on NEET UG merit and a valid score is compulsory. If anyone offers you a &ldquo;guaranteed&rdquo; BPT seat without NEET for a price, walk away — that is exactly what the capitation fee law exists to stop, and it puts both your money and your admission at risk. If you don&apos;t have a NEET score this year, the honest conversation is about attempting NEET UG 2027, or about the allied-health and paramedical courses that admit on 12th marks — we guide students through those too.</div></details>
            <details><summary>What is the BPT course eligibility and qualification after 12th?</summary>
              <div className="a">The BPT qualification requirement is straightforward: you need to have passed 12th with Physics, Chemistry, Biology and English as individual subjects, generally with around 50% aggregate in PCB for open category and 40–45% for reserved categories. You also need to be at least 17 years old by the date specified in the admission rules. The exact percentage bar is set by the admitting authority, so it&apos;s worth checking against your actual marksheet.</div></details>
            <details><summary>What are the BPT course fees in Mumbai and the BPT fee structure?</summary>
              <div className="a">Broadly ₹2 lakh to ₹15 lakh for the whole course, depending on whether the institution is government, private-unaided or deemed. Final tuition is whatever the Fees Regulating Authority has approved for that year. If you&apos;re eligible for a Maharashtra fee-waiver scheme, a substantial part of it can come back through MahaDBT — which is why the scholarship paperwork matters as much as the admission itself.</div></details>
            <details><summary>My NEET score is low. Is BPT still realistic?</summary>
              <div className="a">Often yes. Physiotherapy cut-offs sit well below MBBS and BDS, and the later CAP rounds release seats vacated by candidates who move up to other courses. What matters is filling choices intelligently across rounds rather than staking everything on Round 1.</div></details>
            <details><summary>Do you charge for counselling?</summary>
              <div className="a">No. The eligibility check and the counselling conversation are free. We do not collect capitation fees or donations, and we do not sell seats. Any fee is paid by you directly to the institution, against a receipt.</div></details>
            <details><summary>Which college will I get?</summary>
              <div className="a">That depends on your NEET merit, category, domicile, choice order and the seat matrix published for each round — nobody can honestly answer it from a web form. Once we have your actual numbers, a counsellor walks you through the institutions that are realistic for you, with their approved fee notification and affiliation status.</div></details>
            <details><summary>What documents do I need for BPT admission?</summary>
              <div className="a">10th and 12th marksheets and passing certificates, NEET UG 2026 scorecard and rank letter if you appeared, Aadhaar, Maharashtra domicile certificate, caste certificate and caste validity where applicable, non-creamy-layer certificate for OBC, income certificate for the correct financial year, and passport photographs. Scholarship applications are filed through MahaDBT and every scheme has its own deadline.</div></details>
          </div>
        </div>
      </section>

      <div className="final">
        <div className="wrap">
          <h2>Counselling rounds don&apos;t wait.</h2>
          <p>Find out where you stand and what&apos;s realistic for your marks — free, and with no obligation.</p>
          <a className="btn btn-primary" href="#enquiry">Get BPT admission details</a>
        </div>
      </div>

      <div className="contactstrip">
        <div className="wrap in">
          <div>
            <b>{brand}</b>
            <p>Independent admission guidance consultancy for nursing, physiotherapy and allied health courses. Operating since 2009.</p>
          </div>
          <div>
            <b>Head office</b>
            <p>{address}</p>
          </div>
          <div>
            <b>Contact</b>
            <p>
              <TrackedLink event="call_click" page={PAGE} location="contact-strip" href={callHref}>
                {phone || "Call us"}
              </TrackedLink>
            </p>
            <p style={{ marginTop: "6px" }}>
              <Link href="/about">About us</Link> &nbsp;·&nbsp; <Link href="/contact">Contact</Link>
            </p>
          </div>
        </div>
      </div>

      <footer className="lp-footer">
        <div className="wrap">
          <b>{brand}</b> — admission guidance for nursing, physiotherapy and allied health courses.
          Branches at Bhayandar, Nalasopara, Malad, Andheri, Thane and Kurla.
          <div className="disc">
            {brand} is an independent admission guidance consultancy. It is not a college, university
            or admitting authority, and it is not affiliated with the State CET Cell, DMER, MUHS or
            NTA. We do not guarantee admission, a seat, a scholarship, placement or salary.
            Eligibility, seat allotment and fees are decided solely by the admitting authority and
            the institution concerned, under the rules in force for that academic year. Scholarship
            and fee-waiver schemes referred to here are Government of Maharashtra schemes
            administered through MahaDBT, subject to their own eligibility conditions, income limits
            and deadlines. We do not charge, accept or facilitate capitation fees or donations of any
            kind. Content last reviewed on {reviewed} and may change; always verify with the official
            CET Cell and NTA websites.
          </div>
        </div>
      </footer>

      <TrackedLink
        event="whatsapp_click"
        page={PAGE}
        location="float"
        className="wa-float"
        href={waHref}
        target="_blank"
        rel="noopener"
        aria-label="Chat with us on WhatsApp"
      >
        <WaIcon />
      </TrackedLink>

      <div className="sticky">
        <TrackedLink event="call_click" page={PAGE} location="sticky" className="btn btn-line icon" href={callHref} aria-label={`Call ${brand}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </TrackedLink>
        <TrackedLink event="whatsapp_click" page={PAGE} location="sticky" className="btn btn-wa icon" href={waHref} target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">
          <WaIcon />
        </TrackedLink>
        <a className="btn btn-primary" href="#check">Check eligibility</a>
      </div>
    </div>
  );
}
