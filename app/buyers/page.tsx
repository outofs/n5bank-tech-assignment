import { Prisma } from "@prisma/client";
import Link from "next/link";

import { BuyerCard, BuyerDirectoryFilters } from "@/components/buyer";
import { EmptyState, PageHeader } from "@/components/shared";
import { SellerAccessState } from "@/components/seller";
import {
  AuthorizationError,
  requireSellerDemoUser,
} from "@/lib/authz";
import {
  buildBuyerCompatibilityFilter,
  hasBuyerDirectoryFilters,
  normalizeBuyerDirectoryFilters,
} from "@/lib/buyer-directory";
import {
  buyerDirectoryCardSelect,
  buyerDirectoryFilterOptionSelect,
  hasBuyerProfile,
} from "@/lib/buyers/types";
import { db } from "@/lib/db";
import {
  buildCanonicalCountryOptions,
  buildNormalizedFilterOptions,
  sanitizeOptionValue,
} from "@/lib/filter-options";

type BuyerDirectorySearchParams = Promise<{
  q?: string | string[];
  country?: string | string[];
  category?: string | string[];
  minInvestment?: string | string[];
  maxInvestment?: string | string[];
}>;

export default async function BuyersPage({
  searchParams,
}: {
  searchParams: BuyerDirectorySearchParams;
}) {
  try {
    await requireSellerDemoUser();
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return (
        <SellerAccessState
          title="Seller access required"
          description="Select an active Seller demo identity from the header to view the buyer directory."
          actionHref="/seller/assets"
          actionLabel="Back to assets"
        />
      );
    }

    throw error;
  }

  const {
    q: rawQuery,
    country: rawCountry,
    category: rawCategory,
    minInvestment: rawMinInvestment,
    maxInvestment: rawMaxInvestment,
  } = await searchParams;

  const normalizedFilters = normalizeBuyerDirectoryFilters({
    q: rawQuery,
    country: rawCountry,
    category: rawCategory,
    minInvestment: rawMinInvestment,
    maxInvestment: rawMaxInvestment,
  });

  const [baseBuyers, assetCategoryRows] = await Promise.all([
    db.user.findMany({
      where: {
        role: "BUYER",
        status: "ACTIVE",
        buyerProfile: {
          isNot: null,
        },
      },
      select: buyerDirectoryFilterOptionSelect,
    }),
    db.asset.findMany({
      select: {
        category: true,
      },
    }),
  ]);

  const countryOptions = buildCanonicalCountryOptions(
    baseBuyers.map((buyer) => buyer.country),
  );
  const categoryOptionGroup = buildNormalizedFilterOptions(
    [
      ...baseBuyers.flatMap(
        (buyer) => buyer.buyerProfile?.preferredCategories ?? [],
      ),
      ...assetCategoryRows.map((asset) => asset.category),
    ],
  );

  const country = sanitizeOptionValue(
    normalizedFilters.country,
    countryOptions,
  );
  const category = sanitizeOptionValue(
    normalizedFilters.category,
    categoryOptionGroup.options,
  );
  const query = normalizedFilters.query;

  const where: Prisma.UserWhereInput = {
    role: "BUYER",
    status: "ACTIVE",
    buyerProfile: {
      isNot: null,
    },
  };

  const andClauses: Prisma.UserWhereInput[] = [];

  if (query) {
    andClauses.push({
      OR: [
        {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          company: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          country: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          buyerProfile: {
            is: {
              investmentThesis: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    });
  }

  if (country) {
    andClauses.push({
      country,
    });
  }

  const buyerProfileFilters: Prisma.BuyerProfileWhereInput = {};

  if (category) {
    buyerProfileFilters.preferredCategories = {
      hasSome: categoryOptionGroup.valuesByOption.get(category) ?? [category],
    };
  }

  const compatibilityFilter = buildBuyerCompatibilityFilter(
    normalizedFilters,
  );

  if (compatibilityFilter) {
    Object.assign(buyerProfileFilters, compatibilityFilter);
  }

  if (Object.keys(buyerProfileFilters).length > 0) {
    andClauses.push({
      buyerProfile: {
        is: buyerProfileFilters,
      },
    });
  }

  if (andClauses.length > 0) {
    where.AND = andClauses;
  }

  const buyers = await db.user.findMany({
    where,
    select: buyerDirectoryCardSelect,
    orderBy: [
      {
        updatedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  const visibleBuyers = buyers.filter(hasBuyerProfile);

  const visibleCount = visibleBuyers.length;
  const hasActiveFilters = hasBuyerDirectoryFilters({
    ...normalizedFilters,
    country,
    category,
  });

  return (
    <main className="bg-stone-50/80">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Seller directory"
          title="Buyers"
          description="Active buyers with profile data from PostgreSQL, filtered server-side and ordered by the most recent update."
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700">
                {visibleCount} matching buyers
              </div>
              {hasActiveFilters ? (
                <Link
                  href="/buyers"
                  className="inline-flex items-center rounded-full border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                >
                  Reset filters
                </Link>
              ) : null}
            </div>
          }
        />

        <BuyerDirectoryFilters
          query={query}
          country={country}
          category={category}
          minInvestment={normalizedFilters.minInvestment}
          maxInvestment={normalizedFilters.maxInvestment}
          countries={countryOptions.map((option) => option.value)}
          categories={categoryOptionGroup.options.map((option) => option.value)}
        />

        {visibleCount === 0 ? (
          <EmptyState
            title={
              hasActiveFilters
                ? "No buyers match these filters"
                : "No active buyers available"
            }
            description={
              hasActiveFilters
                ? "Try broadening the search, clearing one filter at a time, or resetting the form to see more buyers."
                : "There are no active Buyers with profile data to show right now."
            }
            action={
              hasActiveFilters ? (
                <Link
                  href="/buyers"
                  className="inline-flex items-center rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                >
                  Reset filters
                </Link>
              ) : null
            }
          />
        ) : (
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleBuyers.map((buyer) => (
              <BuyerCard
                key={buyer.id}
                href={`/buyers/${buyer.id}`}
                buyer={buyer}
              />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
