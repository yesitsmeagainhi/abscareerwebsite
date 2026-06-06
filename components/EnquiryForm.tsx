"use client";

import { useState } from "react";

type Props = {
  courses?: string[];
  defaultCourse?: string;
  /** Compact variant for the hero; full variant for dedicated sections. */
  variant?: "default" | "compact";
};

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-brand focus:ring-1 focus:ring-brand";

export default function EnquiryForm({ courses = [], defaultCourse, variant = "default" }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, sourcePage: window.location.pathname }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Something went wrong. Please try again.");
      }
      setStatus("ok");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
        <p className="text-lg font-semibold text-green-800">Thank you! 🎉</p>
        <p className="mt-1 text-sm text-green-700">
          Your enquiry has been received. Our admission counsellor will call you shortly.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-medium text-brand underline"
        >
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {/* Honeypot — hidden from users, bots tend to fill it. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px]"
        aria-hidden="true"
      />

      <div className={variant === "default" ? "grid gap-3 sm:grid-cols-2" : "space-y-3"}>
        <input name="name" required placeholder="Your name *" className={inputClass} />
        <input
          name="phone"
          required
          type="tel"
          inputMode="tel"
          placeholder="Phone number *"
          className={inputClass}
        />
      </div>

      <div className={variant === "default" ? "grid gap-3 sm:grid-cols-2" : "space-y-3"}>
        <input name="email" type="email" placeholder="Email (optional)" className={inputClass} />
        <input name="city" placeholder="Your city" className={inputClass} />
      </div>

      <select name="course" defaultValue={defaultCourse || ""} className={inputClass}>
        <option value="">Course you&apos;re interested in</option>
        {courses.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
        <option value="Other / Not sure">Other / Not sure</option>
      </select>

      {status === "error" && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-lg bg-brand px-4 py-3 font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
      >
        {status === "loading" ? "Submitting…" : "Get Free Admission Guidance"}
      </button>
      <p className="text-center text-xs text-gray-500">
        We respect your privacy. Your details are only used to contact you about admissions.
      </p>
    </form>
  );
}
