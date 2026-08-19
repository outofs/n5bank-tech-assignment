"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireManagerDemoUser } from "@/lib/authz";
import { db } from "@/lib/db";

const targetAssetIdSchema = z.string().trim().min(1);
const returnToSchema = z.string().trim().startsWith("/admin/assets");

function buildRedirectUrl(returnTo: string, tone: "success" | "error", message: string) {
  const url = new URL(returnTo, "http://admin.local");
  url.searchParams.set("noticeTone", tone);
  url.searchParams.set("notice", message);
  return `${url.pathname}${url.search}`;
}

async function updateAssetStatus(
  nextStatus: "SUSPENDED" | "DRAFT",
  formData: FormData,
) {
  await requireManagerDemoUser();

  const parsed = z
    .object({
      targetAssetId: targetAssetIdSchema,
      returnTo: returnToSchema.default("/admin/assets"),
    })
    .safeParse({
      targetAssetId: formData.get("targetAssetId"),
      returnTo: formData.get("returnTo"),
    });

  if (!parsed.success) {
    redirect(buildRedirectUrl("/admin/assets", "error", "Invalid moderation request."));
  }

  const asset = await db.asset.findFirst({
    where: {
      id: parsed.data.targetAssetId,
    },
    select: {
      id: true,
      title: true,
      status: true,
      sellerId: true,
    },
  });

  if (!asset) {
    redirect(
      buildRedirectUrl(parsed.data.returnTo, "error", "Asset not found or unavailable."),
    );
  }

  if (asset.status === nextStatus) {
    redirect(
      buildRedirectUrl(
        parsed.data.returnTo,
        "error",
        `This asset is already ${nextStatus.toLowerCase()}.`,
      ),
    );
  }

  if (nextStatus === "SUSPENDED") {
    if (asset.status === "SUSPENDED") {
      redirect(
        buildRedirectUrl(
          parsed.data.returnTo,
          "error",
          "Suspended assets are already moderated.",
        ),
      );
    }
  }

  if (nextStatus === "DRAFT" && asset.status !== "SUSPENDED") {
    redirect(
      buildRedirectUrl(
        parsed.data.returnTo,
        "error",
        "Only suspended assets can be restored to draft.",
      ),
    );
  }

  await db.asset.update({
    where: { id: asset.id },
    data: {
      status: nextStatus,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/assets");
  revalidatePath("/marketplace");
  revalidatePath(`/marketplace/${asset.id}`);
  revalidatePath("/seller/assets");
  revalidatePath(`/seller/assets/${asset.id}/edit`);

  redirect(
    buildRedirectUrl(
      parsed.data.returnTo,
      "success",
      `${asset.title} ${nextStatus === "SUSPENDED" ? "suspended" : "restored to draft"} successfully.`,
    ),
  );
}

export async function suspendAdminAssetAction(formData: FormData) {
  return updateAssetStatus("SUSPENDED", formData);
}

export async function restoreAdminAssetAction(formData: FormData) {
  return updateAssetStatus("DRAFT", formData);
}
