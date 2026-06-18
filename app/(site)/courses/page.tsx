import type { Metadata } from "next";

import Breadcrumbs from "@/components/Breadcrumbs";
import CourseCard from "@/components/CourseCard";
import { JsonLd, breadcrumbSchema } from "@/components/Schema";
import { getCourses } from "@/lib/content";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "D.Pharm, Nursing & Paramedical Courses 2026",
  description:
    "Explore courses ABS Educational Solution helps you get admission into for 2026 — D.Pharm, B.Pharm, GNM, B.Sc Nursing, ANM and DMLT.",
  alternates: { canonical: "/courses" },
};

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Courses", path: "/courses" },
        ])}
      />
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Courses", path: "/courses" },
        ]}
      />
      <h1 className="mt-3 text-4xl font-bold text-gray-900">Courses</h1>
      <p className="mt-3 max-w-2xl text-gray-600">
        We guide students into accredited Nursing and Paramedical programmes across Mumbai and
        Maharashtra. Pick a course to see eligibility, duration, scope and admission support.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
    </div>
  );
}
