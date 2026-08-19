import Link from "next/link";

import { FilterSelect } from "@/components/marketplace";
import { ADMIN_USER_ROLES, ADMIN_USER_STATUSES } from "@/lib/admin-users";

const FIELD_LABEL_CLASS =
  "text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500";
const CONTROL_CLASS =
  "h-11 w-full rounded-xl border border-stone-300 bg-white px-3 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-stone-500";

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
    <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <form method="get" action="/admin/users" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
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
          <div className="flex gap-2">
            <button
              type="submit"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800 sm:flex-none"
            >
              Apply filters
            </button>
            {hasActiveFilters ? (
              <Link
                href="/admin/users"
                className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 sm:flex-none"
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
