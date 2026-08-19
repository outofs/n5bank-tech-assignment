import { StatusBadge } from "@/components/shared";
import { formatCurrency, formatDate } from "@/lib/formatters";

import { AdminAssetActionButton } from "./admin-asset-action-button";
import type { AdminAssetRow } from "@/lib/admin-assets";

export function AdminAssetCard({
  asset,
  returnTo,
  suspendAction,
  restoreAction,
}: {
  asset: AdminAssetRow;
  returnTo: string;
  suspendAction: (formData: FormData) => void | Promise<void>;
  restoreAction: (formData: FormData) => void | Promise<void>;
}) {
  const isSuspended = asset.status === "SUSPENDED";

  return (
    <li className="rounded-[1.5rem] border border-[var(--border)] bg-white p-4 shadow-[0_22px_46px_-40px_rgba(15,23,42,0.24)] transition hover:border-[var(--border-strong)] hover:bg-slate-50/60 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-950">
              {asset.title}
            </h3>
            <StatusBadge status={asset.status} />
          </div>
          <p className="text-sm text-slate-600">{asset.seller.company}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
            <span>{asset.country}</span>
            <span className="text-stone-300">|</span>
            <span>{asset.category}</span>
            <span className="text-stone-300">|</span>
            <span>Updated {formatDate(asset.updatedAt)}</span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 lg:items-end">
          <p className="text-[0.72rem] font-semibold text-slate-500">
            Asking price
          </p>
          <p className="text-xl font-semibold text-slate-950">
            {formatCurrency(asset.askingPrice, asset.currency)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-[var(--border)] pt-4">
        <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1.5 text-[0.72rem] font-semibold text-slate-600">
          Seller context: {asset.seller.company}
        </span>

        {isSuspended ? (
          <AdminAssetActionButton
            action={restoreAction}
            targetAssetId={asset.id}
            returnTo={returnTo}
            label="Restore to draft"
            confirmMessage={`Restore ${asset.title} to DRAFT? It will remain hidden from the marketplace until the seller publishes it again.`}
            className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 transition hover:bg-emerald-100"
          />
        ) : (
          <AdminAssetActionButton
            action={suspendAction}
            targetAssetId={asset.id}
            returnTo={returnTo}
            label="Suspend"
            confirmMessage={`Suspend ${asset.title}? This will hide the asset from the marketplace.`}
            className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-rose-700 transition hover:bg-rose-100"
          />
        )}
      </div>
    </li>
  );
}
