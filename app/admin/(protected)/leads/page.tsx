import DeleteLeadButton from "@/components/admin/DeleteLeadButton";
import { dbConfigured, listLeads } from "@/lib/admin-content";

// Which landing page a lead came from, and whether via the form or the popup.
const LP_LABELS: Record<string, string> = {
  "gnm-nursing-mumbai": "GNM Nursing",
  "bsc-nursing-admission-mumbai": "BSc Nursing",
  "bsc-nursing-mumbai": "BSc Nursing", // legacy slug (pre-rename leads)
};

function leadSource(sourcePage?: string): { lp: string; channel: "Form" | "Popup" | null } {
  if (!sourcePage) return { lp: "Website", channel: null };
  const channel: "Form" | "Popup" | null = sourcePage.includes("#popup") ? "Popup" : "Form";
  const m = sourcePage.match(/\/lp\/([a-z0-9-]+)/i);
  if (m) return { lp: LP_LABELS[m[1]] || m[1], channel };
  return { lp: "Website", channel: null };
}

export default async function AdminLeads() {
  const leads = dbConfigured ? await listLeads() : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
      <p className="mt-1 text-sm text-gray-500">Enquiries submitted through the website.</p>

      {!dbConfigured ? (
        <p className="mt-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
          Connect the database to view leads.
        </p>
      ) : leads.length === 0 ? (
        <p className="mt-6 text-sm text-gray-500">No leads yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Scholarship details</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map((l) => {
                const scholarship = l.type === "scholarship";
                const details = [
                  l.caste && `Caste: ${l.caste}`,
                  l.category && `Cat: ${l.category}`,
                  l.percentage12 && `12th: ${l.percentage12}`,
                ]
                  .filter(Boolean)
                  .join(" · ");
                return (
                  <tr key={l.id} className={scholarship ? "bg-green-50/40" : ""}>
                    <td className="px-4 py-3 text-gray-500">
                      {l.createdAt ? l.createdAt.slice(0, 16).replace("T", " ") : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          scholarship ? "bg-accent/10 text-accent" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {scholarship ? "Scholarship" : "Enquiry"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{l.name}</td>
                    <td className="px-4 py-3">
                      <a href={`tel:${l.phone}`} className="text-brand">
                        {l.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{l.course || "-"}</td>
                    <td className="px-4 py-3 text-gray-700">{l.city || "-"}</td>
                    <td className="px-4 py-3">
                      {(() => {
                        const s = leadSource(l.sourcePage);
                        return (
                          <span className="inline-flex items-center gap-1.5">
                            <span className="font-medium text-gray-800">{s.lp}</span>
                            {s.channel && (
                              <span
                                className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                  s.channel === "Popup"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {s.channel}
                              </span>
                            )}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{details || "-"}</td>
                    <td className="px-4 py-3 text-right">
                      <DeleteLeadButton id={l.id!} name={l.name} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
