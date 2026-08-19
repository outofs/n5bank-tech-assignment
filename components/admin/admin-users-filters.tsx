import Link from "next/link";

import { FilterSelect } from "@/components/marketplace";
import { ADMIN_USER_ROLES, ADMIN_USER_STATUSES } from "@/lib/admin-users";

const FIELD_LABEL_CLASS =
  "text-[0.72rem] font-semibold text-slate-500";
const CONTROL_CLASS =
  "h-11 w-full rounded-full border border-[var(--border)] bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[var(--accent)] focus:ring-4 focus:ring-indigo-100";

type AdminUsersFiltersProps = {
  query: string;
  role: string;
  country: string;
  status: string;
  countries: string[];
  hasActiveFilters: boolean;
};

export function AdminUsersFilters({
  query,
  role,
  country,
  status,
  countries,
  hasActiveFilters,
}: AdminUsersFiltersProps) {
  return (
    <section className="rounded-[1.5rem] border border-[var(--border)] bg-white p-4 shadow-[0_24px_50px_-42px_rgba(15,23,42,0.28)]">
      <form method="get" action="/admin/users" className="grid gap-3 xl:grid-cols-[minmax(0,1.35fr)_repeat(3,minmax(0,0.82fr))_minmax(0,1fr)]">
        <label className="flex min-w-0 flex-col gap-1.5 xl:col-span-2">
          <span className={FIELD_LABEL_CLASS}>Search</span>
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Name, company, country"
            className={CONTROL_CLASS}
          />
        </label>

        <FilterSelect
          label="Role"
          name="role"
          defaultValue={role}
          options={ADMIN_USER_ROLES.map((value) => ({
            value,
            label: value === "BUYER" ? "Buyer" : "Seller",
          }))}
          placeholderLabel="All roles"
        />

        <FilterSelect
          label="Country"
          name="country"
          defaultValue={country}
          options={countries.map((value) => ({ value, label: value }))}
          placeholderLabel="All countries"
        />

        <FilterSelect
          label="Status"
          name="status"
          defaultValue={status}
          options={ADMIN_USER_STATUSES.map((value) => ({
            value,
            label: value === "ACTIVE" ? "Active" : "Suspended",
          }))}
          placeholderLabel="All statuses"
        />

        <div className="flex flex-col gap-2 sm:col-span-2 xl:col-span-2 xl:justify-end">
          <span className={FIELD_LABEL_CLASS}>Actions</span>
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] sm:flex-none"
            >
              Apply filters
            </button>
            {hasActiveFilters ? (
              <Link
                href="/admin/users"
                className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-[var(--border)] bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-[var(--border-strong)] hover:bg-slate-50 sm:flex-none"
              >
                Reset filters
              </Link>
            ) : (
              <span className="inline-flex h-11 items-center px-4 text-sm text-stone-500">
                No active filters
              </span>
            )}
          </div>
        </div>
      </form>
    </section>
  );
}
