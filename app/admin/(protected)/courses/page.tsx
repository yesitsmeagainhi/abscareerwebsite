import Link from "next/link";

import { dbConfigured, listCoursesAdmin } from "@/lib/admin-content";
import { deleteCourseAction } from "@/app/admin/actions";

export default async function AdminCourses() {
  const courses = dbConfigured ? await listCoursesAdmin() : [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
        <Link
          href="/admin/courses/new"
          className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          + New course
        </Link>
      </div>

      {!dbConfigured ? (
        <p className="mt-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
          Connect the database (and run <code>npm run db:init</code>) to manage courses.
        </p>
      ) : courses.length === 0 ? (
        <p className="mt-6 text-sm text-gray-500">No courses yet. Create your first one.</p>
      ) : (
        <div className="mt-6 divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
          {courses.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-4 p-4">
              <div>
                <div className="font-medium text-gray-900">{c.title}</div>
                <div className="text-xs text-gray-500">/{c.slug}</div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Link href={`/${c.slug}`} target="_blank" className="text-gray-400 hover:text-brand">
                  View
                </Link>
                <Link href={`/admin/courses/${c.id}`} className="font-semibold text-brand">
                  Edit
                </Link>
                <form action={deleteCourseAction}>
                  <input type="hidden" name="id" value={c.id} />
                  <button className="text-red-500 hover:underline">Delete</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
