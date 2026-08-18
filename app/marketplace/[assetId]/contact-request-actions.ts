"use server";

import { requireBuyerDemoUser } from "@/lib/authz";
import {
  buyerAssetContactRequestSchema,
  emptyContactRequestFormState,
  mapBuyerAssetContactRequestErrors,
  type ContactRequestFormState,
} from "@/lib/contact-request";
import { db } from "@/lib/db";

export async function createBuyerAssetContactRequestAction(
  state: ContactRequestFormState = emptyContactRequestFormState,
  formData: FormData,
): Promise<ContactRequestFormState> {
  void state;

  const currentUser = await requireBuyerDemoUser();

  const parsed = buyerAssetContactRequestSchema.safeParse({
    assetId: formData.get("assetId"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return mapBuyerAssetContactRequestErrors(parsed.error);
  }

  const asset = await db.asset.findFirst({
    where: {
      id: parsed.data.assetId,
      status: "PUBLISHED",
      seller: {
        status: "ACTIVE",
      },
    },
    select: {
      id: true,
      title: true,
      sellerId: true,
      seller: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!asset) {
    return {
      errors: {
        form: "This asset is no longer available for contact.",
      },
      successMessage: "",
    };
  }

  if (asset.sellerId === currentUser.id) {
    return {
      errors: {
        form: "You cannot contact yourself.",
      },
      successMessage: "",
    };
  }

  const duplicateRequest = await db.contactRequest.findFirst({
    where: {
      senderId: currentUser.id,
      recipientId: asset.sellerId,
      assetId: asset.id,
      message: parsed.data.message,
      status: "PENDING",
    },
    select: {
      id: true,
    },
  });

  if (duplicateRequest) {
    return {
      errors: {
        form: "An identical pending contact request already exists for this asset.",
      },
      successMessage: "",
    };
  }

  await db.contactRequest.create({
    data: {
      senderId: currentUser.id,
      recipientId: asset.sellerId,
      assetId: asset.id,
      message: parsed.data.message,
    },
  });

  return {
    errors: {},
    successMessage: `Contact request sent to ${asset.seller.name}.`,
  };
}
