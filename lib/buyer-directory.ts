import { Prisma } from "@prisma/client";

export type BuyerDirectorySearchParams = Promise<{
  q?: string | string[];
  country?: string | string[];
  category?: string | string[];
  minInvestment?: string | string[];
  maxInvestment?: string | string[];
}>;

export type BuyerDirectoryFilters = {
  query: string;
  country: string;
  category: string;
  minInvestment?: number;
  maxInvestment?: number;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function trimParam(value: string | string[] | undefined) {
  return firstParam(value)?.trim() || "";
}

function parseNonNegativeMoney(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return undefined;
  }

  return parsed;
}

function uniqueSorted(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter(Boolean) as string[])).sort((a, b) =>
    a.localeCompare(b),
  );
}

export function normalizeBuyerDirectoryFilters({
  q,
  country,
  category,
  minInvestment,
  maxInvestment,
}: {
  q?: string | string[];
  country?: string | string[];
  category?: string | string[];
  minInvestment?: string | string[];
  maxInvestment?: string | string[];
}) {
  return {
    query: trimParam(q),
    country: trimParam(country),
    category: trimParam(category),
    minInvestment: parseNonNegativeMoney(trimParam(minInvestment)),
    maxInvestment: parseNonNegativeMoney(trimParam(maxInvestment)),
  } satisfies BuyerDirectoryFilters;
}

export function hasBuyerDirectoryFilters(filters: BuyerDirectoryFilters) {
  return Boolean(
    filters.query ||
      filters.country ||
      filters.category ||
      filters.minInvestment !== undefined ||
      filters.maxInvestment !== undefined,
  );
}

export function sanitizeBuyerDirectorySelection<T extends string>(
  value: string,
  options: readonly T[],
) {
  return options.includes(value as T) ? (value as T) : "";
}

export function buildBuyerCompatibilityFilter({
  minInvestment,
  maxInvestment,
}: BuyerDirectoryFilters) {
  if (minInvestment === undefined && maxInvestment === undefined) {
    return undefined;
  }

  const compatibility: Prisma.BuyerProfileWhereInput = {};

  if (minInvestment !== undefined) {
    compatibility.maxInvestment = {
      gte: new Prisma.Decimal(minInvestment),
    };
  }

  if (maxInvestment !== undefined) {
    compatibility.minInvestment = {
      lte: new Prisma.Decimal(maxInvestment),
    };
  }

  return compatibility;
}

export function uniqueBuyerCountries(
  values: Array<string | null | undefined>,
) {
  return uniqueSorted(values);
}

export function uniqueBuyerCategories(
  values: Array<string[] | null | undefined>,
) {
  return uniqueSorted(values.flatMap((value) => value ?? []));
}
