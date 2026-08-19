import type { Prisma } from "@prisma/client";

export type RecentAsset = Prisma.AssetGetPayload<{
  select: {
    id: true;
    title: true;
    country: true;
    category: true;
    status: true;
    updatedAt: true;
    seller: {
      select: {
        company: true;
      };
    };
  };
}>;

export type RecentUser = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    company: true;
    role: true;
    country: true;
    status: true;
    createdAt: true;
  };
}>;

export type DashboardMetric = {
  label: string;
  value: number;
  tone: string;
};
