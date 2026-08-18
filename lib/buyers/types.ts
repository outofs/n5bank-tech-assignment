import type { Prisma } from "@prisma/client";

export const buyerDirectoryFilterOptionSelect = {
  country: true,
  buyerProfile: {
    select: {
      preferredCategories: true,
    },
  },
} satisfies Prisma.UserSelect;

export type BuyerDirectoryFilterOptionUser = Prisma.UserGetPayload<{
  select: typeof buyerDirectoryFilterOptionSelect;
}>;

export const buyerDirectoryCardSelect = {
  id: true,
  name: true,
  company: true,
  country: true,
  buyerProfile: {
    select: {
      minInvestment: true,
      maxInvestment: true,
    },
  },
} satisfies Prisma.UserSelect;

type BuyerDirectoryCardUserRow = Prisma.UserGetPayload<{
  select: typeof buyerDirectoryCardSelect;
}>;

export type BuyerDirectoryCardBuyer = BuyerDirectoryCardUserRow & {
  buyerProfile: NonNullable<BuyerDirectoryCardUserRow["buyerProfile"]>;
};

export const buyerDetailSelect = {
  id: true,
  name: true,
  company: true,
  country: true,
  updatedAt: true,
  buyerProfile: {
    select: {
      bio: true,
      investmentThesis: true,
      minInvestment: true,
      maxInvestment: true,
      preferredCountries: true,
      preferredCategories: true,
    },
  },
} satisfies Prisma.UserSelect;

type BuyerDetailUserRow = Prisma.UserGetPayload<{
  select: typeof buyerDetailSelect;
}>;

export type BuyerDetailBuyer = BuyerDetailUserRow & {
  buyerProfile: NonNullable<BuyerDetailUserRow["buyerProfile"]>;
};

export function hasBuyerProfile<T extends { buyerProfile: unknown | null }>(
  buyer: T,
): buyer is T & { buyerProfile: NonNullable<T["buyerProfile"]> } {
  return buyer.buyerProfile !== null;
}
