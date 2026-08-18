import Link from "next/link";

import { PageHeader } from "@/components/shared";
import {
  SellerAccessState,
  SellerAssetsList,
  SellerFeedbackBanner,
} from "@/components/seller";
import {
  AuthorizationError,
  requireSellerDemoUser,
  type SellerDemoUser,
} from "@/lib/authz";
import { db } from "@/lib/db";

type SellerAssetsSearchParams = Promise<{
  created?: string | string[];
  status?: string | string[];
}>;

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SellerAssetsPage({
  searchParams,
}: {
  searchParams: SellerAssetsSearchParams;
}) {
  let currentUser: SellerDemoUser;

  try {
    currentUser = await requireSellerDemoUser();
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return (
        <SellerAccessState
          title="Seller access required"
          description="Select an active Seller demo identity from the header to view owned assets."
          actionHref="/"
          actionLabel="Back to home"
        />
      );
    }

    throw error;
  }

  const assets = await db.asset.findMany({
    where: {
      sellerId: currentUser.id,
    },
    select: {
      id: true,
      title: true,
      country: true,
      category: true,
      askingPrice: true,
      currency: true,
      status: true,
      updatedAt: true,
    },
    orderBy: [
      {
        updatedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  const { created: rawCreated, status: rawStatus } = await searchParams;
  const assetCount = assets.length;
  const created = firstParam(rawCreated);
  const status = firstParam(rawStatus);
  const successMessage =
    created === "1" && status === "published"
      ? "Published asset created successfully."
      : created === "1" && status === "draft"
        ? "Draft saved successfully."
        : "";

  return (
    <main className="bg-stone-50/80">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <SellerFeedbackBanner message={successMessage} />

        <PageHeader
          eyebrow="Seller assets"
          title="My assets"
          description="Assets owned by the active Seller demo identity, ordered by the most recent update."
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700">
                {assetCount} owned assets
              </div>
              <Link
                href="/seller/assets/new"
                className="inline-flex items-center rounded-full border border-stone-950 bg-stone-950 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-stone-800"
              >
                Create asset
              </Link>
            </div>
          }
        />

        <SellerAssetsList assets={assets} />
      </div>
    </main>
  );
}
