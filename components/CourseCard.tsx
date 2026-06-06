import Image from "next/image";
import Link from "next/link";

import type { Course } from "@/lib/types";

export default function CourseCard({ course }: { course: Course }) {
  const img = course.heroImage;

  return (
    <Link
      href={`/${course.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-0.5 hover:border-brand hover:shadow-lg"
    >
      <div className="relative h-40 w-full overflow-hidden bg-brand-light">
        {img ? (
          <Image
            src={img}
            alt={course.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl font-bold text-brand/40">
            {course.title}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand">
          {course.title}
        </h3>
        {course.quickFacts?.duration && (
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-brand">
            {course.quickFacts.duration}
          </p>
        )}
        <p className="mt-2 flex-1 text-sm text-gray-600">{course.shortDescription}</p>
        <span className="mt-4 text-sm font-semibold text-brand">
          View details &rarr;
        </span>
      </div>
    </Link>
  );
}
