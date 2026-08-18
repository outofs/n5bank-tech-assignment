import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { AssetDetail } from "@/components/marketplace";
import { PageHeader } from "@/components/shared";
import { AuthorizationError, requireBuyerDemoUser } from "@/lib/authz";
import { db } from "@/lib/db";

const assetIdSchema = z.string().trim().min(1);

export default async function MarketplaceAssetPage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  try {
    await requireBuyerDemoUser();
  } catch (error) {
    if (error instanceof AuthorizationError) {
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

    throw error;
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
    select: {
      id: true,
      title: true,
      description: true,
      country: true,
      category: true,
      assetType: true,
      businessStatus: true,
      askingPrice: true,
      currency: true,
      employees: true,
      foundedYear: true,
      licenseType: true,
      createdAt: true,
      seller: {
        select: {
          name: true,
          company: true,
        },
      },
    },
  });

  if (!asset) {
    notFound();
  }

  return (
    <main className="bg-stone-50/80">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Buyer marketplace"
          title={asset.title}
          description={`${asset.country} · ${asset.category} · ${asset.assetType}`}
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
          title={asset.title}
          askingPrice={asset.askingPrice}
          currency={asset.currency}
          country={asset.country}
          category={asset.category}
          assetType={asset.assetType}
          businessStatus={asset.businessStatus}
          description={asset.description}
          employees={asset.employees}
          foundedYear={asset.foundedYear}
          licenseType={asset.licenseType}
          createdAt={asset.createdAt}
          seller={{
            name: asset.seller.name,
            company: asset.seller.company,
          }}
        />
      </div>
    </main>
  );
}
