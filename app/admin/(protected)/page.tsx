import Link from "next/link";

import { dbConfigured } from "@/lib/db";
import { getBranches, getCourses } from "@/lib/content";

export default async function AdminDashboard() {
  const [courses, branches] = await Promise.all([getCourses(), getBranches()]);

  const cards = [
    { href: "/admin/courses", label: "Courses", count: courses.length },
    { href: "/admin/branches", label: "Branches", count: branches.length },
    { href: "/admin/settings", label: "Site settings", count: null },
    { href: "/admin/leads", label: "Leads", count: null },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">
        Manage your website content and view enquiries.
        {!dbConfigured && " (Showing seed content — connect the database to edit.)"}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-brand hover:shadow-sm"
          >
            <div className="text-sm text-gray-500">{c.label}</div>
            {c.count !== null && (
              <div className="mt-1 text-3xl font-bold text-gray-900">{c.count}</div>
            )}
            <div className="mt-3 text-sm font-semibold text-brand">Manage →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
