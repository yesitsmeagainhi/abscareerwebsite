import Link from "next/link";

import type { SiteSettings } from "@/lib/types";
import { NAV_LINKS } from "@/lib/site";

export default function Footer({ settings }: { settings: SiteSettings }) {
  const year = 2026; // build-time constant; update yearly or wire to settings
  return (
    <footer className="mt-16 border-t border-gray-100 bg-gray-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-6">
        <div className="sm:col-span-2 md:col-span-1">
          <div className="mb-3 flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-sm font-bold text-white">
              ABS
            </span>
            <span className="font-semibold text-gray-900">{settings.orgName}</span>
          </div>
          <p className="text-sm text-gray-600">{settings.tagline}</p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">Quick links</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-brand">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">Popular courses</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link href="/d-pharma-admission-2026" className="hover:text-brand">D.Pharm Admission 2026</Link></li>
            <li><Link href="/b-pharma-admission-2026" className="hover:text-brand">B.Pharm Admission 2026</Link></li>
            <li><Link href="/gnm-nursing-admission-2026" className="hover:text-brand">GNM Nursing 2026</Link></li>
            <li><Link href="/bsc-nursing-admission-2026" className="hover:text-brand">B.Sc Nursing 2026</Link></li>
            <li><Link href="/blog" className="hover:text-brand">Admission Blog</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">Admission by area</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link href="/d-pharma-admission-thane" className="hover:text-brand">D.Pharm in Thane</Link></li>
            <li><Link href="/d-pharma-admission-andheri" className="hover:text-brand">D.Pharm in Andheri</Link></li>
            <li><Link href="/gnm-nursing-admission-kurla" className="hover:text-brand">GNM in Kurla</Link></li>
            <li><Link href="/b-pharma-admission-malad" className="hover:text-brand">B.Pharm in Malad</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">Branches</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link href="/branches/thane" className="hover:text-brand">Thane</Link></li>
            <li><Link href="/branches/andheri" className="hover:text-brand">Andheri</Link></li>
            <li><Link href="/branches/kurla" className="hover:text-brand">Kurla</Link></li>
            <li><Link href="/branches/malad" className="hover:text-brand">Malad</Link></li>
            <li><Link href="/branches" className="hover:text-brand">All 6 branches →</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">Contact</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            {settings.phone && (
              <li>
                <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-brand">
                  {settings.phone}
                </a>
              </li>
            )}
            {settings.email && (
              <li>
                <a href={`mailto:${settings.email}`} className="hover:text-brand">
                  {settings.email}
                </a>
              </li>
            )}
            {settings.address && <li>{settings.address}</li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-100 py-4 text-center text-xs text-gray-500">
        © {year} {settings.orgName}. All rights reserved.
      </div>
    </footer>
  );
}
