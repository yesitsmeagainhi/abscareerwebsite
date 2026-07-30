"use client";

import type { AnchorHTMLAttributes } from "react";

import { track } from "@/lib/track";

// A plain anchor that fires a GA4 event on click before navigating. Used for
// the Call and WhatsApp buttons so their clicks show up in GA4 (and can be
// imported into Google Ads as conversions). gtag sends via sendBeacon, so the
// event survives the tel:/wa.me navigation.
type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: string;
  eventParams?: Record<string, unknown>;
};

export default function TrackedLink({ event, eventParams, children, onClick, ...rest }: Props) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        try {
          (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", event, {
            page: "gnm-nursing-mumbai",
            ...eventParams,
          });
        } catch {
          /* gtag not loaded — navigation still proceeds */
        }
        // First-party analytics (admin dashboard).
        const loc = (eventParams as { location?: string } | undefined)?.location;
        track(event, { location: loc });
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
