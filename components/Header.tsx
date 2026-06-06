"use client";

import Link from "next/link";
import { useState } from "react";

import { NAV_LINKS } from "@/lib/site";
import ScholarshipModal from "@/components/ScholarshipModal";

export default function Header({ phone }: { phone?: string }) {
  const [open, setOpen] = useState(false);
  const [scholarshipOpen, setScholarshipOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand font-bold text-white">
            ABS
          </span>
          <span className="text-sm font-semibold leading-tight text-gray-900">
            ABS Educational
            <br />
            <span className="text-xs font-normal text-gray-500">Solution</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-gray-700 transition hover:text-brand"
            >
              {l.label}
            </Link>
          ))}
          {phone && (
            <div className="flex flex-col items-stretch gap-1.5">
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="rounded-lg bg-brand px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-brand-dark"
              >
                Call {phone}
              </a>
              <button
                onClick={() => setScholarshipOpen(true)}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                🎓 Get Scholarship
              </button>
            </div>
          )}
          {!phone && (
            <button
              onClick={() => setScholarshipOpen(true)}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              🎓 Get Scholarship
            </button>
          )}
        </nav>

        <button
          aria-label="Toggle menu"
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <div className="space-y-1.5">
            <span className="block h-0.5 w-6 bg-gray-900" />
            <span className="block h-0.5 w-6 bg-gray-900" />
            <span className="block h-0.5 w-6 bg-gray-900" />
          </div>
        </button>
      </div>

      {open && (
        <nav className="border-t border-gray-100 bg-white px-4 py-3 md:hidden">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm font-medium text-gray-700"
            >
              {l.label}
            </Link>
          ))}
          {phone && (
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="mt-2 block rounded-lg bg-brand px-4 py-2 text-center text-sm font-semibold text-white"
            >
              Call {phone}
            </a>
          )}
          <button
            onClick={() => {
              setScholarshipOpen(true);
              setOpen(false);
            }}
            className="mt-2 block w-full rounded-lg bg-accent px-4 py-2 text-center text-sm font-semibold text-white"
          >
            🎓 Get Scholarship
          </button>
        </nav>
      )}

      <ScholarshipModal open={scholarshipOpen} onClose={() => setScholarshipOpen(false)} />
    </header>
  );
}
