import Link from "next/link";
import { notFound } from "next/navigation";

import { ListField, TextArea, TextInput } from "@/components/admin/AdminFields";
import { dbConfigured, getBranchById } from "@/lib/admin-content";
import { saveBranchAction } from "@/app/admin/actions";

export default async function EditBranch({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const isNew = id === "new";

  if (!dbConfigured) {
    return (
      <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
        Connect the database to edit branches.
      </p>
    );
  }

  const branch = isNew ? null : await getBranchById(Number(id));
  if (!isNew && !branch) notFound();

  const faqText = (branch?.faqs || []).map((f) => `${f.question} :: ${f.answer}`).join("\n");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? "New branch" : `Edit: ${branch?.name}`}
        </h1>
        <Link href="/admin/branches" className="text-sm text-gray-500 hover:text-brand">
          ← Back
        </Link>
      </div>

      {error === "required" && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          Name and slug are required.
        </p>
      )}

      <form action={saveBranchAction} className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
        <input type="hidden" name="id" value={isNew ? "new" : id} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput name="name" label="Branch name" defaultValue={branch?.name} required
            hint="e.g. Andheri" />
          <TextInput name="slug" label="Slug" defaultValue={branch?.slug} required hint="e.g. andheri" />
          <TextInput name="area" label="Area / landmark" defaultValue={branch?.area}
            hint="e.g. near Andheri station" />
          <TextInput name="phone" label="Phone" defaultValue={branch?.phone} />
          <TextInput name="postalCode" label="Pincode" defaultValue={branch?.postalCode} />
          <TextInput name="order" label="Sort order" defaultValue={String(branch?.order ?? 100)} type="number" />
        </div>
        <TextArea name="address" label="Full address" defaultValue={branch?.address} rows={2} />
        <TextInput name="mapsUrl" label="Google Maps link (Get directions button)" defaultValue={branch?.mapsUrl} />
        <TextInput name="mapEmbedUrl" label="Google Maps embed URL (iframe)" defaultValue={branch?.mapEmbedUrl} />

        <TextArea name="intro" label="Intro (unique 1-2 lines about this branch/area)"
          defaultValue={branch?.intro} rows={3} />
        <ListField name="localities" label="Areas served (nearby localities)"
          defaultValue={branch?.localities} />
        <TextArea name="transport" label="How to reach (nearest station / landmark)"
          defaultValue={branch?.transport} rows={2} />
        <TextArea name="faqs" label="Branch FAQs" defaultValue={faqText} rows={5}
          hint="One per line, format:  Question :: Answer" />

        <div className="flex gap-3 pt-2">
          <button className="rounded-lg bg-brand px-6 py-2.5 font-semibold text-white hover:bg-brand-dark">
            Save branch
          </button>
          <Link href="/admin/branches" className="rounded-lg border border-gray-300 px-6 py-2.5 font-semibold text-gray-700 hover:bg-gray-100">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
