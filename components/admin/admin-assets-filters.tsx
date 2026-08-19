import Link from "next/link";

import { FilterSelect } from "@/components/marketplace";
import { ADMIN_ASSET_STATUSES } from "@/lib/admin-assets";
import { SELLER_OPERATING_STATUSES } from "@/lib/seller-asset-form";

const FIELD_LABEL_CLASS =
  "text-[0.72rem] font-semibold text-slate-500";
const CONTROL_CLASS =
  "h-11 w-full rounded-full border border-[var(--border)] bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[var(--accent)] focus:ring-4 focus:ring-indigo-100";

type AdminAssetsFiltersProps = {
  query: string;
  country: string;
  category: string;
  status: string;
  businessStatus: string;
  countries: string[];
  categories: string[];
  hasActiveFilters: boolean;
};

export function AdminAssetsFilters({
  query,
  country,
  category,
  status,
  businessStatus,
  countries,
  categories,
  hasActiveFilters,
}: AdminAssetsFiltersProps) {
  return (
    <section className="rounded-[1.5rem] border border-[var(--border)] bg-white p-4 shadow-[0_24px_50px_-42px_rgba(15,23,42,0.28)]">
      <form method="get" action="/admin/assets" className="grid gap-3 xl:grid-cols-[minmax(0,1.35fr)_repeat(4,minmax(0,0.82fr))]">
        <label className="flex min-w-0 flex-col gap-1.5 xl:col-span-2">
          <span className={FIELD_LABEL_CLASS}>Search</span>
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Title, seller, country, category"
            className={CONTROL_CLASS}
          />
        </label>

        <FilterSelect
          label="Country"
          name="country"
          defaultValue={country}
          options={countries.map((value) => ({ value, label: value }))}
          placeholderLabel="All countries"
        />

        <FilterSelect
          label="Category"
          name="category"
          defaultValue={category}
          options={categories.map((value) => ({ value, label: value }))}
          placeholderLabel="All categories"
        />

        <FilterSelect
          label="Listing status"
          name="status"
          defaultValue={status}
          options={ADMIN_ASSET_STATUSES.map((value) => ({
            value,
            label:
              value === "DRAFT"
                ? "Draft"
                : value === "PUBLISHED"
                  ? "Published"
                  : "Suspended",
          }))}
          placeholderLabel="All listing statuses"
        />

        <FilterSelect
          label="Operating status"
          name="businessStatus"
          defaultValue={businessStatus}
          options={SELLER_OPERATING_STATUSES.map((value) => ({
            value,
            label: value,
          }))}
          placeholderLabel="All operating statuses"
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
                href="/admin/assets"
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
