import Link from "next/link";
import { notFound } from "next/navigation";

import { ListField, TextArea, TextInput } from "@/components/admin/AdminFields";
import ImageUpload from "@/components/admin/ImageUpload";
import { dbConfigured, getCourseById } from "@/lib/admin-content";
import { saveCourseAction } from "@/app/admin/actions";

export default async function EditCourse({
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
        Connect the database to edit courses.
      </p>
    );
  }

  const course = isNew ? null : await getCourseById(Number(id));
  if (!isNew && !course) notFound();

  const faqText = (course?.faqs || []).map((f) => `${f.question} :: ${f.answer}`).join("\n");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? "New course" : `Edit: ${course?.title}`}
        </h1>
        <Link href="/admin/courses" className="text-sm text-gray-500 hover:text-brand">
          ← Back
        </Link>
      </div>

      {error === "required" && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          Title and slug are required.
        </p>
      )}

      <form action={saveCourseAction} className="space-y-8">
        <input type="hidden" name="id" value={isNew ? "new" : id} />

        <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="font-semibold text-gray-900">Basics</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput name="title" label="Title (H1)" defaultValue={course?.title} required
              hint="e.g. D Pharma Admission 2026 in Mumbai" />
            <TextInput name="slug" label="Slug (URL)" defaultValue={course?.slug} required
              hint="e.g. d-pharma-admission-2026" />
            <TextInput name="courseShortName" label="Short name" defaultValue={course?.courseShortName}
              hint="e.g. D.Pharm" />
            <TextInput name="order" label="Sort order" defaultValue={String(course?.order ?? 100)}
              type="number" />
          </div>
          <TextArea name="shortDescription" label="Short description (cards/preview)"
            defaultValue={course?.shortDescription} rows={2} />
          <TextArea name="openingAnswer" label="Opening answer (first 2 lines — wins AI Overviews)"
            defaultValue={course?.openingAnswer} rows={3} />
          <TextArea name="whatIs" label="What is this course?" defaultValue={course?.whatIs} rows={4} />
          <ImageUpload name="heroImage" initial={course?.heroImage} />
        </section>

        <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="font-semibold text-gray-900">Quick facts</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput name="qf_duration" label="Duration" defaultValue={course?.quickFacts?.duration} />
            <TextInput name="qf_eligibility" label="Eligibility" defaultValue={course?.quickFacts?.eligibility} />
            <TextInput name="qf_approvedBy" label="Approved by" defaultValue={course?.quickFacts?.approvedBy} />
            <TextInput name="qf_admissionStatus" label="Admission status" defaultValue={course?.quickFacts?.admissionStatus} />
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="font-semibold text-gray-900">Understanding the course</h2>
          <ListField name="highlights" label="Course highlights" defaultValue={course?.highlights} />
          <ListField name="subjects" label="What you will study (subjects)" defaultValue={course?.subjects} />
          <ListField name="eligibilityPoints" label="Eligibility checklist" defaultValue={course?.eligibilityPoints} />
          <ListField name="documentsRequired" label="Documents required" defaultValue={course?.documentsRequired} />
          <ListField name="admissionSteps" label="Admission steps" defaultValue={course?.admissionSteps} />
        </section>

        <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="font-semibold text-gray-900">Fees & career</h2>
          <TextArea name="feesInfo" label="Fees & duration info" defaultValue={course?.feesInfo} rows={2} />
          <TextArea name="careerScope" label="Career & scope" defaultValue={course?.careerScope} rows={2} />
          <ListField name="jobRoles" label="Job roles" defaultValue={course?.jobRoles} />
          <ListField name="workAreas" label="Where you can work" defaultValue={course?.workAreas} />
          <TextArea name="salaryRange" label="Salary guidance" defaultValue={course?.salaryRange} rows={2} />
          <ListField name="higherStudies" label="What to study after" defaultValue={course?.higherStudies} />
        </section>

        <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="font-semibold text-gray-900">FAQs & SEO</h2>
          <TextArea name="faqs" label="FAQs" defaultValue={faqText} rows={6}
            hint="One per line, format:  Question :: Answer" />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput name="seo_title" label="Meta title" defaultValue={course?.seo?.title} />
            <TextInput name="seo_description" label="Meta description" defaultValue={course?.seo?.description} />
          </div>
        </section>

        <div className="flex gap-3">
          <button className="rounded-lg bg-brand px-6 py-2.5 font-semibold text-white hover:bg-brand-dark">
            Save course
          </button>
          <Link href="/admin/courses" className="rounded-lg border border-gray-300 px-6 py-2.5 font-semibold text-gray-700 hover:bg-gray-100">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
