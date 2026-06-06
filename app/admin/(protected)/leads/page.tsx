import { dbConfigured, listLeads } from "@/lib/admin-content";

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
                <th className="px-4 py-3">Scholarship details</th>
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
                    <td className="px-4 py-3 text-gray-500">{details || "-"}</td>
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
