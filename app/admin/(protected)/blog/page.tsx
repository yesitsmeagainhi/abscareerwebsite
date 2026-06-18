import Link from "next/link";

import { dbConfigured, listBlogAdmin } from "@/lib/admin-content";
import { deleteBlogAction } from "@/app/admin/actions";

export default async function AdminBlog() {
  const posts = dbConfigured ? await listBlogAdmin() : [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
        <Link
          href="/admin/blog/new"
          className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          + New post
        </Link>
      </div>

      {!dbConfigured ? (
        <p className="mt-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
          Connect the database (and run <code>npm run db:init</code>) to manage blog posts.
        </p>
      ) : posts.length === 0 ? (
        <p className="mt-6 text-sm text-gray-500">No posts yet. Write your first one.</p>
      ) : (
        <div className="mt-6 divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
          {posts.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-4 p-4">
              <div>
                <div className="font-medium text-gray-900">{p.title}</div>
                <div className="text-xs text-gray-500">
                  /blog/{p.slug} · {p.datePublished}
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Link
                  href={`/blog/${p.slug}`}
                  target="_blank"
                  className="text-gray-400 hover:text-brand"
                >
                  View
                </Link>
                <Link href={`/admin/blog/${p.id}`} className="font-semibold text-brand">
                  Edit
                </Link>
                <form action={deleteBlogAction}>
                  <input type="hidden" name="id" value={p.id} />
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
