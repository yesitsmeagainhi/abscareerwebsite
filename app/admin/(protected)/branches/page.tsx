import Link from "next/link";

import { dbConfigured, listBranchesAdmin } from "@/lib/admin-content";
import { deleteBranchAction } from "@/app/admin/actions";

export default async function AdminBranches() {
  const branches = dbConfigured ? await listBranchesAdmin() : [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Branches</h1>
        <Link
          href="/admin/branches/new"
          className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          + New branch
        </Link>
      </div>

      {!dbConfigured ? (
        <p className="mt-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
          Connect the database (and run <code>npm run db:init</code>) to manage branches.
        </p>
      ) : branches.length === 0 ? (
        <p className="mt-6 text-sm text-gray-500">No branches yet.</p>
      ) : (
        <div className="mt-6 divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
          {branches.map((b) => (
            <div key={b.id} className="flex items-center justify-between gap-4 p-4">
              <div>
                <div className="font-medium text-gray-900">{b.name}</div>
                <div className="text-xs text-gray-500">/branches/{b.slug}</div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Link href={`/branches/${b.slug}`} target="_blank" className="text-gray-400 hover:text-brand">
                  View
                </Link>
                <Link href={`/admin/branches/${b.id}`} className="font-semibold text-brand">
                  Edit
                </Link>
                <form action={deleteBranchAction}>
                  <input type="hidden" name="id" value={b.id} />
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
