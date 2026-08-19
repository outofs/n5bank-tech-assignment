"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireManagerDemoUser } from "@/lib/authz";
import { db } from "@/lib/db";

const targetUserIdSchema = z.string().trim().min(1);
const returnToSchema = z.string().trim().startsWith("/admin/users");

function buildRedirectUrl(returnTo: string, tone: "success" | "error", message: string) {
  const url = new URL(returnTo, "http://admin.local");
  url.searchParams.set("noticeTone", tone);
  url.searchParams.set("notice", message);
  return `${url.pathname}${url.search}`;
}

async function updateUserStatus(
  nextStatus: "ACTIVE" | "SUSPENDED",
  formData: FormData,
) {
  const currentManager = await requireManagerDemoUser();

  const parsed = z
    .object({
      targetUserId: targetUserIdSchema,
      returnTo: returnToSchema.default("/admin/users"),
    })
    .safeParse({
      targetUserId: formData.get("targetUserId"),
      returnTo: formData.get("returnTo"),
    });

  if (!parsed.success) {
    redirect(buildRedirectUrl("/admin/users", "error", "Invalid moderation request."));
  }

  const targetUser = await db.user.findFirst({
    where: {
      id: parsed.data.targetUserId,
    },
    select: {
      id: true,
      name: true,
      role: true,
      status: true,
    },
  });

  if (!targetUser) {
    redirect(
      buildRedirectUrl(parsed.data.returnTo, "error", "User not found or unavailable."),
    );
  }

  if (targetUser.role === "MANAGER") {
    redirect(
      buildRedirectUrl(
        parsed.data.returnTo,
        "error",
        "Manager users cannot be moderated from this page.",
      ),
    );
  }

  if (targetUser.id === currentManager.id) {
    redirect(
      buildRedirectUrl(
        parsed.data.returnTo,
        "error",
        "You cannot modify your own account.",
      ),
    );
  }

  if (targetUser.status === nextStatus) {
    redirect(
      buildRedirectUrl(
        parsed.data.returnTo,
        "error",
        `This user is already ${nextStatus.toLowerCase()}.`,
      ),
    );
  }

  if (nextStatus === "SUSPENDED" && targetUser.status !== "ACTIVE") {
    redirect(
      buildRedirectUrl(
        parsed.data.returnTo,
        "error",
        "Only active users can be suspended.",
      ),
    );
  }

  if (nextStatus === "ACTIVE" && targetUser.status !== "SUSPENDED") {
    redirect(
      buildRedirectUrl(
        parsed.data.returnTo,
        "error",
        "Only suspended users can be reactivated.",
      ),
    );
  }

  await db.user.update({
    where: { id: targetUser.id },
    data: { status: nextStatus },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/users");
  revalidatePath("/buyers");
  revalidatePath("/marketplace");

  redirect(
    buildRedirectUrl(
      parsed.data.returnTo,
      "success",
      `${targetUser.name} ${nextStatus === "SUSPENDED" ? "suspended" : "reactivated"} successfully.`,
    ),
  );
}

export async function suspendAdminUserAction(formData: FormData) {
  return updateUserStatus("SUSPENDED", formData);
}

export async function reactivateAdminUserAction(formData: FormData) {
  return updateUserStatus("ACTIVE", formData);
}
