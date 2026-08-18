import type { Prisma } from "@prisma/client";

export const contactRequestMessagesSelect = {
  id: true,
  senderId: true,
  recipientId: true,
  assetId: true,
  message: true,
  status: true,
  createdAt: true,
  sender: {
    select: {
      id: true,
      name: true,
      company: true,
    },
  },
  recipient: {
    select: {
      id: true,
      name: true,
      company: true,
    },
  },
  asset: {
    select: {
      id: true,
      title: true,
      status: true,
      sellerId: true,
      seller: {
        select: {
          status: true,
        },
      },
    },
  },
} satisfies Prisma.ContactRequestSelect;

export type ContactRequestMessageRow = Prisma.ContactRequestGetPayload<{
  select: typeof contactRequestMessagesSelect;
}>;

export type ContactRequestMessageWithAsset = ContactRequestMessageRow & {
  asset: NonNullable<ContactRequestMessageRow["asset"]>;
};

export function hasAssetContext(
  request: ContactRequestMessageRow,
): request is ContactRequestMessageWithAsset {
  return request.asset !== null;
}

export function isPublicAssetContext(asset: ContactRequestMessageWithAsset["asset"]) {
  return asset.status === "PUBLISHED" && asset.seller.status === "ACTIVE";
}
