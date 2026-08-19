import Link from "next/link";

import { FilterSelect } from "@/components/marketplace";
import { ADMIN_ASSET_STATUSES } from "@/lib/admin-assets";
import { SELLER_OPERATING_STATUSES } from "@/lib/seller-asset-form";

const FIELD_LABEL_CLASS =
  "text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500";
const CONTROL_CLASS =
  "h-11 w-full rounded-xl border border-stone-300 bg-white px-3 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-stone-500";

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
    <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <form method="get" action="/admin/assets" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
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
          <div className="flex gap-2">
            <button
              type="submit"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800 sm:flex-none"
            >
              Apply filters
            </button>
            {hasActiveFilters ? (
              <Link
                href="/admin/assets"
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
