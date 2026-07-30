"use client";

import { useEffect, useRef } from "react";

import { track } from "@/lib/track";

// Fires a single page_view for the LP (per mount). Rendered on the landing page.
export default function LpTracker({ page }: { page?: string }) {
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    track("page_view", { page });
  }, [page]);
  return null;
}
