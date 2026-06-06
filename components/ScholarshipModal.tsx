"use client";

import { useState } from "react";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand";

const CATEGORIES = ["Open / General", "OBC", "SC", "ST", "VJ / NT", "SBC", "EWS", "Minority", "Other"];

type Stage = 1 | 2 | "done";

export default function ScholarshipModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [stage, setStage] = useState<Stage>(1);
  const [leadId, setLeadId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function reset() {
    setStage(1);
    setLeadId(null);
    setError("");
    setLoading(false);
  }
  function close() {
    onClose();
    // reset after the close animation/blur
    setTimeout(reset, 200);
  }

  // Step 1 — capture name + phone immediately (secures the lead).
  async function submitStep1(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/scholarship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || "Something went wrong. Please try again.");
      setLeadId(typeof body.id === "number" ? body.id : null);
      setStage(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  // Step 2 — optional details, attached to the step-1 lead.
  async function submitStep2(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      if (leadId) {
        await fetch("/api/scholarship", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: leadId, ...data }),
        });
      }
    } catch {
      // non-fatal — the lead is already saved from step 1
    } finally {
      setLoading(false);
      setStage("done");
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      onClick={close}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700"
        >
          ✕
        </button>

        {stage !== "done" && (
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">🎓 Get Scholarship</h2>
            <p className="mt-1 text-sm text-gray-500">
              Step {stage} of 2 — {stage === 1 ? "your details" : "a few more details (optional)"}
            </p>
            <div className="mt-3 flex gap-1.5">
              <span className="h-1.5 flex-1 rounded-full bg-brand" />
              <span className={`h-1.5 flex-1 rounded-full ${stage === 2 ? "bg-brand" : "bg-gray-200"}`} />
            </div>
          </div>
        )}

        {stage === 1 && (
          <form onSubmit={submitStep1} className="space-y-3">
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px]"
            />
            <input name="name" required placeholder="Your name *" className={inputClass} />
            <input
              name="phone"
              required
              type="tel"
              inputMode="tel"
              placeholder="Mobile number *"
              className={inputClass}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-brand px-4 py-3 font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
            >
              {loading ? "Please wait…" : "Continue →"}
            </button>
            <p className="text-center text-xs text-gray-500">
              We&apos;ll call you about scholarship options. Your details stay private.
            </p>
          </form>
        )}

        {stage === 2 && (
          <form onSubmit={submitStep2} className="space-y-3">
            <input name="caste" placeholder="Caste (optional)" className={inputClass} />
            <select name="category" defaultValue="" className={inputClass}>
              <option value="">Category (optional)</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              name="percentage12"
              placeholder="12th percentage (optional)"
              inputMode="decimal"
              className={inputClass}
            />
            <input name="location" placeholder="Your location / city (optional)" className={inputClass} />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-brand px-4 py-3 font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
            >
              {loading ? "Submitting…" : "Submit"}
            </button>
            <button
              type="button"
              onClick={() => setStage("done")}
              className="w-full text-center text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Skip — I&apos;ll share later
            </button>
          </form>
        )}

        {stage === "done" && (
          <div className="py-4 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-3xl">
              🎉
            </div>
            <h2 className="text-xl font-bold text-gray-900">Thank you!</h2>
            <p className="mt-2 text-sm text-gray-600">
              Our scholarship team will call you soon to guide you on available scholarships and
              admission.
            </p>
            <button
              onClick={close}
              className="mt-5 rounded-lg bg-brand px-6 py-2.5 font-semibold text-white hover:bg-brand-dark"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
