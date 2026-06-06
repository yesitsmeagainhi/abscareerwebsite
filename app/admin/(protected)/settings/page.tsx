import { TextArea, TextInput } from "@/components/admin/AdminFields";
import { dbConfigured } from "@/lib/db";
import { getSiteSettings } from "@/lib/content";
import { saveSettingsAction } from "@/app/admin/actions";

export default async function AdminSettings({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const s = await getSiteSettings();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Site settings</h1>
      {!dbConfigured && (
        <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          Showing seed values. Connect the database to save changes.
        </p>
      )}
      {saved && (
        <p className="mt-3 rounded-lg bg-green-50 p-3 text-sm text-green-700">Settings saved.</p>
      )}

      <form action={saveSettingsAction} className="mt-6 space-y-4 rounded-xl border border-gray-200 bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput name="orgName" label="Organisation name" defaultValue={s.orgName} required />
          <TextInput name="tagline" label="Tagline" defaultValue={s.tagline} />
          <TextInput name="domain" label="Domain" defaultValue={s.domain} />
          <TextInput name="foundingYear" label="Founding year" defaultValue={s.foundingYear} />
          <TextInput name="phone" label="Phone" defaultValue={s.phone} />
          <TextInput name="whatsappNumber" label="WhatsApp number (digits only)" defaultValue={s.whatsappNumber} />
          <TextInput name="email" label="Email" defaultValue={s.email} />
        </div>
        <TextArea name="description" label="Description" defaultValue={s.description} rows={3} />
        <TextArea name="address" label="Address" defaultValue={s.address} rows={2} />
        <TextInput name="mapEmbedUrl" label="Google Maps embed URL" defaultValue={s.mapEmbedUrl} />
        <div className="grid gap-4 sm:grid-cols-3">
          <TextInput name="facebook" label="Facebook URL" defaultValue={s.socials?.facebook} />
          <TextInput name="instagram" label="Instagram URL" defaultValue={s.socials?.instagram} />
          <TextInput name="youtube" label="YouTube URL" defaultValue={s.socials?.youtube} />
        </div>
        <input type="hidden" name="logo" value={s.logo || ""} />

        <button className="rounded-lg bg-brand px-6 py-2.5 font-semibold text-white hover:bg-brand-dark">
          Save settings
        </button>
      </form>
    </div>
  );
}
