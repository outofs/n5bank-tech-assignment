import Link from "next/link";

export function AdminFutureNavigation() {
  return (
    <section className="rounded-[1.5rem] border border-[var(--border)] bg-white p-4 shadow-[0_24px_50px_-42px_rgba(15,23,42,0.28)] sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-950">Next management areas</h2>
          <p className="mt-1 text-sm text-slate-600">
            Use these entry points as the dashboard expands into moderation and
            record management.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/users"
            className="inline-flex items-center rounded-full border border-[var(--accent)] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--accent-strong)]"
          >
            Manage Users
          </Link>
          <Link
            href="/admin/assets"
            className="inline-flex items-center rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-[var(--border-strong)] hover:bg-slate-50"
          >
            Manage Assets
          </Link>
        </div>
      </div>
    </section>
  );
}
