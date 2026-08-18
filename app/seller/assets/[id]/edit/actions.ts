"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { AuthorizationError, requireSellerOwnsAsset } from "@/lib/authz";
import { db } from "@/lib/db";
import {
  emptySellerAssetCreateState,
  mapSellerAssetUpdateErrors,
  resolveSellerAssetStatusTransition,
  sellerAssetUpdateSchema,
  type SellerAssetCreateState,
} from "@/lib/seller-asset-form";

const assetIdSchema = z.string().trim().min(1);

export async function updateSellerAssetAction(
  state: SellerAssetCreateState = emptySellerAssetCreateState,
  formData: FormData,
): Promise<SellerAssetCreateState> {
  void state;

  const parsed = sellerAssetUpdateSchema.safeParse({
    assetId: formData.get("assetId"),
    title: formData.get("title"),
    description: formData.get("description"),
    country: formData.get("country"),
    category: formData.get("category"),
    assetType: formData.get("assetType"),
    businessStatus: formData.get("businessStatus"),
    askingPrice: formData.get("askingPrice"),
    currency: formData.get("currency"),
    employees: formData.get("employees"),
    foundedYear: formData.get("foundedYear"),
    licenseType: formData.get("licenseType"),
    intent: formData.get("intent"),
  });

  if (!parsed.success) {
    return mapSellerAssetUpdateErrors(parsed.error);
  }

  const assetIdResult = assetIdSchema.safeParse(parsed.data.assetId);
  if (!assetIdResult.success) {
    notFound();
  }

  try {
    await requireSellerOwnsAsset(assetIdResult.data);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      notFound();
    }

    throw error;
  }

  const currentAsset = await db.asset.findUnique({
    where: { id: assetIdResult.data },
    select: {
      id: true,
      status: true,
    },
  });

  if (!currentAsset) {
    notFound();
  }

  const nextStatus = resolveSellerAssetStatusTransition({
    currentStatus: currentAsset.status,
    intent: parsed.data.intent,
  });

  if (!nextStatus) {
    return {
      errors: {
        form: "Suspended assets cannot be published or restored by the seller.",
      },
    };
  }

  await db.asset.update({
    where: { id: currentAsset.id },
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      country: parsed.data.country,
      category: parsed.data.category,
      assetType: parsed.data.assetType,
      businessStatus: parsed.data.businessStatus,
      askingPrice: new Prisma.Decimal(parsed.data.askingPrice),
      currency: parsed.data.currency,
      employees: parsed.data.employees,
      foundedYear: parsed.data.foundedYear,
      licenseType: parsed.data.licenseType,
      status: nextStatus,
    },
  });

  revalidatePath("/seller/assets");
  revalidatePath(`/seller/assets/${currentAsset.id}/edit`);
  revalidatePath("/marketplace");
  revalidatePath(`/marketplace/${currentAsset.id}`);

  redirect(
    `/seller/assets/${currentAsset.id}/edit?updated=1&status=${nextStatus.toLowerCase()}`,
  );
}
