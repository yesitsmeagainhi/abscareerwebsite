import type { Metadata } from "next";
import Link from "next/link";

import Breadcrumbs from "@/components/Breadcrumbs";
import { JsonLd, breadcrumbSchema } from "@/components/Schema";
import { getBlogPosts } from "@/lib/blog";
import { SITE_URL, formatDate } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog — Admission Guides & Career Advice 2026",
  description:
    "Honest guides on D.Pharm, B.Pharm, Nursing and Paramedical admissions in Mumbai — fees, eligibility, course comparisons and career advice for 2026.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = getBlogPosts();
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "ABS Educational Solution — Admission Blog",
          url: `${SITE_URL}/blog`,
          blogPost: posts.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            url: `${SITE_URL}/blog/${p.slug}`,
            datePublished: p.datePublished,
            dateModified: p.dateModified || p.datePublished,
          })),
        }}
      />

      <Breadcrumbs items={crumbs} />
      <h1 className="mt-3 text-4xl font-bold text-gray-900">Admission Guides & Career Advice</h1>
      <p className="mt-3 max-w-2xl text-gray-600">
        Simple, honest guides on D.Pharm, B.Pharm, Nursing and Paramedical admissions in Mumbai —
        fees, eligibility, course comparisons and career advice for the 2026 batch.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-lg"
          >
            {post.tags && post.tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-brand-light px-2.5 py-0.5 text-xs font-medium text-brand"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            <h2 className="text-xl font-bold text-gray-900">
              <Link href={`/blog/${post.slug}`} className="hover:text-brand">
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 flex-1 text-sm text-gray-600">{post.excerpt || post.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <time className="text-xs text-gray-500" dateTime={post.datePublished}>
                {formatDate(post.datePublished)}
              </time>
              <Link
                href={`/blog/${post.slug}`}
                className="text-sm font-semibold text-brand hover:underline"
              >
                Read more →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
