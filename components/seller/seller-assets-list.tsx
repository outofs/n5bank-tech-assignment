import Link from "next/link";

import { EmptyState } from "@/components/shared";
import {
  SellerAssetCard,
  type SellerAssetCardProps,
} from "./seller-asset-card";

type SellerAssetsListProps = {
  assets: SellerAssetCardProps[];
  createHref?: string;
};

export function SellerAssetsList({
  assets,
  createHref = "/seller/assets/new",
}: SellerAssetsListProps) {
  if (assets.length === 0) {
    return (
      <EmptyState
        title="No assets yet"
        description="This Seller does not own any seeded assets yet. Create the first draft to start building a portfolio."
        action={
          <Link
            href={createHref}
            className="inline-flex items-center rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
          >
            Create asset
          </Link>
        }
      />
    );
  }

  return (
    <section className="grid gap-4">
      <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 text-sm text-stone-600">
          <span className="font-medium text-stone-800">DRAFT</span>
          <span className="text-stone-300">hidden from buyers</span>
          <span className="text-stone-300">|</span>
          <span className="font-medium text-stone-800">PUBLISHED</span>
          <span className="text-stone-300">visible in the marketplace</span>
          <span className="text-stone-300">|</span>
          <span className="font-medium text-stone-800">SUSPENDED</span>
          <span className="text-stone-300">under review</span>
        </div>
      </section>

      {assets.map((asset) => (
        <SellerAssetCard
          key={asset.id}
          {...asset}
          editHref={`/seller/assets/${asset.id}/edit`}
        />
      ))}
    </section>
  );
}
