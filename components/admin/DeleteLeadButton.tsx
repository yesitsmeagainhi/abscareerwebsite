"use client";

import { deleteLeadAction } from "@/app/admin/actions";

// Small delete button for a lead row. Confirms before removing.
export default function DeleteLeadButton({ id, name }: { id: number; name: string }) {
  return (
    <form
      action={deleteLeadAction}
      onSubmit={(e) => {
        if (!confirm(`Delete lead "${name || "this lead"}"? This can't be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
        title="Delete lead"
      >
        Delete
      </button>
    </form>
  );
}
