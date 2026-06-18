import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Breadcrumbs from "@/components/Breadcrumbs";
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from "@/components/Schema";
import { getBlogPost, getBlogPosts, getBlogSlugs } from "@/lib/blog";
import { getCourses, getSiteSettings } from "@/lib/content";
import { formatDate, whatsappLink } from "@/lib/site";

export const revalidate = 3600;

export async function generateStaticParams() {
  return getBlogSlugs().map((post) => ({ post }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ post: string }>;
}): Promise<Metadata> {
  const { post: slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Article not found" };
  return {
    title: { absolute: `${post.title} | ABS` },
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified || post.datePublished,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ post: string }>;
}) {
  const { post: slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const [settings, courses] = await Promise.all([getSiteSettings(), getCourses()]);
  const allPosts = getBlogPosts();

  const relatedCourses = (post.relatedCourses || [])
    .map((s) => courses.find((c) => c.slug === s))
    .filter(Boolean);
  const relatedPosts = (post.relatedPosts || [])
    .map((s) => allPosts.find((p) => p.slug === s))
    .filter(Boolean);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ];

  return (
    <article>
      <JsonLd data={articleSchema(post, settings)} />
      <JsonLd data={breadcrumbSchema(crumbs)} />
      {post.faqs && post.faqs.length > 0 && <JsonLd data={faqSchema(post.faqs)} />}

      <header className="bg-brand-light">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <Breadcrumbs items={crumbs} />
          {post.tags && post.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-brand"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          <h1 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            {post.title}
          </h1>
          {post.excerpt && <p className="mt-4 text-lg text-gray-700">{post.excerpt}</p>}
          <p className="mt-4 text-sm text-gray-500">
            By <span className="font-medium text-gray-700">{post.author || settings.orgName}</span>
            {" · "}
            <time dateTime={post.datePublished}>Published {formatDate(post.datePublished)}</time>
            {post.dateModified && post.dateModified !== post.datePublished && (
              <>
                {" · "}
                <time dateTime={post.dateModified}>Updated {formatDate(post.dateModified)}</time>
              </>
            )}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* The article body ships as server-rendered HTML (best for crawlers). */}
        <div
          className="prose-basic max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
        />

        {/* FAQ */}
        {post.faqs && post.faqs.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900">Frequently asked questions</h2>
            <div className="mt-4 divide-y divide-gray-200 rounded-xl border border-gray-200">
              {post.faqs.map((f, i) => (
                <details key={i} className="group p-4">
                  <summary className="cursor-pointer list-none font-medium text-gray-900">
                    {f.question}
                  </summary>
                  <p className="mt-2 text-sm text-gray-600">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Related courses */}
        {relatedCourses.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-gray-900">Related courses</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {relatedCourses.map((c) => (
                <Link
                  key={c!.slug}
                  href={`/${c!.slug}`}
                  className="rounded-full border border-brand px-4 py-1.5 text-sm font-medium text-brand transition hover:bg-brand-light"
                >
                  {c!.courseShortName || c!.title}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-bold text-gray-900">Keep reading</h2>
            <ul className="mt-3 space-y-2">
              {relatedPosts.map((p) => (
                <li key={p!.slug}>
                  <Link href={`/blog/${p!.slug}`} className="font-medium text-brand hover:underline">
                    {p!.title} →
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* CTA */}
        <section className="mt-10 rounded-2xl bg-brand p-6 text-center text-white">
          <h2 className="text-xl font-bold">Need help choosing or applying?</h2>
          <p className="mt-1 text-white/90">
            Get free, honest admission counselling from ABS — we&apos;ll guide you step by step.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {settings.phone && (
              <a
                href={`tel:${settings.phone.replace(/\s/g, "")}`}
                className="rounded-lg bg-white px-5 py-2.5 font-semibold text-brand hover:bg-gray-100"
              >
                Call {settings.phone}
              </a>
            )}
            {settings.whatsappNumber && (
              <a
                href={whatsappLink(settings.whatsappNumber, `Hi, I read your article "${post.title}" and want admission guidance.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-white px-5 py-2.5 font-semibold text-white hover:bg-white/10"
              >
                WhatsApp
              </a>
            )}
          </div>
        </section>

        <p className="mt-8">
          <Link href="/blog" className="text-sm font-semibold text-brand hover:underline">
            ← Back to all articles
          </Link>
        </p>
      </div>
    </article>
  );
}
