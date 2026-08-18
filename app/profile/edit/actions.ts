"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireBuyerDemoUser } from "@/lib/authz";
import { db } from "@/lib/db";
import {
  buyerProfileEditSchema,
  emptyBuyerProfileEditState,
  mapBuyerProfileEditErrors,
  type BuyerProfileEditState,
} from "@/lib/buyer-profile-form";

export async function updateBuyerProfileAction(
  state: BuyerProfileEditState = emptyBuyerProfileEditState,
  formData: FormData,
): Promise<BuyerProfileEditState> {
  void state;

  const currentUser = await requireBuyerDemoUser();

  if (!currentUser.buyerProfile) {
    return {
      errors: {
        form: "The selected Buyer does not have a profile to edit.",
      },
    };
  }

  const parsed = buyerProfileEditSchema.safeParse({
    name: formData.get("name"),
    company: formData.get("company"),
    country: formData.get("country"),
    bio: formData.get("bio"),
    investmentThesis: formData.get("investmentThesis"),
    minInvestment: formData.get("minInvestment"),
    maxInvestment: formData.get("maxInvestment"),
    preferredCountries: formData.get("preferredCountries"),
    preferredCategories: formData.get("preferredCategories"),
  });

  if (!parsed.success) {
    return mapBuyerProfileEditErrors(parsed.error);
  }

  await db.$transaction([
    db.user.update({
      where: { id: currentUser.id },
      data: {
        name: parsed.data.name,
        company: parsed.data.company,
        country: parsed.data.country,
      },
    }),
    db.buyerProfile.update({
      where: { userId: currentUser.id },
      data: {
        bio: parsed.data.bio,
        investmentThesis: parsed.data.investmentThesis,
        minInvestment: new Prisma.Decimal(parsed.data.minInvestment),
        maxInvestment: new Prisma.Decimal(parsed.data.maxInvestment),
        preferredCountries: parsed.data.preferredCountries,
        preferredCategories: parsed.data.preferredCategories,
      },
    }),
  ]);

  revalidatePath("/profile");
  revalidatePath("/profile/edit");
  revalidatePath("/");

  redirect("/profile?saved=1");
}
