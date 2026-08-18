import Link from "next/link";

import { FilterSelect, TextField } from "@/components/marketplace";

const FIELD_LABEL_CLASS =
  "text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500";
const CONTROL_CLASS =
  "h-11 w-full rounded-xl border border-stone-300 bg-white px-3 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-stone-500";

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
    <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <form
        method="get"
        action="/buyers"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"
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
          label="Preferred category"
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
          <div className="flex gap-2">
            <button
              type="submit"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800 sm:flex-none"
            >
              Apply filters
            </button>
            <Link
              href="/buyers"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 sm:flex-none"
            >
              Reset
            </Link>
          </div>
        </div>
      </form>
    </section>
  );
}
