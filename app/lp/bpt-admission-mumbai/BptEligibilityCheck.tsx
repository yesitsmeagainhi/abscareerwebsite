"use client";

import { useEffect, useRef, useState } from "react";

import { track } from "@/lib/track";

import { PAGE, THANK_YOU, fireGtag, submitLead, validMobile } from "./lead";

const TOTAL = 3;

const CATEGORIES = [
  "Open / General", "EWS", "OBC", "SEBC", "SC", "ST", "VJNT / NT", "SBC", "Minority community",
];

const INCOMES = ["Up to ₹2.5 lakh", "₹2.5 lakh – ₹8 lakh", "Above ₹8 lakh"];

type Verdict = { label: string; title: string; why: string };

function computeVerdict(neet: string, pcbRaw: string): Verdict {
  const pcb = parseFloat(pcbRaw) || 0;
  // BPT admission in Maharashtra is NEET-only — no NEET score, no BPT seat.
  if (neet !== "Qualified") {
    return {
      label: "NEET needed",
      title: "A valid NEET UG score is required for BPT",
      why: "BPT admission in Maharashtra runs entirely on NEET UG merit through the State CET Cell's centralised admission process, so without a qualifying score BPT is not open to you for the 2026–27 intake. Anyone offering you a BPT seat without NEET is selling you a problem, not a seat. Two things are worth talking through on a call: planning properly for NEET UG 2027, and the allied-health and paramedical courses that admit on 12th marks alone — we guide students into those every year.",
    };
  }
  if (pcb >= 45) {
    return {
      label: "Eligible",
      title: "State CAP on NEET merit, plus institute-level seats",
      why: "You hold a valid NEET UG 2026 score and your PCB marks clear the academic bar, so the State CET Cell's centralised admission process is open to you. BPTh is allotted there alongside BOTh, BASLP and B(P&O), across government and private colleges in one merit list — and government fee-waiver schemes apply on CAP seats. What decides your outcome now is how you order your choices and which round you target.",
    };
  }
  return {
    label: "Needs review",
    title: "Your PCB marks sit near the eligibility bar",
    why: "You have a NEET score, but admitting authorities set the minimum PCB percentage differently by category and institution, and your marks sit close enough to that line that a generic answer would mislead you. A counsellor will check your marksheet against the current rules and tell you plainly whether BPT is open, and what the allied-health alternatives look like if it isn't.",
  };
}

function computeSchemes(gender: string, cat: string, income: string): string[] {
  const under = !income.startsWith("Above");
  const backward = ["OBC", "SEBC", "VJNT / NT", "SBC", "EWS"].includes(cat);
  const scst = cat === "SC" || cat === "ST";
  const out: string[] = [];

  if (gender === "Female" && under && (backward || cat === "Open / General"))
    out.push("Rajarshi Chhatrapati Shahu Maharaj tuition fee scholarship for girls — under the GR dated 8 July 2024, eligible girl students in professional courses receive up to 100% of tuition and exam fees");
  if (scst)
    out.push(`Post-Matric Scholarship and freeship for ${cat} students — tuition, exam fees and maintenance allowance`);
  if (backward && under && gender !== "Female")
    out.push("OBC / VJNT / SBC tuition and exam fee payment scheme");
  if (cat === "Open / General" && under && gender !== "Female")
    out.push("Rajarshi Shahu Maharaj Shikshan Shulk Shishyavrutti (EBC) — fee reimbursement for economically backward students");
  if (cat === "Minority community")
    out.push("Minority community scholarship for higher and professional courses");
  if (under)
    out.push("Dr. Panjabrao Deshmukh Vasatigruh Nirvah Bhatta — hostel maintenance allowance if you stay in a hostel");
  if (!out.length)
    out.push("Most state fee-reimbursement schemes use an ₹8 lakh income ceiling, so the main ones are unlikely to apply. A counsellor will check institution-level scholarships and education loan routes with you.");

  return out;
}

export default function BptEligibilityCheck() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 4 = result
  const [neet, setNeet] = useState("");
  const [score, setScore] = useState("");
  const [pcb, setPcb] = useState("");
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");
  const [income, setIncome] = useState("");
  const [err, setErr] = useState<Record<string, boolean>>({});
  const [result, setResult] = useState<{ verdict: Verdict; schemes: string[] } | null>(null);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const moved = useRef(false);

  // Scroll the panel into view on every step change after the first paint, so
  // the question the student is answering is never below the fold.
  useEffect(() => {
    if (!moved.current) {
      moved.current = true;
      return;
    }
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  function validStep(n: 1 | 2 | 3): boolean {
    if (n === 1) {
      const bad = !neet;
      setErr((s) => ({ ...s, neet: bad }));
      return !bad;
    }
    if (n === 2) {
      const p = parseFloat(pcb);
      const bad = { pcb: Number.isNaN(p) || p < 0 || p > 100, gender: !gender };
      setErr((s) => ({ ...s, ...bad }));
      return !bad.pcb && !bad.gender;
    }
    const bad = { category: !category, income: !income };
    setErr((s) => ({ ...s, ...bad }));
    return !bad.category && !bad.income;
  }

  function goResult(cat = category, inc = income) {
    const p = parseFloat(pcb);
    const bad = { category: !cat, income: !inc };
    setErr((s) => ({ ...s, ...bad }));
    if (bad.category || bad.income) return;
    if (Number.isNaN(p)) return;

    setResult({ verdict: computeVerdict(neet, pcb), schemes: computeSchemes(gender, cat, inc) });
    fireGtag("eligibility_result");
    track("form_step", { page: PAGE, location: "eligibility-result" });
    setStep(4);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const bad = { rname: name.trim().length < 2, rmobile: !validMobile(mobile), rconsent: !consent };
    setErr((s) => ({ ...s, ...bad }));
    if (bad.rname || bad.rmobile || bad.rconsent) return;

    setLoading(true);
    await submitLead({
      name: name.trim(),
      phone: mobile,
      course: `BPT · NEET: ${neet}${score ? ` (${score})` : ""} · ${result?.verdict.label ?? ""}`,
      category: category || undefined,
      percentage12: pcb ? `${pcb}% PCB` : undefined,
    });
    fireGtag("generate_lead");
    track("form_submit", { page: PAGE, location: "eligibility-check" });
    window.location.assign(THANK_YOU);
  }

  const progress = step === 4 ? 100 : (step / TOTAL) * 100;

  return (
    <div className="panel" ref={panelRef}>
      <div className="panel-hd">
        <b>{step === 4 ? "Your result" : "Eligibility check"}</b>
        <span className="qc">{step === 4 ? "Result" : `Question ${step} of ${TOTAL}`}</span>
      </div>
      <div className="track"><i style={{ width: `${progress}%` }} /></div>

      <div className="panel-bd">
        {step === 1 && (
          <div>
            <div className="qtext">What&apos;s your NEET UG 2026 status?</div>
            <div className="qhelp">Tap your answer — we move on automatically.</div>
            <div className="choices">
              {[
                { v: "Qualified", label: "I qualified", note: "Scored above my category cut-off" },
                { v: "Appeared, not qualified", label: "I appeared but didn't qualify" },
                { v: "Did not appear", label: "I didn't appear for NEET" },
              ].map((o) => (
                <label className="ch" key={o.v}>
                  <input
                    type="radio"
                    name="bpt-neet"
                    value={o.v}
                    checked={neet === o.v}
                    onChange={() => {
                      setNeet(o.v);
                      setErr((s) => ({ ...s, neet: false }));
                      if (o.v !== "Qualified") window.setTimeout(() => setStep(2), 260);
                    }}
                  />
                  <span>{o.label}{o.note && <small>{o.note}</small>}</span>
                </label>
              ))}
            </div>
            {err.neet && <p className="er">Tap one to continue.</p>}

            {neet === "Qualified" && (
              <>
                <div className="f" style={{ marginTop: "18px" }}>
                  <label className="fl" htmlFor="bptScore">Your NEET score, if you remember it</label>
                  <input
                    id="bptScore"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={720}
                    placeholder="Out of 720 — optional"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                  />
                </div>
                <div className="qnav">
                  <button type="button" className="btn btn-mark btn-full" onClick={() => validStep(1) && setStep(2)}>Next</button>
                </div>
              </>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="qtext">Your 12th PCB marks, and your gender</div>
            <div className="qhelp">Physics + Chemistry + Biology aggregate only — not the overall HSC percentage.</div>
            <div className="f">
              <label className="fl" htmlFor="bptPcb">PCB percentage</label>
              <input
                id="bptPcb"
                type="number"
                inputMode="decimal"
                min={0}
                max={100}
                placeholder="e.g. 62"
                value={pcb}
                onChange={(e) => { setPcb(e.target.value); setErr((s) => ({ ...s, pcb: false })); }}
              />
              {err.pcb && <p className="er">Enter a percentage between 0 and 100.</p>}
            </div>
            <div className="f">
              <span className="fl">Gender</span>
              <div className="choices two">
                {["Female", "Male"].map((g) => (
                  <label className="ch" key={g}>
                    <input
                      type="radio"
                      name="bpt-gender"
                      value={g}
                      checked={gender === g}
                      onChange={() => { setGender(g); setErr((s) => ({ ...s, gender: false })); }}
                    />
                    <span>{g}</span>
                  </label>
                ))}
              </div>
              {err.gender && <p className="er">Tap one to continue.</p>}
              <p className="hintx">Maharashtra runs a 100% tuition waiver for eligible girl students, so this changes the answer.</p>
            </div>
            <div className="qnav">
              <button type="button" className="btn btn-line bk" onClick={() => setStep(1)}>Back</button>
              <button type="button" className="btn btn-mark" onClick={() => validStep(2) && setStep(3)}>Next</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="qtext">Category and family income</div>
            <div className="qhelp">This decides which fee-waiver schemes are on the table.</div>
            <div className="f">
              <label className="fl" htmlFor="bptCat">Category</label>
              <select
                id="bptCat"
                value={category}
                onChange={(e) => { setCategory(e.target.value); setErr((s) => ({ ...s, category: false })); }}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              {err.category && <p className="er">Please select your category.</p>}
            </div>
            <div className="f" style={{ marginBottom: 0 }}>
              <span className="fl">Annual family income</span>
              <div className="choices">
                {INCOMES.map((i) => (
                  <label className="ch" key={i}>
                    <input
                      type="radio"
                      name="bpt-income"
                      value={i}
                      checked={income === i}
                      onChange={() => {
                        setIncome(i);
                        setErr((s) => ({ ...s, income: false }));
                        if (category) window.setTimeout(() => goResult(category, i), 260);
                      }}
                    />
                    <span>{i}</span>
                  </label>
                ))}
              </div>
              {err.income && <p className="er">Tap one to see your result.</p>}
            </div>
            <div className="qnav">
              <button type="button" className="btn btn-line bk" onClick={() => setStep(2)}>Back</button>
              <button type="button" className="btn btn-mark" onClick={() => validStep(3) && goResult()}>Show my result</button>
            </div>
          </div>
        )}

        {step === 4 && result && (
          <div>
            <div className="verdict">
              <div className="lbl">Your BPT admission options</div>
              <div className="val"><u>{result.verdict.label}</u>{result.verdict.title}</div>
              <p>{result.verdict.why}</p>
            </div>

            <div className="slist">
              <h4>
                {result.schemes.length} fee-waiver {result.schemes.length === 1 ? "scheme" : "schemes"} you may qualify for
              </h4>
              <ul>{result.schemes.map((s) => <li key={s}>{s}</li>)}</ul>
              <p className="hintx" style={{ marginTop: "12px" }}>
                Indicative. Every scheme has its own income limit, document set and MahaDBT deadline.
              </p>
            </div>

            <div className="keyline"><hr /><span>Next step</span><hr /></div>
            <p className="small" style={{ color: "#A7AEBB", marginBottom: "16px" }}>
              A counsellor can now build you a college shortlist with approved fee notifications, the
              round worth targeting, and your document checklist. Free, and no obligation to enrol
              anywhere.
            </p>

            <form onSubmit={onSubmit} noValidate>
              <div className="f">
                <input
                  type="text"
                  autoComplete="name"
                  placeholder="Student name"
                  aria-label="Student name"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErr((s) => ({ ...s, rname: false })); }}
                />
                {err.rname && <p className="er">Please enter the student&apos;s name.</p>}
              </div>
              <div className="f">
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  autoComplete="tel"
                  placeholder="10-digit mobile number"
                  aria-label="Mobile number"
                  value={mobile}
                  onChange={(e) => { setMobile(e.target.value.replace(/\D/g, "").slice(0, 10)); setErr((s) => ({ ...s, rmobile: false })); }}
                />
                {err.rmobile && <p className="er">Enter a valid 10-digit Indian mobile number.</p>}
              </div>
              <div className="f">
                <div className="consent-l">
                  <input
                    type="checkbox"
                    id="bptRConsent"
                    checked={consent}
                    onChange={(e) => { setConsent(e.target.checked); setErr((s) => ({ ...s, rconsent: false })); }}
                  />
                  <label htmlFor="bptRConsent">
                    I allow ABS Educational Solution to contact me by phone, SMS and WhatsApp about
                    admissions. I can withdraw this any time.
                  </label>
                </div>
                {err.rconsent && <p className="er">Please tick this so we can call you.</p>}
              </div>
              <button type="submit" className="btn btn-mark btn-full" disabled={loading}>
                {loading ? "Sending…" : "Get my college shortlist"}
              </button>
              <p className="hintx" style={{ textAlign: "center", marginTop: "12px" }}>
                One counsellor, one call. We don&apos;t sell your details.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
