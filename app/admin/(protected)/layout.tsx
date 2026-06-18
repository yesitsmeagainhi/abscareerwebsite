import Link from "next/link";

import { requireAdmin } from "@/lib/auth";
import { dbConfigured } from "@/lib/db";
import { logoutAction } from "@/app/admin/actions";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/courses", label: "Courses" },
  { href: "/admin/branches", label: "Branches" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/leads", label: "Leads" },
];

export const metadata = { title: "Admin", robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="font-bold text-brand">
              ABS Admin
            </Link>
            <nav className="hidden gap-4 text-sm sm:flex">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="text-gray-600 hover:text-brand">
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="text-sm text-gray-500 hover:text-brand">
              View site ↗
            </Link>
            <form action={logoutAction}>
              <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100">
                Log out
              </button>
            </form>
          </div>
        </div>
        {/* mobile nav */}
        <nav className="flex gap-4 overflow-x-auto border-t border-gray-100 px-4 py-2 text-sm sm:hidden">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="whitespace-nowrap text-gray-600">
              {n.label}
            </Link>
          ))}
        </nav>
      </header>

      {!dbConfigured && (
        <div className="bg-amber-50 px-4 py-3 text-center text-sm text-amber-800">
          ⚠ Database not connected. Set <code>DB_*</code> in your environment and run{" "}
          <code>npm run db:init</code> to manage and save content.
        </div>
      )}

      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
