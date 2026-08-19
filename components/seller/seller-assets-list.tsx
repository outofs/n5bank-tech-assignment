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
      <section className="rounded-[1.5rem] border border-[var(--border)] bg-white p-4 shadow-[0_30px_60px_-44px_rgba(15,23,42,0.35)]">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[0.72rem] font-semibold text-amber-700">Draft</span>
          <span>Hidden from buyers</span>
          <span className="text-slate-300">|</span>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[0.72rem] font-semibold text-emerald-700">Published</span>
          <span>Visible in marketplace</span>
          <span className="text-slate-300">|</span>
          <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-[0.72rem] font-semibold text-rose-700">Suspended</span>
          <span>Under review</span>
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
