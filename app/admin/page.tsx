import { Prisma } from "@prisma/client";

import {
  AdminDashboard,
  ManagerAccessState,
  type DashboardMetric,
  type RecentAsset,
  type RecentUser,
} from "@/components/admin";
import {
  AuthorizationError,
  requireManagerDemoUser,
  type ManagerDemoUser,
} from "@/lib/authz";
import { db } from "@/lib/db";

const recentAssetSelect = {
  id: true,
  title: true,
  country: true,
  category: true,
  status: true,
  updatedAt: true,
  seller: {
    select: {
      company: true,
    },
  },
} satisfies Prisma.AssetSelect;

const recentUserSelect = {
  id: true,
  name: true,
  company: true,
  role: true,
  country: true,
  status: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

async function loadDashboardData(): Promise<{
  metrics: DashboardMetric[];
  recentAssets: RecentAsset[];
  recentUsers: RecentUser[];
}> {
  const [
    activeBuyers,
    activeSellers,
    publishedAssets,
    suspendedUsers,
    suspendedAssets,
    recentAssets,
    recentUsers,
  ] = await db.$transaction([
    db.user.count({
      where: {
        role: "BUYER",
        status: "ACTIVE",
      },
    }),
    db.user.count({
      where: {
        role: "SELLER",
        status: "ACTIVE",
      },
    }),
    db.asset.count({
      where: {
        status: "PUBLISHED",
      },
    }),
    db.user.count({
      where: {
        status: "SUSPENDED",
      },
    }),
    db.asset.count({
      where: {
        status: "SUSPENDED",
      },
    }),
    db.asset.findMany({
      take: 5,
      select: recentAssetSelect,
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }, { id: "desc" }],
    }),
    db.user.findMany({
      take: 5,
      select: recentUserSelect,
      orderBy: [{ createdAt: "desc" }, { updatedAt: "desc" }, { id: "desc" }],
    }),
  ]);

  return {
    metrics: [
      {
        label: "Active buyers",
        value: activeBuyers,
        tone: "text-emerald-700",
      },
      {
        label: "Active sellers",
        value: activeSellers,
        tone: "text-teal-700",
      },
      {
        label: "Published assets",
        value: publishedAssets,
        tone: "text-stone-950",
      },
      {
        label: "Suspended users",
        value: suspendedUsers,
        tone: "text-rose-700",
      },
      {
        label: "Suspended assets",
        value: suspendedAssets,
        tone: "text-amber-700",
      },
    ],
    recentAssets,
    recentUsers,
  };
}

export default async function AdminPage() {
  let currentUser: ManagerDemoUser;

  try {
    currentUser = await requireManagerDemoUser();
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return <ManagerAccessState />;
    }

    throw error;
  }

  const { metrics, recentAssets, recentUsers } = await loadDashboardData();

  return (
    <AdminDashboard
      company={currentUser.company}
      metrics={metrics}
      recentAssets={recentAssets}
      recentUsers={recentUsers}
    />
  );
}
