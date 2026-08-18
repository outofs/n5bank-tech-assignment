"use server";

import { requireSellerDemoUser } from "@/lib/authz";
import {
  emptyContactRequestFormState,
  mapSellerBuyerContactRequestErrors,
  sellerBuyerContactRequestSchema,
  type ContactRequestFormState,
} from "@/lib/contact-request";
import { db } from "@/lib/db";

export async function createSellerBuyerContactRequestAction(
  state: ContactRequestFormState = emptyContactRequestFormState,
  formData: FormData,
): Promise<ContactRequestFormState> {
  void state;

  const currentUser = await requireSellerDemoUser();

  const parsed = sellerBuyerContactRequestSchema.safeParse({
    buyerId: formData.get("buyerId"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return mapSellerBuyerContactRequestErrors(parsed.error);
  }

  const buyer = await db.user.findFirst({
    where: {
      id: parsed.data.buyerId,
      role: "BUYER",
      status: "ACTIVE",
      buyerProfile: {
        isNot: null,
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!buyer) {
    return {
      errors: {
        form: "This buyer is no longer available for contact.",
      },
      successMessage: "",
    };
  }

  if (buyer.id === currentUser.id) {
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
      recipientId: buyer.id,
      assetId: null,
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
        form: "An identical pending contact request already exists for this buyer.",
      },
      successMessage: "",
    };
  }

  await db.contactRequest.create({
    data: {
      senderId: currentUser.id,
      recipientId: buyer.id,
      assetId: null,
      message: parsed.data.message,
    },
  });

  return {
    errors: {},
    successMessage: `Contact request sent to ${buyer.name}.`,
  };
}
