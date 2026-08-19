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
import { adminAssetModerationSelect, uniqueSorted } from "@/lib/admin-assets";

type AdminAssetsSearchParams = Promise<{
  q?: string | string[];
  country?: string | string[];
  category?: string | string[];
  status?: string | string[];
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
}) {
  const searchParams = new URLSearchParams();
  if (params.q) searchParams.set("q", params.q);
  if (params.country) searchParams.set("country", params.country);
  if (params.category) searchParams.set("category", params.category);
  if (params.status) searchParams.set("status", params.status);
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
    notice: rawNotice,
    noticeTone: rawNoticeTone,
  } = await searchParams;

  const query = trimParam(rawQuery);
  const status = normalizeStatus(rawStatus);
  const countryParam = trimParam(rawCountry);
  const categoryParam = trimParam(rawCategory);
  const notice = trimParam(rawNotice);
  const noticeTone = normalizeTone(rawNoticeTone);

  const baseAssets = await db.asset.findMany({
    select: {
      country: true,
      category: true,
    },
  });

  const countries = uniqueSorted(baseAssets.map((asset) => asset.country));
  const categories = uniqueSorted(baseAssets.map((asset) => asset.category));
  const country = countries.includes(countryParam) ? countryParam : "";
  const category = categories.includes(categoryParam) ? categoryParam : "";

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
    andClauses.push({ category });
  }

  if (status) {
    andClauses.push({ status: status as "DRAFT" | "PUBLISHED" | "SUSPENDED" });
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
  const hasActiveFilters = Boolean(query || country || category || status);
  const returnTo = buildReturnTo({ q: query, country, category, status });

  return (
    <main className="bg-stone-50/80">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Platform manager"
          title="Asset moderation"
          description="Server-rendered moderation for marketplace assets with seller context and status transitions controlled by the manager session."
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700">
                {visibleCount} matching assets
              </div>
              <Link
                href="/admin"
                className="inline-flex items-center rounded-full border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
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
          countries={countries}
          categories={categories}
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
