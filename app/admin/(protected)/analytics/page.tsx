import Link from "next/link";

import { dbConfigured } from "@/lib/db";
import { getLpStats } from "@/lib/analytics";

export const dynamic = "force-dynamic";

const LPS = [
  { slug: "gnm-nursing-mumbai", label: "GNM Nursing" },
  { slug: "bsc-nursing-mumbai", label: "BSc Nursing" },
];

function pct(n: number, d: number): string {
  if (!d) return "0%";
  return `${((n / d) * 100).toFixed(1)}%`;
}

const EVENT_LABEL: Record<string, string> = {
  page_view: "Page view",
  call_click: "Call click",
  whatsapp_click: "WhatsApp click",
  form_submit: "Form submit",
};

export default async function AdminAnalytics({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const current = LPS.find((l) => l.slug === page) || LPS[0];
  const stats = dbConfigured ? await getLpStats(current.slug, 30) : null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">LP Analytics</h1>
      <p className="mt-1 text-sm text-gray-500">
        Landing-page visitors and actions, tracked first-party.
      </p>

      <div className="mt-4 flex gap-2">
        {LPS.map((l) => (
          <Link
            key={l.slug}
            href={`/admin/analytics?page=${l.slug}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              l.slug === current.slug
                ? "bg-brand text-white"
                : "border border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>
      <p className="mt-3 text-xs text-gray-400">
        Showing <code>/lp/{current.slug}</code>
      </p>

      {!stats ? (
        <p className="mt-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
          Connect the database to see analytics.
        </p>
      ) : stats.totals.pageViews === 0 &&
        stats.totals.callClicks === 0 &&
        stats.totals.formSubmits === 0 ? (
        <p className="mt-6 text-sm text-gray-500">
          No activity yet. Data appears here as soon as visitors hit the landing page.
        </p>
      ) : (
        <>
          {/* KPI cards */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {[
              { label: "Unique visitors", value: stats.totals.visitors, hint: "" },
              { label: "Page views", value: stats.totals.pageViews, hint: "" },
              {
                label: "Form submits",
                value: stats.totals.formSubmits,
                hint: `${pct(stats.totals.formSubmits, stats.totals.visitors)} of visitors`,
                accent: true,
              },
              { label: "Call clicks", value: stats.totals.callClicks, hint: "" },
              { label: "WhatsApp clicks", value: stats.totals.whatsappClicks, hint: "" },
            ].map((c) => (
              <div
                key={c.label}
                className={`rounded-xl border p-4 ${
                  c.accent ? "border-brand/30 bg-brand-light" : "border-gray-200 bg-white"
                }`}
              >
                <div className="text-2xl font-bold text-gray-900">{c.value}</div>
                <div className="mt-1 text-xs font-medium text-gray-600">{c.label}</div>
                {c.hint && <div className="mt-0.5 text-[11px] text-gray-500">{c.hint}</div>}
              </div>
            ))}
          </div>

          {/* Total actions (leads + calls + whatsapp) */}
          <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
            <span className="font-semibold text-gray-900">
              {stats.totals.formSubmits + stats.totals.callClicks + stats.totals.whatsappClicks}
            </span>{" "}
            total actions from{" "}
            <span className="font-semibold text-gray-900">{stats.totals.visitors}</span> visitors —
            overall action rate{" "}
            <span className="font-semibold text-gray-900">
              {pct(
                stats.totals.formSubmits + stats.totals.callClicks + stats.totals.whatsappClicks,
                stats.totals.visitors,
              )}
            </span>
            .
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Where they clicked */}
            <section>
              <h2 className="text-lg font-bold text-gray-900">Where they clicked</h2>
              {stats.byLocation.length === 0 ? (
                <p className="mt-2 text-sm text-gray-500">No call/WhatsApp clicks yet.</p>
              ) : (
                <table className="mt-3 w-full overflow-hidden rounded-xl border border-gray-200 text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-4 py-2 text-left">Action</th>
                      <th className="px-4 py-2 text-left">Where on page</th>
                      <th className="px-4 py-2 text-right">Clicks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {stats.byLocation.map((r, i) => (
                      <tr key={i} className="bg-white">
                        <td className="px-4 py-2">
                          {r.event === "call_click" ? "📞 Call" : "💬 WhatsApp"}
                        </td>
                        <td className="px-4 py-2 capitalize text-gray-700">{r.location}</td>
                        <td className="px-4 py-2 text-right font-semibold text-gray-900">
                          {r.count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>

            {/* Recent activity */}
            <section>
              <h2 className="text-lg font-bold text-gray-900">Recent activity</h2>
              {stats.recent.length === 0 ? (
                <p className="mt-2 text-sm text-gray-500">Nothing yet.</p>
              ) : (
                <ul className="mt-3 divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white text-sm">
                  {stats.recent.map((r, i) => (
                    <li key={i} className="flex items-center justify-between px-4 py-2">
                      <span className="text-gray-800">
                        {EVENT_LABEL[r.event] || r.event}
                        {r.location ? <span className="text-gray-400"> · {r.location}</span> : null}
                      </span>
                      <span className="text-xs text-gray-400">
                        {r.createdAt ? r.createdAt.slice(0, 16).replace("T", " ") : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {/* Daily breakdown */}
          <section className="mt-6">
            <h2 className="text-lg font-bold text-gray-900">Last 30 days</h2>
            <div className="mt-3 overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-2">Day</th>
                    <th className="px-4 py-2 text-right">Views</th>
                    <th className="px-4 py-2 text-right">📞 Calls</th>
                    <th className="px-4 py-2 text-right">💬 WhatsApp</th>
                    <th className="px-4 py-2 text-right">✅ Forms</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.daily.map((d) => (
                    <tr key={d.day}>
                      <td className="px-4 py-2 text-gray-700">{d.day}</td>
                      <td className="px-4 py-2 text-right text-gray-700">{d.pageViews}</td>
                      <td className="px-4 py-2 text-right text-gray-700">{d.callClicks}</td>
                      <td className="px-4 py-2 text-right text-gray-700">{d.whatsappClicks}</td>
                      <td className="px-4 py-2 text-right font-semibold text-brand">{d.formSubmits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
