import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { SITE_URL } from "@/lib/site";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

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
      <body className="flex min-h-full flex-col bg-white text-gray-900">{children}</body>
    </html>
  );
}
