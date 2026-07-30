import type { Metadata } from "next";
import { Archivo } from "next/font/google";

import LeadPopup from "@/components/lp/LeadPopup";
import LpTracker from "@/components/lp/LpTracker";
import TrackedLink from "@/components/lp/TrackedLink";
import { getSiteSettings } from "@/lib/content";
import { CONTENT_UPDATED, formatDate, whatsappLink } from "@/lib/site";

import BscLeadForm from "./BscLeadForm";
import "./bsc-lp.css";

const archivo = Archivo({ subsets: ["latin"], weight: ["500", "600", "700"] });

const PAGE = "bsc-nursing-mumbai";

export const metadata: Metadata = {
  title: {
    absolute: "BSc Nursing Admission 2026 Maharashtra | Seats Available, Free Counselling — Mumbai",
  },
  description:
    "BSc Nursing seats available for 2026. Free counselling from Mumbai's admission team. Check scholarship eligibility — tuition may be 100% covered for eligible girl students.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/lp/bsc-nursing-mumbai" },
};

export default async function BscNursingLandingPage() {
  const settings = await getSiteSettings();
  const brand = settings.orgName || "ABS Educational Solution";
  const phone = settings.phone;
  const phoneRaw = phone ? phone.replace(/\s/g, "") : "";
  const waHref = whatsappLink(
    settings.whatsappNumber,
    "Hi, I want BSc Nursing admission & scholarship guidance (Mumbai, 2026-27).",
  );
  const callHref = phoneRaw ? `tel:${phoneRaw}` : waHref;
  const address = settings.address || "Mumbai, Maharashtra";
  const updated = formatDate(CONTENT_UPDATED) || "recently";

  return (
    <div className="bsc-lp" style={{ ["--sans" as string]: archivo.style.fontFamily } as React.CSSProperties}>
      <LpTracker page={PAGE} />
      <LeadPopup
        page={PAGE}
        courseLabel="BSc Nursing"
        whatsappNumber={settings.whatsappNumber}
        title="Talk to a Nursing Admission Expert"
        sub="Get BSc Nursing admission & scholarship guidance on WhatsApp or a quick call back — just leave your name & number."
      />

      <header className="hdr">
        <div className="wrap">
          <div className="brand">{brand}<em>Nursing admissions since 2010</em></div>
          <TrackedLink event="call_click" page={PAGE} location="header" className="hdr-call" href={callHref}>
            {phone ? `Call ${phone}` : "Call us"}
          </TrackedLink>
        </div>
      </header>

      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <div className="eyebrow">Admissions open · 2026–27 · Maharashtra</div>
            <h1>BSc Nursing admission in Mumbai — seats available for 2026</h1>
            <p className="sub">
              Fill the form and a counsellor calls you within 2 hours with the colleges that have
              seats open for your marks, your category and your district. We&apos;ll also check which
              scholarships you qualify for — <b>for most girl students, tuition is fully covered by
              the state.</b>
            </p>
            <div className="chips">
              <span className="chip">16,000+ students admitted</span>
              <span className="chip">16+ years</span>
              <span className="chip">Mumbai admissions</span>
              <span className="chip">Free counselling</span>
            </div>
          </div>
          <BscLeadForm whatsappNumber={settings.whatsappNumber} phone={phone} />
        </div>
      </section>

      <div className="urg">Seats are allotted in merit order as each CAP round passes — <strong>apply early</strong> to keep your options open.</div>

      <section className="legacy">
        <div className="wrap lgrid">
          <div className="lstat"><b>16,000+</b><span>Students admitted to nursing programmes</span></div>
          <div className="lstat"><b>16+</b><span>Years guiding Maharashtra admissions</span></div>
          <div className="lstat"><b>2 hrs</b><span>Typical callback time on an enquiry</span></div>
          <div className="lstat"><b>100%</b><span>Tuition waiver available to eligible girl students</span></div>
        </div>
      </section>

      <section className="avail-sec">
        <div className="wrap">
          <div className="eyebrow">Seat availability</div>
          <h2>Seats are open for BSc Nursing admission in Mumbai</h2>
          <p className="intro">The 2026–27 intake is live. Availability moves with every CAP round, so what we quote you is the position today — not a page we wrote last month.</p>
          <div className="board">
            <div className="board-hd">
              <span>BSc Nursing · 2026–27 · Mumbai</span>
              <em>Last checked {updated}</em>
            </div>
            <div className="status">
              <span className="pill open">Seats open</span>
              <p>Places are currently available across our partner colleges for the 2026–27 intake, in both the state quota and the institutional rounds.</p>
            </div>
            <div className="board-ft">Which colleges, how many seats and what they cost are shared on your counselling call — usually within 2 hours of your enquiry.</div>
          </div>
          <div className="avail-cta"><a href="#form-top" className="inline-btn gold">Check seats for my marks</a></div>
        </div>
      </section>

      <section className="schol-sec">
        <div className="wrap">
          <div className="eyebrow">Fees &amp; scholarships</div>
          <h2>Most of our students pay far less than the sticker fee</h2>
          <p className="lede">Here is what nursing actually costs in Maharashtra, for both routes. Very few families pay the full sticker amount, because Maharashtra runs several fee-reimbursement schemes that students routinely miss — usually because nobody told them the MahaDBT deadline.</p>
          <div className="feetab">
            <div className="fitem">
              <h3>BSc Nursing<small>4 years · degree · INC recognised</small></h3>
              <div className="fnums">
                <div className="fnum"><span>Government</span><b>₹15,000 – ₹40,000</b></div>
                <div className="fnum"><span>Private</span><b>₹85,000 – ₹1,50,000</b></div>
              </div>
              <p className="avg">Opens the widest career path — higher studies, senior posts and overseas registration.</p>
            </div>
            <div className="fitem">
              <h3>GNM<small>3 years + 6-month internship · diploma</small></h3>
              <div className="fnums">
                <div className="fnum"><span>Government</span><b>₹10,000 – ₹30,000</b></div>
                <div className="fnum"><span>Private</span><b>₹50,000 – ₹2,00,000</b></div>
              </div>
              <p className="avg">Private colleges in Maharashtra average about <b>₹90,000 a year</b>. Cheaper and shorter than BSc, and it still qualifies you as a registered nurse.</p>
            </div>
          </div>
          <p className="feenote">Indicative annual tuition. Maharashtra fees are set by the Fee Regulating Authority and vary by college, so treat these as a planning range — we confirm the exact figure for the colleges that suit you on the call. Hostel, exam, uniform and university charges are extra.</p>
          <div className="schol-hero">
            <h3>If you&apos;re a girl student with family income under ₹8 lakh, your tuition may be 100% covered</h3>
            <p>Maharashtra pays the full tuition and examination fees for female students from OBC, SEBC and EWS backgrounds in professional courses, under the Rajarshi Chhatrapati Shahu Maharaj scheme. Nursing qualifies. Most families we sit with had no idea.</p>
          </div>
          <div className="slist">
            <div className="sitem"><div className="who">Girl students · OBC, SEBC, EWS</div><h3>100% tuition + exam fee waiver</h3><p>Family income up to ₹8 lakh. Applied for on the MahaDBT portal after admission. Covers professional courses including nursing.</p></div>
            <div className="sitem"><div className="who">SC, ST, VJNT, SBC</div><h3>Post-matric scholarship</h3><p>Tuition and exam fees plus maintenance allowance. Applied on MahaDBT. Caste certificate and validity are required, so get them ready early.</p></div>
            <div className="sitem"><div className="who">EWS · all genders</div><h3>Rajarshi Shahu Maharaj fee reimbursement</h3><p>Partial tuition fee reimbursement for economically weaker students with family income up to ₹8 lakh, in government and private unaided colleges.</p></div>
            <div className="sitem"><div className="who">Orphan students</div><h3>Full tuition + exam fee waiver</h3><p>100% waiver for orphan students admitted to recognised professional courses through the centralised admission process.</p></div>
            <div className="sitem"><div className="who">Minority communities</div><h3>Minority scholarship for professional courses</h3><p>State scholarship for students from notified minority communities in professional and higher education courses.</p></div>
          </div>
          <p className="caveat">These are Maharashtra government schemes, not ours — we don&apos;t fund them and we can&apos;t approve them. What we do is check which ones you qualify for, make sure your income and caste documents are ready in time, and walk you through the MahaDBT application so it isn&apos;t rejected. Eligibility rules change between years; we check yours against the current GR on the call.</p>
          <div className="avail-cta"><a href="#form-top" className="inline-btn">Check my scholarship eligibility</a></div>
        </div>
      </section>

      <section className="ruler-sec">
        <div className="wrap">
          <div className="eyebrow">Where you stand</div>
          <h2>There is a path at every percentile. The call is about finding yours.</h2>
          <p className="intro">Most students who ring us think their score has closed every door. It usually hasn&apos;t — it has changed which doors, and which round to aim for.</p>
          <div className="ruler">
            <div className="band"><div className="pct">Below 40</div><div className="say">Options open in later CAP rounds and institutional rounds. Timing matters more than score here.</div></div>
            <div className="band"><div className="pct">40 – 60</div><div className="say">Private nursing colleges across the Mumbai Metropolitan Region are realistic.</div></div>
            <div className="band"><div className="pct">60 – 80</div><div className="say">Wide private choice. Reserved categories may reach government colleges.</div></div>
            <div className="band"><div className="pct">80 +</div><div className="say">Government colleges come into range. Preference order becomes the deciding factor.</div></div>
          </div>
          <p className="ruler-note">Indicative only, based on category-wise closing percentiles from the previous cycle. Your actual position depends on category, district and the seat matrix published for each round.</p>
          <div className="ruler-cta"><a href="#form-top" className="inline-btn">Find my position</a></div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="eyebrow">After you submit</div>
          <h2>What happens next</h2>
          <div className="next">
            <div className="next-item"><div className="next-num">1</div><div><h3>We call within 2 hours</h3><p>A counsellor tells you which colleges have seats for your percentile and category, what they cost, and which scholarships you qualify for.</p></div></div>
            <div className="next-item"><div className="next-num">2</div><div><h3>You visit the branch</h3><p>30 minutes at our Mumbai branch. We check your documents, finalise your shortlist and set your CAP preference order.</p></div></div>
            <div className="next-item"><div className="next-num">3</div><div><h3>Admission and paperwork</h3><p>We stay with you through allotment, reporting and the MahaDBT scholarship application.</p></div></div>
          </div>
        </div>
      </section>

      <section className="sec sec-alt">
        <div className="wrap">
          <div className="eyebrow">Why in person</div>
          <h2>What we can tell you that no website will</h2>
          <p className="lede">Seat position changes daily during CAP rounds. That&apos;s why this is a conversation, not a downloadable list.</p>
          <div className="vgrid">
            <div className="vcell"><h3>Live vacancy status</h3><p>Which partner colleges have seats open right now, updated through each round — not last month&apos;s list.</p></div>
            <div className="vcell"><h3>Category-wise closing percentiles</h3><p>Previous cycle cutoffs for your specific category, so you order your preference list on evidence instead of guesswork.</p></div>
            <div className="vcell"><h3>Your real cost after scholarship</h3><p>Tuition, hostel, exam and university fees per college, minus what the state will reimburse you. Often a very different number.</p></div>
            <div className="vcell"><h3>Recognition, checked</h3><p>Indian Nursing Council and Maharashtra Nursing Council status and university affiliation, verified for every college we put in front of you.</p></div>
            <div className="vcell"><h3>Placement reality</h3><p>Which hospitals each college actually places into, and what starting salaries look like — not brochure numbers.</p></div>
            <div className="vcell"><h3>Documents, sorted</h3><p>Domicile, caste validity, non-creamy layer, income certificate, gap certificate. We tell you what&apos;s missing before it costs you a round or a scholarship.</p></div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="eyebrow">Straight answers</div>
          <h2>Questions students ask us</h2>
          <details><summary>Why don&apos;t you list the college names on this page?</summary><p>Because seat availability changes with every CAP round, and a published list goes out of date within days. We&apos;d rather tell you on the call what actually has seats for your percentile today.</p></details>
          <details><summary>Are seats really available?</summary><p>Yes. Seats are open for the 2026–27 intake across our partner colleges, and we re-check the position as each CAP round closes. Exactly which seats suit you depends on your percentile and category.</p></details>
          <details><summary>Is the counselling free?</summary><p>Yes. The call, the shortlist, the preference-order help and the scholarship check cost you nothing at any stage.</p></details>
          <details><summary>Then how do you earn?</summary><p>Our partner colleges pay us a referral fee when a student we&apos;ve guided confirms admission. It comes from the college&apos;s own budget and adds nothing to the fees you pay.</p></details>
          <details><summary>Can you guarantee me admission?</summary><p>No, and be careful of anyone who says they can. Admission in Maharashtra runs through the State CET Cell on merit. What we do is make sure your preference list, documents and round timing give you the best outcome available for your score.</p></details>
          <details><summary>Do you arrange the scholarship?</summary><p>No — these are state government schemes and only the government approves them. We check which ones you&apos;re eligible for and help you file correctly on MahaDBT before the deadline.</p></details>
        </div>
      </section>

      <section className="sec sec-alt">
        <div className="wrap">
          <div className="eyebrow">Find us</div>
          <h2>Our Mumbai branch</h2>
          <div className="branch">
            <dl>
              <dt>Address</dt><dd>{address}</dd>
              <dt>Open</dt><dd>Mon–Sat, 10:00 AM – 7:00 PM</dd>
              <dt>Phone</dt><dd><TrackedLink event="call_click" page={PAGE} location="branch" href={callHref} style={{ color: "var(--pine)" }}>{phone || "Call us"}</TrackedLink></dd>
            </dl>
            <div className="mapbox">
              <p><strong>Walk in during office hours</strong><br />Parents are welcome — most students bring one.</p>
              <a className="inline-btn" href={`https://www.google.com/maps/search/${encodeURIComponent(address)}`} target="_blank" rel="noopener noreferrer">Get directions</a>
            </div>
          </div>
        </div>
      </section>

      <section className="close-sec">
        <div className="wrap close-grid">
          <div>
            <div className="eyebrow" style={{ color: "var(--marigold)" }}>Seats are moving</div>
            <h2>16 years. 16,000 admissions. One phone call.</h2>
            <p className="lede">Every round that passes, the seats that suit your score get fewer — and the MahaDBT scholarship window won&apos;t stay open either. Two minutes now saves a year.</p>
            <div className="chips">
              <span className="chip">Free counselling</span>
              <span className="chip">Call back in 2 hours</span>
              <span className="chip">Scholarship check included</span>
            </div>
          </div>
          <div className="card">
            <h2>Check seat availability</h2>
            <p className="lede">A counsellor calls within 2 hours with your matched colleges.</p>
            <a className="btn" href="#form-top" style={{ display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>Show me available seats</a>
            <p className="assure">
              Or call{" "}
              <TrackedLink event="call_click" page={PAGE} location="close" href={callHref} style={{ color: "var(--pine)", fontWeight: 600 }}>{phone || "us"}</TrackedLink>
              {" · "}WhatsApp{" "}
              <TrackedLink event="whatsapp_click" page={PAGE} location="close" href={waHref} style={{ color: "var(--pine)", fontWeight: 600 }}>{phone || "us"}</TrackedLink>
            </p>
          </div>
        </div>
      </section>

      <footer className="lp-footer">
        <div className="wrap">
          <div className="fbrand">{brand}</div>
          <p>{brand} is an independent admission guidance service. We are not a college, a university, or affiliated with the State CET Cell, the Indian Nursing Council or the Maharashtra Nursing Council. Admission to BSc Nursing in Maharashtra is granted solely by the competent authority on merit through the centralised admission process. Scholarship schemes referred to on this page are Government of Maharashtra schemes; eligibility and approval rest entirely with the government.</p>
          <p>{address}{phone ? ` · ${phone}` : ""}</p>
          <p>© 2026 {brand}</p>
        </div>
      </footer>

      <div className="bar">
        <a className="b1" href="#form-top">Check seats</a>
        <TrackedLink event="whatsapp_click" page={PAGE} location="sticky" className="b2" href={waHref}>WhatsApp</TrackedLink>
      </div>
    </div>
  );
}
