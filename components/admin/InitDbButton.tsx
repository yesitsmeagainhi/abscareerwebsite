"use client";

import { useState } from "react";

export default function InitDbButton() {
  const [status, setStatus] = useState("");
  const [ok, setOk] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!confirm("Create the database tables and seed the initial content? (Safe to run again.)"))
      return;
    setLoading(true);
    setStatus("");
    setOk(null);
    try {
      const res = await fetch("/api/admin/init-db", { method: "POST" });
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
        className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
      >
        {loading ? "Setting up…" : "Initialize / seed database"}
      </button>
      {status && (
        <p className={`mt-2 text-sm ${ok ? "text-green-700" : "text-red-600"}`}>{status}</p>
      )}
    </div>
  );
}
