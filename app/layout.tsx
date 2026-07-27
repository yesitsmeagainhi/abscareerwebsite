import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import { SITE_URL } from "@/lib/site";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// GA4 Google tag — loaded on every page. Configurable via env; falls back to
// the account's measurement ID.
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-QBPH6GGB1S";

// Global SEO defaults. Per-page metadata extends/overrides these.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "D.Pharm, Nursing & Paramedical Admissions Mumbai | ABS",
    template: "%s | ABS",
  },
  description:
    "Admission guidance for Nursing and Paramedical courses across Mumbai and Maharashtra. Verified colleges, genuine counselling, end-to-end support.",
  openGraph: {
    type: "website",
    siteName: "ABS Educational Solution",
    locale: "en_IN",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-gray-900">
        {children}
        {/* Google tag (gtag.js) — GA4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
        </Script>
      </body>
    </html>
  );
}
