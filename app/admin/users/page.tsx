import { Prisma } from "@prisma/client";
import Link from "next/link";

import {
  AdminUsersFeedback,
  AdminUsersFilters,
  AdminUsersList,
  ManagerAccessState,
} from "@/components/admin";
import { PageHeader } from "@/components/shared";
import { AuthorizationError, requireManagerDemoUser } from "@/lib/authz";
import { db } from "@/lib/db";
import { adminModerationUserSelect, uniqueSorted } from "@/lib/admin-users";

import {
  reactivateAdminUserAction,
  suspendAdminUserAction,
} from "./actions";

type AdminUsersSearchParams = Promise<{
  q?: string | string[];
  role?: string | string[];
  country?: string | string[];
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

function normalizeRole(value: string | string[] | undefined) {
  const candidate = trimParam(value).toUpperCase();
  return candidate === "BUYER" || candidate === "SELLER" ? candidate : "";
}

function normalizeStatus(value: string | string[] | undefined) {
  const candidate = trimParam(value).toUpperCase();
  return candidate === "ACTIVE" || candidate === "SUSPENDED" ? candidate : "";
}

function normalizeTone(value: string | string[] | undefined) {
  const candidate = trimParam(value).toLowerCase();
  return candidate === "success" || candidate === "error" ? candidate : "";
}

function buildReturnTo(params: {
  q: string;
  role: string;
  country: string;
  status: string;
}) {
  const searchParams = new URLSearchParams();
  if (params.q) searchParams.set("q", params.q);
  if (params.role) searchParams.set("role", params.role);
  if (params.country) searchParams.set("country", params.country);
  if (params.status) searchParams.set("status", params.status);
  const queryString = searchParams.toString();
  return queryString ? `/admin/users?${queryString}` : "/admin/users";
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: AdminUsersSearchParams;
}) {
  try {
    await requireManagerDemoUser();
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return (
        <ManagerAccessState
          title="Manager access required"
          description="Select an active Platform Manager demo identity from the header to moderate users."
          actionHref="/admin"
          actionLabel="Back to dashboard"
        />
      );
    }

    throw error;
  }

  const {
    q: rawQuery,
    role: rawRole,
    country: rawCountry,
    status: rawStatus,
    notice: rawNotice,
    noticeTone: rawNoticeTone,
  } = await searchParams;

  const query = trimParam(rawQuery);
  const role = normalizeRole(rawRole);
  const status = normalizeStatus(rawStatus);
  const notice = trimParam(rawNotice);
  const noticeTone = normalizeTone(rawNoticeTone);

  const baseUsers = await db.user.findMany({
    where: {
      role: {
        in: ["BUYER", "SELLER"],
      },
    },
    select: {
      country: true,
    },
  });

  const countries = uniqueSorted(baseUsers.map((user) => user.country));
  const countryParam = trimParam(rawCountry);
  const country = countries.includes(countryParam) ? countryParam : "";

  const where: Prisma.UserWhereInput = {
    role: {
      in: ["BUYER", "SELLER"],
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
      ],
    });
  }

  if (role) {
    andClauses.push({ role: role as "BUYER" | "SELLER" });
  }

  if (country) {
    andClauses.push({ country });
  }

  if (status) {
    andClauses.push({ status: status as "ACTIVE" | "SUSPENDED" });
  }

  if (andClauses.length > 0) {
    where.AND = andClauses;
  }

  const users = await db.user.findMany({
    where,
    select: adminModerationUserSelect,
    orderBy: [
      { updatedAt: "desc" },
      { createdAt: "desc" },
      { id: "desc" },
    ],
  });

  const visibleCount = users.length;
  const hasActiveFilters = Boolean(query || role || country || status);
  const returnTo = buildReturnTo({ q: query, role, country, status });

  return (
    <main className="bg-stone-50/80">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Platform manager"
          title="User moderation"
          description="Buyer and seller moderation controls loaded server-side from PostgreSQL. Manager accounts are excluded from this list."
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700">
                {visibleCount} matching users
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
          <AdminUsersFeedback
            tone={noticeTone === "error" ? "error" : "success"}
            message={notice}
          />
        ) : null}

        <AdminUsersFilters
          query={query}
          role={role}
          country={country}
          status={status}
          countries={countries}
          hasActiveFilters={hasActiveFilters}
        />

        <section className="space-y-4">
          <AdminUsersList
            users={users}
            returnTo={returnTo}
            suspendAction={suspendAdminUserAction}
            reactivateAction={reactivateAdminUserAction}
          />
        </section>
      </div>
    </main>
  );
}
