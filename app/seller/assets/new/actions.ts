"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireSellerDemoUser } from "@/lib/authz";
import { db } from "@/lib/db";
import {
  emptySellerAssetCreateState,
  mapSellerAssetCreateErrors,
  sellerAssetCreateSchema,
  type SellerAssetCreateState,
} from "@/lib/seller-asset-form";

export async function createSellerAssetAction(
  state: SellerAssetCreateState = emptySellerAssetCreateState,
  formData: FormData,
): Promise<SellerAssetCreateState> {
  void state;

  const currentUser = await requireSellerDemoUser();

  const parsed = sellerAssetCreateSchema.safeParse({
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
    return mapSellerAssetCreateErrors(parsed.error);
  }

  const status =
    parsed.data.intent === "publish" ? "PUBLISHED" : "DRAFT";

  const asset = await db.asset.create({
    data: {
      sellerId: currentUser.id,
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
      status,
    },
    select: {
      id: true,
    },
  });

  revalidatePath("/seller/assets");
  revalidatePath("/marketplace");
  revalidatePath(`/marketplace/${asset.id}`);

  redirect(`/seller/assets?created=1&status=${status.toLowerCase()}`);
}
