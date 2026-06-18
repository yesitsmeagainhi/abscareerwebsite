import Link from "next/link";
import { notFound } from "next/navigation";

import { ListField, TextArea, TextInput } from "@/components/admin/AdminFields";
import ImageUpload from "@/components/admin/ImageUpload";
import { dbConfigured, getBlogById } from "@/lib/admin-content";
import { saveBlogAction } from "@/app/admin/actions";

export default async function EditBlogPost({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const isNew = id === "new";

  if (!dbConfigured) {
    return (
      <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
        Connect the database to edit blog posts.
      </p>
    );
  }

  const post = isNew ? null : await getBlogById(Number(id));
  if (!isNew && !post) notFound();

  const faqText = (post?.faqs || []).map((f) => `${f.question} :: ${f.answer}`).join("\n");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? "New post" : `Edit: ${post?.title}`}
        </h1>
        <Link href="/admin/blog" className="text-sm text-gray-500 hover:text-brand">
          ← Back
        </Link>
      </div>

      {error === "required" && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          Title, slug and body are required.
        </p>
      )}

      <form action={saveBlogAction} className="space-y-8">
        <input type="hidden" name="id" value={isNew ? "new" : id} />

        <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="font-semibold text-gray-900">Basics</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
              name="title"
              label="Title (H1)"
              defaultValue={post?.title}
              required
              hint="e.g. D Pharma Admission in Mumbai 2026: Fees & Process"
            />
            <TextInput
              name="slug"
              label="Slug (URL)"
              defaultValue={post?.slug}
              required
              hint="e.g. d-pharma-admission-mumbai-2026"
            />
            <TextInput
              name="author"
              label="Author / byline"
              defaultValue={post?.author}
              hint="e.g. ABS Admissions Counselling Team"
            />
            <TextInput
              name="datePublished"
              label="Publish date"
              type="date"
              defaultValue={post?.datePublished}
              hint="Defaults to today. 'Updated' date is set automatically on save."
            />
          </div>
          <TextArea
            name="description"
            label="Meta description (search snippet, ~155 chars)"
            defaultValue={post?.description}
            rows={2}
          />
          <TextArea
            name="excerpt"
            label="Excerpt (shown under the title & on cards)"
            defaultValue={post?.excerpt}
            rows={2}
          />
          <TextInput
            name="tags"
            label="Tags"
            defaultValue={(post?.tags || []).join(", ")}
            hint="Comma-separated, e.g. D.Pharm, Pharmacy, Admission 2026"
          />
          <ImageUpload name="heroImage" initial={post?.heroImage} />
        </section>

        <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="font-semibold text-gray-900">Article body</h2>
          <TextArea
            name="bodyHtml"
            label="Body (HTML)"
            defaultValue={post?.bodyHtml}
            rows={20}
            hint="Write HTML: <h2>, <h3>, <p>, <ul><li>, <ol><li>, <table>, <strong>, <blockquote>, <a href='/d-pharma-admission-2026'>. Links to your own course/area pages boost SEO. This renders as the page content — only you (admin) can edit it."
          />
        </section>

        <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="font-semibold text-gray-900">FAQs & internal links</h2>
          <TextArea
            name="faqs"
            label="FAQs"
            defaultValue={faqText}
            rows={6}
            hint="One per line, format:  Question :: Answer"
          />
          <ListField
            name="relatedCourses"
            label="Related course slugs"
            defaultValue={post?.relatedCourses}
            hint="One slug per line, e.g. d-pharma-admission-2026"
          />
          <ListField
            name="relatedPosts"
            label="Related post slugs"
            defaultValue={post?.relatedPosts}
            hint="One slug per line, e.g. d-pharm-vs-b-pharm"
          />
        </section>

        <div className="flex gap-3">
          <button className="rounded-lg bg-brand px-6 py-2.5 font-semibold text-white hover:bg-brand-dark">
            Save post
          </button>
          <Link
            href="/admin/blog"
            className="rounded-lg border border-gray-300 px-6 py-2.5 font-semibold text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
