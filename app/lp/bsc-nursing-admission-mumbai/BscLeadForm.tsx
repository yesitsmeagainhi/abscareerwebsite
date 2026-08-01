"use client";

import { useMemo, useRef, useState } from "react";

import { track } from "@/lib/track";

const PAGE = "bsc-nursing-admission-mumbai";
const COURSE = "BSc Nursing";

const EDU_OPTIONS = [
  "Appearing for 12th this year",
  "Passed 12th (PCB), result out",
  "Passed 12th, awaiting result",
  "Passed 12th more than a year ago",
  "Completed GNM / ANM diploma",
  "Currently in another course",
];

const CATEGORIES = ["Open", "OBC", "SC", "ST", "VJNT", "SBC / SEBC", "EWS", "Minority"];

const DISTRICTS = [
  "Mumbai City", "Mumbai Suburban", "Thane", "Palghar", "Raigad", "Pune", "Satara", "Sangli",
  "Solapur", "Kolhapur", "Nashik", "Ahilyanagar", "Dhule", "Jalgaon", "Nandurbar",
  "Chhatrapati Sambhajinagar", "Jalna", "Beed", "Latur", "Dharashiv", "Nanded", "Parbhani",
  "Hingoli", "Nagpur", "Amravati", "Akola", "Yavatmal", "Buldhana", "Washim", "Wardha",
  "Chandrapur", "Gadchiroli", "Bhandara", "Gondia", "Ratnagiri", "Sindhudurg", "Outside Maharashtra",
];

function fireGtag(event: string) {
  try {
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", event, { page: PAGE });
  } catch {
    /* ignore */
  }
}

export default function BscLeadForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [edu, setEdu] = useState("");
  const [marks, setMarks] = useState("");
  const [district, setDistrict] = useState("");
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");
  const [consent, setConsent] = useState(false);
  const [err, setErr] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const needsMarks = /result out|more than a year|GNM/.test(edu);
  const validMobile = /^[6-9]\d{9}$/.test(mobile);

  const scholNote = useMemo(() => {
    if (!gender) return "";
    if (!category) {
      return gender === "Female"
        ? "Girl students may get a 100% tuition & exam fee waiver — Maharashtra covers full fees for female students in OBC, SEBC and EWS categories with family income under ₹8 lakh. Add your category for a straight answer, or we'll check on the call."
        : "Several state fee-reimbursement schemes apply depending on category and family income. Add your category for a straight answer, or we'll check on the call.";
    }
    if (gender === "Female" && /OBC|SEBC|EWS/.test(category))
      return "You may qualify for a 100% tuition & exam fee waiver (girl students in these categories, family income under ₹8 lakh). We'll confirm on the call.";
    if (/^SC$|^ST$|VJNT|SBC/.test(category))
      return "You may qualify for the post-matric scholarship — tuition, exam fees and a maintenance allowance. Keep your caste validity ready.";
    if (gender === "Female" && category === "Open")
      return "An EWS certificate may open the girls' fee waiver for you (family income under ₹8 lakh). We'll go through it on the call.";
    if (category === "Minority")
      return "State minority scholarships apply to professional courses including nursing. We'll check which one fits.";
    return "Several state fee-reimbursement schemes may still apply depending on family income. We'll check yours on the call.";
  }, [gender, category]);

  function scrollTop() {
    topRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  function next1() {
    const bad = { name: name.trim().length < 2, mobile: !validMobile };
    setErr((e) => ({ ...e, ...bad }));
    if (bad.name || bad.mobile) return;
    fireGtag("form_step1");
    setStep(2);
    scrollTop();
  }

  function next2() {
    const bad = {
      edu: !edu,
      marks: needsMarks && !marks.trim(),
      district: !district.trim(),
    };
    setErr((e) => ({ ...e, ...bad }));
    if (bad.edu || bad.marks || bad.district) return;
    fireGtag("form_step2");
    setStep(3);
    scrollTop();
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const bad = { gender: !gender, consent: !consent };
    setErr((er) => ({ ...er, ...bad }));
    if (bad.gender || bad.consent) return;

    setLoading(true);
    try {
      await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: mobile,
          course: `${COURSE}${gender ? ` · ${gender}` : ""}${edu ? ` · ${edu}` : ""}`,
          city: district || undefined,
          category: category || undefined,
          percentage12: marks.trim() || undefined,
          sourcePage: `/lp/${PAGE}`,
        }),
      });
    } catch {
      /* best-effort */
    }
    fireGtag("generate_lead");
    track("form_submit", { page: PAGE, location: "form" });
    // Real page load at a stable URL → Google Ads "page load" conversion.
    window.location.assign("/lp/bsc-nursing-admission-mumbai/thank-you");
  }

  return (
    <div className="card" id="form-top" ref={topRef}>
        <>
          <h2>Check seat availability</h2>
          <p className="lede">Takes 30 seconds. A counsellor calls you within 2 hours with your matched colleges.</p>
          <div className="prog">
            <div className={`pstep ${step >= 1 ? "on" : ""}`}><i></i><b>You</b></div>
            <div className={`pstep ${step >= 2 ? "on" : ""}`}><i></i><b>Studies</b></div>
            <div className={`pstep ${step >= 3 ? "on" : ""}`}><i></i><b>Seats</b></div>
          </div>

          <form onSubmit={onSubmit} noValidate>
            {step === 1 && (
              <div>
                <div className={`field ${err.name ? "bad" : ""}`}>
                  <label htmlFor="bname">Student&apos;s full name</label>
                  <input id="bname" type="text" autoComplete="name" value={name}
                    onChange={(e) => setName(e.target.value)} />
                  {err.name && <div className="err show">Please enter the student&apos;s name</div>}
                </div>
                <div className={`field ${err.mobile ? "bad" : ""}`}>
                  <label htmlFor="bmobile">Mobile number</label>
                  <div className="phone">
                    <span>+91</span>
                    <input id="bmobile" type="tel" inputMode="numeric" maxLength={10}
                      autoComplete="tel-national" placeholder="10-digit number" value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} />
                  </div>
                  {err.mobile && <div className="err show">Enter a valid 10-digit mobile number</div>}
                  <div className="hint">This is where we call with your college list.</div>
                </div>
                <button type="button" className="btn" onClick={next1}>Continue</button>
                <p className="assure" style={{ marginTop: "10px" }}>Step 1 of 3 · about 30 seconds in total</p>
              </div>
            )}

            {step === 2 && (
              <div>
                <div className={`field ${err.edu ? "bad" : ""}`}>
                  <label htmlFor="bedu">Where are you in your studies?</label>
                  <select id="bedu" value={edu} onChange={(e) => setEdu(e.target.value)}>
                    <option value="">Select one</option>
                    {EDU_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                  {err.edu && <div className="err show">Please tell us where you&apos;ve reached</div>}
                </div>
                {needsMarks && (
                  <div className={`field ${err.marks ? "bad" : ""}`}>
                    <label htmlFor="bmarks">12th PCB % or MH Nursing CET percentile</label>
                    <input id="bmarks" type="text" inputMode="decimal" placeholder="e.g. 68% or 54 percentile"
                      value={marks} onChange={(e) => setMarks(e.target.value)} />
                    {err.marks && <div className="err show">Please enter your marks or percentile</div>}
                    <div className="hint">This is what decides which colleges are open to you.</div>
                  </div>
                )}
                <div className={`field ${err.district ? "bad" : ""}`}>
                  <label htmlFor="bdist">Your district</label>
                  <input id="bdist" list="bsc-districts" autoComplete="off"
                    placeholder="Start typing — Thane, Kalyan, Nashik…" value={district}
                    onChange={(e) => setDistrict(e.target.value)} />
                  <datalist id="bsc-districts">
                    {DISTRICTS.map((d) => <option key={d} value={d} />)}
                  </datalist>
                  {err.district && <div className="err show">Please enter your district</div>}
                  <div className="hint">Domicile affects which seats you&apos;re eligible for.</div>
                </div>
                <button type="button" className="btn" onClick={next2}>Continue</button>
                <button type="button" className="btn-ghost" onClick={() => setStep(1)}>← Back</button>
              </div>
            )}

            {step === 3 && (
              <div>
                <div className={`field ${err.gender ? "bad" : ""}`}>
                  <label>Student is</label>
                  <div className="pills">
                    {["Female", "Male", "Other"].map((g) => (
                      <span key={g}>
                        <input type="radio" name="bgender" id={`bg-${g}`} value={g}
                          checked={gender === g} onChange={() => { setGender(g); setErr((e) => ({ ...e, gender: false })); }} />
                        <label htmlFor={`bg-${g}`}>{g}</label>
                      </span>
                    ))}
                  </div>
                  {err.gender && <div className="err show">Please select one</div>}
                </div>
                <div className="field">
                  <label htmlFor="bcat">Category <span style={{ fontWeight: 500, color: "var(--muted)" }}>(optional)</span></label>
                  <select id="bcat" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Prefer not to say / not sure</option>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <div className="hint">Tell us and we can name your scholarship right now. Skip it and we&apos;ll check on the call.</div>
                </div>
                {scholNote && <div className="schol-note show">{scholNote}</div>}
                <div className="consent">
                  <input type="checkbox" id="bconsent" checked={consent}
                    onChange={(e) => { setConsent(e.target.checked); setErr((er) => ({ ...er, consent: false })); }} />
                  <label htmlFor="bconsent">
                    I agree to be contacted about BSc Nursing admission guidance, and to my details being shared
                    with partner colleges for this purpose.
                  </label>
                </div>
                {err.consent && <div className="err show" style={{ marginTop: "-8px", marginBottom: "10px" }}>Please tick the box so we can call you</div>}
                <button type="submit" className="btn" disabled={loading}>
                  {loading ? "Submitting…" : "Show me available seats"}
                </button>
                <button type="button" className="btn-ghost" onClick={() => setStep(2)}>← Back</button>
              </div>
            )}
          </form>
          <p className="assure">Free · No obligation · Your number is not sold to third parties</p>
        </>
    </div>
  );
}
