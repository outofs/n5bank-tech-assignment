import Link from "next/link";

export function AdminFutureNavigation() {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-stone-950">Next management areas</h2>
          <p className="mt-1 text-sm text-stone-600">
            Use these entry points as the dashboard expands into moderation and
            record management.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/users"
            className="inline-flex items-center rounded-full border border-stone-950 bg-stone-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            Manage Users
          </Link>
          <Link
            href="/admin/assets"
            className="inline-flex items-center rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
          >
            Manage Assets
          </Link>
        </div>
      </div>
    </section>
  );
}
