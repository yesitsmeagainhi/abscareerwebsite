"use client";

import { useSearchParams } from "next/navigation";

import { track } from "@/lib/track";

import { PAGE, fireGtag } from "./lead";

export type LpBranch = {
  slug: string;
  name: string;
  address: string;
  mapsUrl?: string;
  phone: string;
  timing: string;
};

// Branch routing: ?branch=bhayandar | nalasopara marks the matching card as the
// nearest one. The card is pulled to the front with CSS `order`, so no DOM
// reshuffling is needed. Rendered inside a Suspense boundary whose fallback is
// the same list with the default branch highlighted, keeping the page static.
export function BranchList({ branches, active }: { branches: LpBranch[]; active: string }) {
  return (
    <div className="abs-br">
      {branches.map((b) => (
        <div key={b.slug} className={`abs-br-card${b.slug === active ? " is-near" : ""}`}>
          <span className="abs-br-tag">Nearest to you</span>
          <h3>{b.name}</h3>
          <address>{b.address}</address>
          <div className="abs-br-links">
            <a
              className="is-p"
              href={`tel:${b.phone.replace(/\s/g, "")}`}
              onClick={() => { fireGtag("call_click", { location: `branch-${b.slug}` }); track("call_click", { page: PAGE, location: `branch-${b.slug}` }); }}
            >
              Call branch
            </a>
            {b.mapsUrl && (
              <a href={b.mapsUrl} target="_blank" rel="noopener noreferrer">Open in Maps</a>
            )}
          </div>
          <p className="abs-br-time">{b.timing}</p>
        </div>
      ))}
    </div>
  );
}

export default function BranchCards({
  branches,
  defaultBranch,
}: {
  branches: LpBranch[];
  defaultBranch: string;
}) {
  const params = useSearchParams();
  const asked = (params.get("branch") || "").toLowerCase();
  const active = branches.some((b) => b.slug === asked) ? asked : defaultBranch;
  return <BranchList branches={branches} active={active} />;
}
