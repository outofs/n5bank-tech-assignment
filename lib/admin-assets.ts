import { Prisma } from "@prisma/client";

export const adminAssetModerationSelect = {
  id: true,
  title: true,
  country: true,
  category: true,
  askingPrice: true,
  currency: true,
  status: true,
  updatedAt: true,
  seller: {
    select: {
      id: true,
      name: true,
      company: true,
      status: true,
    },
  },
} satisfies Prisma.AssetSelect;

export type AdminAssetRow = Prisma.AssetGetPayload<{
  select: typeof adminAssetModerationSelect;
}>;

export const ADMIN_ASSET_STATUSES = ["DRAFT", "PUBLISHED", "SUSPENDED"] as const;

export function uniqueSorted(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter(Boolean) as string[])).sort((a, b) =>
    a.localeCompare(b),
  );
}
