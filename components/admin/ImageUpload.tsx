"use client";

import { useState } from "react";

// Uploads to /api/admin/upload and stores the returned path in a hidden input
// so it submits with the form.
export default function ImageUpload({ name, initial }: { name: string; initial?: string }) {
  const [path, setPath] = useState(initial || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Upload failed");
      setPath(json.path);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="block">
      <span className="text-sm font-medium text-gray-700">Hero image</span>
      <input type="hidden" name={name} value={path} />
      <div className="mt-1 flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {path && <img src={path} alt="preview" className="h-16 w-24 rounded object-cover border" />}
        <input type="file" accept="image/*" onChange={onChange} className="text-sm" />
        {busy && <span className="text-sm text-gray-500">Uploading…</span>}
      </div>
      {path && (
        <button
          type="button"
          onClick={() => setPath("")}
          className="mt-1 text-xs text-red-500 underline"
        >
          Remove image
        </button>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
