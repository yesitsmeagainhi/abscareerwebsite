"use client";

import type { AnchorHTMLAttributes } from "react";

import { track } from "@/lib/track";

// Anchor that fires a GA4 + first-party event on click before navigating.
// `page` scopes the event to a specific landing page.
type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: string;
  page: string;
  location?: string;
};

export default function TrackedLink({ event, page, location, children, onClick, ...rest }: Props) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        try {
          (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", event, {
            page,
            location,
          });
        } catch {
          /* ignore */
        }
        track(event, { page, location });
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
