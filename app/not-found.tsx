import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <p className="text-6xl font-bold text-brand">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Page not found</h1>
      <p className="mt-2 text-gray-600">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/"
          className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-dark"
        >
          Go home
        </Link>
        <Link
          href="/courses"
          className="rounded-lg border border-brand px-5 py-2.5 font-semibold text-brand hover:bg-brand-light"
        >
          Browse courses
        </Link>
      </div>
    </div>
  );
}
