import type { ReactNode } from "react";

import { StatusBadge } from "@/components/shared";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { MarketplaceDetailAsset } from "@/lib/marketplace/types";

export type AssetDetailProps = {
  asset: MarketplaceDetailAsset;
  contactPanel: ReactNode;
};

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-stone-900">{value}</p>
    </div>
  );
}

export function AssetDetail({ asset, contactPanel }: AssetDetailProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.9fr)]">
      <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status="PUBLISHED" />
          <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-600">
            {asset.country}
          </span>
          <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-600">
            {asset.category}
          </span>
          <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-600">
            {asset.assetType}
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
              {asset.title}
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-stone-600 sm:text-base">
              {asset.description}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 sm:min-w-[220px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
              Asking price
            </p>
            <p className="mt-1 text-2xl font-semibold text-stone-950">
              {formatCurrency(asset.askingPrice, asset.currency)}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-stone-500">
              Created {formatDate(asset.createdAt)}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <DetailRow label="Business status" value={asset.businessStatus} />
            <DetailRow label="Country" value={asset.country} />
            <DetailRow label="Category" value={asset.category} />
            <DetailRow label="Asset type" value={asset.assetType} />
            {asset.employees !== null ? (
              <DetailRow
                label="Employees"
                value={asset.employees.toLocaleString("en-US")}
              />
            ) : null}
            {asset.foundedYear !== null ? (
              <DetailRow label="Founded year" value={String(asset.foundedYear)} />
            ) : null}
            {asset.licenseType ? (
              <DetailRow label="License type" value={asset.licenseType} />
            ) : null}
          </div>
        </div>
      </section>

      <aside className="space-y-4">
        <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
            Seller summary
          </p>
          <div className="mt-3 space-y-2">
            <p className="text-xl font-semibold tracking-tight text-stone-950">
              {asset.seller.name}
            </p>
            <p className="text-sm text-stone-600">{asset.seller.company}</p>
            <p className="text-sm text-stone-600">
              Active seller on the N5Deal marketplace.
            </p>
          </div>
        </section>

        {contactPanel}

        <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
            Marketplace note
          </p>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            This asset is visible because it is published and the seller is
            active. Draft or suspended records never render here.
          </p>
        </section>
      </aside>
    </div>
  );
}
