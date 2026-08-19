import { Prisma } from "@prisma/client";
import Link from "next/link";

import {
  AdminAssetsFeedback,
  AdminAssetsFilters,
  AdminAssetsList,
  ManagerAccessState,
} from "@/components/admin";
import { PageHeader } from "@/components/shared";
import { AuthorizationError, requireManagerDemoUser } from "@/lib/authz";
import { db } from "@/lib/db";
import { suspendAdminAssetAction, restoreAdminAssetAction } from "./actions";
import { adminAssetModerationSelect } from "@/lib/admin-assets";
import {
  buildCanonicalCountryOptions,
  buildNormalizedFilterOptions,
  sanitizeOptionValue,
} from "@/lib/filter-options";
import { SELLER_OPERATING_STATUSES } from "@/lib/seller-asset-form";

type AdminAssetsSearchParams = Promise<{
  q?: string | string[];
  country?: string | string[];
  category?: string | string[];
  status?: string | string[];
  businessStatus?: string | string[];
  notice?: string | string[];
  noticeTone?: string | string[];
}>;

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function trimParam(value: string | string[] | undefined) {
  return firstParam(value)?.trim() || "";
}

function normalizeStatus(value: string | string[] | undefined) {
  const candidate = trimParam(value).toUpperCase();
  return candidate === "DRAFT" || candidate === "PUBLISHED" || candidate === "SUSPENDED"
    ? candidate
    : "";
}

function normalizeTone(value: string | string[] | undefined) {
  const candidate = trimParam(value).toLowerCase();
  return candidate === "success" || candidate === "error" ? candidate : "";
}

function buildReturnTo(params: {
  q: string;
  country: string;
  category: string;
  status: string;
  businessStatus: string;
}) {
  const searchParams = new URLSearchParams();
  if (params.q) searchParams.set("q", params.q);
  if (params.country) searchParams.set("country", params.country);
  if (params.category) searchParams.set("category", params.category);
  if (params.status) searchParams.set("status", params.status);
  if (params.businessStatus) {
    searchParams.set("businessStatus", params.businessStatus);
  }
  const queryString = searchParams.toString();
  return queryString ? `/admin/assets?${queryString}` : "/admin/assets";
}

export default async function AdminAssetsPage({
  searchParams,
}: {
  searchParams: AdminAssetsSearchParams;
}) {
  try {
    await requireManagerDemoUser();
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return (
        <ManagerAccessState
          title="Manager access required"
          description="Select an active Platform Manager demo identity from the header to moderate assets."
          actionHref="/admin"
          actionLabel="Back to dashboard"
        />
      );
    }

    throw error;
  }

  const {
    q: rawQuery,
    country: rawCountry,
    category: rawCategory,
    status: rawStatus,
    businessStatus: rawBusinessStatus,
    notice: rawNotice,
    noticeTone: rawNoticeTone,
  } = await searchParams;

  const query = trimParam(rawQuery);
  const status = normalizeStatus(rawStatus);
  const countryParam = trimParam(rawCountry);
  const categoryParam = trimParam(rawCategory);
  const businessStatusParam = trimParam(rawBusinessStatus);
  const notice = trimParam(rawNotice);
  const noticeTone = normalizeTone(rawNoticeTone);

  const baseAssets = await db.asset.findMany({
    select: {
      country: true,
      category: true,
    },
  });

  const countryOptions = buildCanonicalCountryOptions(
    baseAssets.map((asset) => asset.country),
  );
  const categoryOptionGroup = buildNormalizedFilterOptions(
    baseAssets.map((asset) => asset.category),
  );
  const operatingStatusOptions = SELLER_OPERATING_STATUSES.map((value) => ({
    value,
    label: value,
  }));
  const country = sanitizeOptionValue(countryParam, countryOptions);
  const category = sanitizeOptionValue(categoryParam, categoryOptionGroup.options);
  const businessStatus = sanitizeOptionValue(
    businessStatusParam,
    operatingStatusOptions,
  );

  const where: Prisma.AssetWhereInput = {};
  const andClauses: Prisma.AssetWhereInput[] = [];

  if (query) {
    andClauses.push({
      OR: [
        {
          title: {
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
          category: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          seller: {
            is: {
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
              ],
            },
          },
        },
      ],
    });
  }

  if (country) {
    andClauses.push({ country });
  }

  if (category) {
    andClauses.push({
      category: {
        in: categoryOptionGroup.valuesByOption.get(category) ?? [category],
      },
    });
  }

  if (status) {
    andClauses.push({ status: status as "DRAFT" | "PUBLISHED" | "SUSPENDED" });
  }

  if (businessStatus) {
    andClauses.push({ businessStatus });
  }

  if (andClauses.length > 0) {
    where.AND = andClauses;
  }

  const assets = await db.asset.findMany({
    where,
    select: adminAssetModerationSelect,
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }, { id: "desc" }],
  });

  const visibleCount = assets.length;
  const hasActiveFilters = Boolean(
    query || country || category || status || businessStatus,
  );
  const returnTo = buildReturnTo({
    q: query,
    country,
    category,
    status,
    businessStatus,
  });

  return (
    <main>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Platform manager"
          title="Asset moderation"
          description="Server-rendered moderation for marketplace assets with denser admin surfaces and unchanged moderation behavior."
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center rounded-full border border-[var(--border)] bg-white px-3.5 py-2 text-sm font-medium text-slate-700">
                {visibleCount} matching assets
              </div>
              <Link
                href="/admin"
                className="inline-flex items-center rounded-full border border-[var(--border)] bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:border-[var(--border-strong)] hover:bg-slate-50"
              >
                Back to dashboard
              </Link>
            </div>
          }
        />

        {notice ? (
          <AdminAssetsFeedback
            tone={noticeTone === "error" ? "error" : "success"}
            message={notice}
          />
        ) : null}

        <AdminAssetsFilters
          query={query}
          country={country}
          category={category}
          status={status}
          businessStatus={businessStatus}
          countries={countryOptions.map((option) => option.value)}
          categories={categoryOptionGroup.options.map((option) => option.value)}
          hasActiveFilters={hasActiveFilters}
        />

        <section className="space-y-4">
          <AdminAssetsList
            assets={assets}
            returnTo={returnTo}
            suspendAction={suspendAdminAssetAction}
            restoreAction={restoreAdminAssetAction}
          />
        </section>
      </div>
    </main>
  );
}
