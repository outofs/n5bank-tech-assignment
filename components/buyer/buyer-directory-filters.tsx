import Link from "next/link";

import { FilterSelect, TextField } from "@/components/marketplace";

const FIELD_LABEL_CLASS =
  "text-[0.72rem] font-semibold text-slate-500";
const CONTROL_CLASS =
  "h-11 w-full rounded-full border border-[var(--border)] bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[var(--accent)] focus:ring-4 focus:ring-indigo-100";

export type BuyerDirectoryFiltersProps = {
  query: string;
  country: string;
  category: string;
  minInvestment?: number;
  maxInvestment?: number;
  countries: string[];
  categories: string[];
};

export function BuyerDirectoryFilters({
  query,
  country,
  category,
  minInvestment,
  maxInvestment,
  countries,
  categories,
}: BuyerDirectoryFiltersProps) {
  return (
    <section className="rounded-[1.75rem] border border-[var(--border)] bg-white p-4 shadow-[0_30px_60px_-42px_rgba(15,23,42,0.35)]">
      <form
        method="get"
        action="/buyers"
        className="grid gap-3 xl:grid-cols-[minmax(0,1.35fr)_repeat(4,minmax(0,0.82fr))]"
      >
        <label className="flex min-w-0 flex-col gap-1.5 xl:col-span-2">
          <span className={FIELD_LABEL_CLASS}>Search</span>
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Name, company, country, thesis"
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
          label="Target category"
          name="category"
          defaultValue={category}
          options={categories.map((value) => ({ value, label: value }))}
          placeholderLabel="All categories"
        />

        <TextField label="Min investment">
          <input
            type="number"
            name="minInvestment"
            min="0"
            step="0.01"
            defaultValue={minInvestment ?? ""}
            placeholder="0"
            className={CONTROL_CLASS}
          />
        </TextField>

        <TextField label="Max investment">
          <input
            type="number"
            name="maxInvestment"
            min="0"
            step="0.01"
            defaultValue={maxInvestment ?? ""}
            placeholder="Any"
            className={CONTROL_CLASS}
          />
        </TextField>

        <div className="flex flex-col gap-2 sm:col-span-2 xl:col-span-2 xl:justify-end">
          <span className={FIELD_LABEL_CLASS}>Actions</span>
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] sm:flex-none"
            >
              Apply filters
            </button>
            <Link
              href="/buyers"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-[var(--border)] bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-[var(--border-strong)] hover:bg-slate-50 sm:flex-none"
            >
              Reset
            </Link>
          </div>
        </div>
      </form>
    </section>
  );
}
