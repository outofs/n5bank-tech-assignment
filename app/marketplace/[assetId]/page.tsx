import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { ContactRequestForm } from "@/components/contact/contact-request-form";
import { AssetDetail, SmartMatchPanel } from "@/components/marketplace";
import { PageHeader } from "@/components/shared";
import { AuthorizationError, requireBuyerDemoUser } from "@/lib/authz";
import { db } from "@/lib/db";
import { marketplaceDetailAssetSelect } from "@/lib/marketplace/types";
import {
  calculateSmartMatchScore,
  hasSmartMatchPreferences,
} from "@/lib/smart-match";

import { createBuyerAssetContactRequestAction } from "./contact-request-actions";

const assetIdSchema = z.string().trim().min(1);

export default async function MarketplaceAssetPage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const currentUser = await (async () => {
    try {
      return await requireBuyerDemoUser();
    } catch (error) {
      if (error instanceof AuthorizationError) {
        return null;
      }

      throw error;
    }
  })();

  if (!currentUser) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Buyer marketplace"
          title="Buyer access required"
          description="Select an active Buyer demo identity from the header to view asset details."
          actions={
            <Link
              href="/marketplace"
              className="inline-flex items-center rounded-full border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
            >
              Back to Marketplace
            </Link>
          }
        />
      </main>
    );
  }

  const { assetId: rawAssetId } = await params;
  const parsedAssetId = assetIdSchema.safeParse(rawAssetId);

  if (!parsedAssetId.success) {
    notFound();
  }

  const asset = await db.asset.findFirst({
    where: {
      id: parsedAssetId.data,
      status: "PUBLISHED",
      seller: {
        status: "ACTIVE",
      },
    },
    select: marketplaceDetailAssetSelect,
  });

  if (!asset) {
    notFound();
  }

  const smartMatch = calculateSmartMatchScore(currentUser.buyerProfile, asset);
  const canShowSmartMatch = hasSmartMatchPreferences(currentUser.buyerProfile);

  return (
    <main className="bg-stone-50/80">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Buyer marketplace"
          title={asset.title}
          description={`${asset.country} | ${asset.category} | ${asset.assetType}`}
          actions={
            <Link
              href="/marketplace"
              className="inline-flex items-center rounded-full border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
            >
              Back to Marketplace
            </Link>
          }
        />

        <AssetDetail
          asset={asset}
          smartMatchPanel={
            <SmartMatchPanel
              match={canShowSmartMatch ? smartMatch : null}
              ctaHref="/profile/edit"
            />
          }
          contactPanel={
            <ContactRequestForm
              action={createBuyerAssetContactRequestAction}
              recipientName={asset.seller.name}
              recipientCompany={asset.seller.company}
              recipientRoleLabel="Active seller on the N5Deal marketplace."
              contextLabel="Asset"
              contextValue={asset.title}
              contextFieldName="assetId"
              contextFieldValue={asset.id}
              submitLabel="Contact seller"
              tone="dark"
            />
          }
        />
      </div>
    </main>
  );
}
