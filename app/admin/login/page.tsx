import { redirect } from "next/navigation";

import { authConfigured, isLoggedIn } from "@/lib/auth";
import { loginAction } from "@/app/admin/actions";

export const metadata = { title: "Admin login", robots: { index: false } };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isLoggedIn()) redirect("/admin");
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <span className="inline-grid h-10 w-10 place-items-center rounded-lg bg-brand font-bold text-white">
            ABS
          </span>
          <h1 className="mt-3 text-xl font-bold text-gray-900">Admin login</h1>
          <p className="text-sm text-gray-500">ABS Educational Solution</p>
        </div>

        {!authConfigured && (
          <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
            Set <code>ADMIN_PASSWORD</code> and <code>ADMIN_SESSION_SECRET</code> in your
            environment to enable login.
          </p>
        )}

        <form action={loginAction} className="space-y-3">
          <input
            type="password"
            name="password"
            required
            autoFocus
            placeholder="Password"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
          />
          {error && <p className="text-sm text-red-600">Wrong password. Try again.</p>}
          <button
            type="submit"
            className="w-full rounded-lg bg-brand px-4 py-2.5 font-semibold text-white hover:bg-brand-dark"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}
