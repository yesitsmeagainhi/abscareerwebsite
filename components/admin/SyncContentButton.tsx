"use client";

import { useState } from "react";

// Force-publishes the built-in seed content into the database, overwriting the
// course/branch rows. Use after the seed content (lib/fallback.ts) is edited.
export default function SyncContentButton() {
  const [status, setStatus] = useState("");
  const [ok, setOk] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    if (
      !confirm(
        "Publish the latest course/branch content to the live site? This overwrites the current course and branch pages in the database.",
      )
    )
      return;
    setLoading(true);
    setStatus("");
    setOk(null);
    try {
      const res = await fetch("/api/admin/sync-content", { method: "POST" });
      const body = await res.json().catch(() => ({}));
      setOk(res.ok && body.ok);
      setStatus(body.message || (res.ok ? "Done." : "Failed."));
    } catch {
      setOk(false);
      setStatus("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={run}
        disabled={loading}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Publishing…" : "Publish latest content"}
      </button>
      {status && (
        <p className={`mt-2 text-sm ${ok ? "text-green-700" : "text-red-600"}`}>{status}</p>
      )}
    </div>
  );
}
