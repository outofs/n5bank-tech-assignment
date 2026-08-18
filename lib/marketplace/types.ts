import type { Prisma } from "@prisma/client";

export const marketplaceFilterOptionSelect = {
  country: true,
  category: true,
  businessStatus: true,
} satisfies Prisma.AssetSelect;

export type MarketplaceFilterOptionAsset = Prisma.AssetGetPayload<{
  select: typeof marketplaceFilterOptionSelect;
}>;

export const marketplaceListAssetSelect = {
  id: true,
  title: true,
  country: true,
  category: true,
  askingPrice: true,
  currency: true,
  businessStatus: true,
  licenseType: true,
  description: true,
  createdAt: true,
} satisfies Prisma.AssetSelect;

export type MarketplaceListAsset = Prisma.AssetGetPayload<{
  select: typeof marketplaceListAssetSelect;
}>;

export const marketplaceDetailAssetSelect = {
  id: true,
  title: true,
  description: true,
  country: true,
  category: true,
  assetType: true,
  businessStatus: true,
  askingPrice: true,
  currency: true,
  employees: true,
  foundedYear: true,
  licenseType: true,
  createdAt: true,
  seller: {
    select: {
      name: true,
      company: true,
    },
  },
} satisfies Prisma.AssetSelect;

export type MarketplaceDetailAsset = Prisma.AssetGetPayload<{
  select: typeof marketplaceDetailAssetSelect;
}>;
