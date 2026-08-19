import { Prisma } from "@prisma/client";
import Link from "next/link";

import { SmartMatchPanel, AssetCard, FilterSelect, TextField } from "@/components/marketplace";
import { EmptyState, PageHeader } from "@/components/shared";
import { AuthorizationError, requireBuyerDemoUser } from "@/lib/authz";
import { db } from "@/lib/db";
import {
  marketplaceFilterOptionSelect,
  marketplaceListAssetSelect,
} from "@/lib/marketplace/types";
import {
  calculateSmartMatchScore,
  hasSmartMatchPreferences,
  sortAssetsBySmartMatch,
} from "@/lib/smart-match";

type MarketplaceSearchParams = Promise<{
  q?: string | string[];
  country?: string | string[];
  category?: string | string[];
  businessStatus?: string | string[];
  minPrice?: string | string[];
  maxPrice?: string | string[];
  sort?: string | string[];
}>;

const DEFAULT_SORT = "newest";
const SORT_OPTIONS = [
  { value: "best-match", label: "Best match" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price low to high" },
  { value: "price-desc", label: "Price high to low" },
] as const;
const FIELD_LABEL_CLASS =
  "text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500";
const CONTROL_CLASS =
  "h-11 w-full rounded-xl border border-stone-300 bg-white px-3 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-stone-500";

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function trimParam(value: string | string[] | undefined) {
  return firstParam(value)?.trim() || "";
}

function uniqueSorted(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter(Boolean) as string[])).sort((a, b) =>
    a.localeCompare(b),
  );
}

function parsePositiveMoney(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return undefined;
  }

  return value;
}

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: MarketplaceSearchParams;
}) {
  const currentUser = await (async () => {
    try {
      return await requireBuyerDemoUser();
    } catch (error) {
      if (error instanceof AuthorizationError) {
        return null;
      }

      throw error;
    }
  })();

  if (!currentUser) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <EmptyState
          title="Buyer access required"
          description="Select an active Buyer demo identity from the header to view the marketplace."
        />
      </main>
    );
  }

  const {
    q: rawQuery,
    country: rawCountry,
    category: rawCategory,
    businessStatus: rawBusinessStatus,
    minPrice: rawMinPrice,
    maxPrice: rawMaxPrice,
    sort: rawSort,
  } = await searchParams;

  const smartMatchProfile = currentUser.buyerProfile;
  const canShowSmartMatch = hasSmartMatchPreferences(smartMatchProfile);

  const baseMarketplaceAssets = await db.asset.findMany({
    where: {
      status: "PUBLISHED",
      seller: { status: "ACTIVE" },
    },
    select: marketplaceFilterOptionSelect,
  });

  const countries = uniqueSorted(baseMarketplaceAssets.map((asset) => asset.country));
  const categories = uniqueSorted(
    baseMarketplaceAssets.map((asset) => asset.category),
  );
  const businessStatuses = uniqueSorted(
    baseMarketplaceAssets.map((asset) => asset.businessStatus),
  );

  const query = trimParam(rawQuery);
  const countryParam = trimParam(rawCountry);
  const categoryParam = trimParam(rawCategory);
  const businessStatusParam = trimParam(rawBusinessStatus);
  const minPriceParam = parsePositiveMoney(trimParam(rawMinPrice));
  const maxPriceParam = parsePositiveMoney(trimParam(rawMaxPrice));
  const sortParam = trimParam(rawSort);

  const country = countries.includes(countryParam) ? countryParam : "";
  const category = categories.includes(categoryParam) ? categoryParam : "";
  const businessStatus = businessStatuses.includes(businessStatusParam)
    ? businessStatusParam
    : "";
  const sort =
    SORT_OPTIONS.find((option) => option.value === sortParam)?.value ??
    DEFAULT_SORT;

  const where: Prisma.AssetWhereInput = {
    status: "PUBLISHED",
    seller: {
      status: "ACTIVE",
    },
  };

  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { country: { contains: query, mode: "insensitive" } },
      { category: { contains: query, mode: "insensitive" } },
      { licenseType: { contains: query, mode: "insensitive" } },
    ];
  }

  if (country) {
    where.country = country;
  }

  if (category) {
    where.category = category;
  }

  if (businessStatus) {
    where.businessStatus = businessStatus;
  }

  if (minPriceParam || maxPriceParam) {
    where.askingPrice = {};

    if (minPriceParam) {
      where.askingPrice.gte = new Prisma.Decimal(minPriceParam);
    }

    if (maxPriceParam) {
      where.askingPrice.lte = new Prisma.Decimal(maxPriceParam);
    }
  }

  const orderBy: Prisma.AssetOrderByWithRelationInput[] =
    sort === "price-asc"
      ? [{ askingPrice: "asc" }, { createdAt: "desc" }, { id: "asc" }]
      : sort === "price-desc"
        ? [{ askingPrice: "desc" }, { createdAt: "desc" }, { id: "asc" }]
        : sort === "best-match"
          ? [{ createdAt: "desc" }, { id: "asc" }]
          : [{ createdAt: "desc" }, { id: "asc" }];

  const assets = await db.asset.findMany({
    where,
    select: marketplaceListAssetSelect,
    orderBy,
  });

  const scoredAssets = assets.map((asset) => ({
    ...asset,
    smartMatch: calculateSmartMatchScore(smartMatchProfile, asset),
  }));
  const visibleAssets =
    sort === "best-match"
      ? sortAssetsBySmartMatch(scoredAssets)
      : scoredAssets;

  const visibleCount = visibleAssets.length;
  const hasActiveFilters = Boolean(
    query ||
      country ||
      category ||
      businessStatus ||
      minPriceParam !== undefined ||
      maxPriceParam !== undefined ||
      sort !== DEFAULT_SORT,
  );

  return (
    <main className="bg-stone-50/80">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Buyer marketplace"
          title="Available assets"
          description="Published opportunities from active sellers, filtered directly from PostgreSQL."
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700">
                {visibleCount} matching assets
              </div>
              {hasActiveFilters ? (
                <Link
                  href="/marketplace"
                  className="inline-flex items-center rounded-full border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                >
                  Reset filters
                </Link>
              ) : null}
            </div>
          }
        />

        {!canShowSmartMatch ? (
          <SmartMatchPanel match={null} ctaHref="/profile/edit" />
        ) : null}

        <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <form
            method="get"
            action="/marketplace"
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"
          >
            <label className="flex min-w-0 flex-col gap-1.5 xl:col-span-2">
              <span className={FIELD_LABEL_CLASS}>Search</span>
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Title, description, country, category, license"
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
              label="Business status"
              name="businessStatus"
              defaultValue={businessStatus}
              options={businessStatuses.map((value) => ({ value, label: value }))}
              placeholderLabel="All statuses"
            />

            <TextField label="Min price">
              <input
                type="number"
                name="minPrice"
                min="0"
                step="0.01"
                defaultValue={minPriceParam ?? ""}
                placeholder="0"
                className={CONTROL_CLASS}
              />
            </TextField>

            <TextField label="Max price">
              <input
                type="number"
                name="maxPrice"
                min="0"
                step="0.01"
                defaultValue={maxPriceParam ?? ""}
                placeholder="Any"
                className={CONTROL_CLASS}
              />
            </TextField>

            <FilterSelect
              label="Sort"
              name="sort"
              defaultValue={sort}
              options={SORT_OPTIONS.map((option) => ({
                value: option.value,
                label: option.label,
              }))}
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
                <Link
                  href="/marketplace"
                  className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 sm:flex-none"
                >
                  Reset
                </Link>
              </div>
            </div>
          </form>
        </section>

        {visibleCount === 0 ? (
          <EmptyState
            title={
              hasActiveFilters
                ? "No assets match these filters"
                : "No published assets available"
            }
            description={
              hasActiveFilters
                ? "Try broadening the search, removing one filter at a time, or resetting the form to see more marketplace inventory."
                : "There are no published assets from active sellers right now. Seed data or moderation state may be filtering the list."
            }
            action={
              hasActiveFilters ? (
                <Link
                  href="/marketplace"
                  className="inline-flex items-center rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                >
                  Reset filters
                </Link>
              ) : null
            }
          />
        ) : (
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {visibleAssets.map((asset) => (
              <AssetCard
                key={asset.id}
                href={`/marketplace/${asset.id}`}
                asset={asset}
                smartMatch={canShowSmartMatch ? asset.smartMatch : null}
              />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
