import Link from "next/link";

import { StatusBadge } from "@/components/shared";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { MarketplaceListAsset } from "@/lib/marketplace/types";

function truncateDescription(description: string) {
  return description.length > 160
    ? `${description.slice(0, 157).trimEnd()}...`
    : description;
}

export type AssetCardProps = {
  href: string;
  asset: MarketplaceListAsset;
};

export function AssetCard({ href, asset }: AssetCardProps) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50 sm:p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <StatusBadge status="PUBLISHED" />
            <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-600">
              {asset.country}
            </span>
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-stone-950">
            {asset.title}
          </h2>
        </div>

        <span className="text-sm font-semibold text-stone-400 transition group-hover:text-stone-700">
          View
        </span>
      </div>

      <div className="mt-4 flex flex-1 flex-col space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-stone-600">
          <span>{asset.category}</span>
          <span className="text-stone-300">|</span>
          <span>{asset.businessStatus}</span>
          {asset.licenseType ? (
            <>
              <span className="text-stone-300">|</span>
              <span>{asset.licenseType}</span>
            </>
          ) : null}
        </div>

        <div className="flex items-baseline justify-between gap-4 border-t border-stone-200 pt-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
              Asking price
            </p>
            <p className="mt-1 text-xl font-semibold text-stone-950">
              {formatCurrency(asset.askingPrice, asset.currency)}
            </p>
          </div>
          <p className="text-right text-xs uppercase tracking-[0.18em] text-stone-500">
            Created {formatDate(asset.createdAt)}
          </p>
        </div>

        <p className="min-h-12 text-sm leading-6 text-stone-600">
          {truncateDescription(asset.description)}
        </p>
      </div>
    </Link>
  );
}
