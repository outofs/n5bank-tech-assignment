import Link from "next/link";
import { SmartMatchBadge } from "@/components/marketplace/smart-match";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { SmartMatchResult } from "@/lib/smart-match";
import type { MarketplaceListAsset } from "@/lib/marketplace/types";

function truncateDescription(description: string) {
  return description.length > 160
    ? `${description.slice(0, 157).trimEnd()}...`
    : description;
}

export type AssetCardProps = {
  href: string;
  asset: MarketplaceListAsset;
  smartMatch?: SmartMatchResult | null;
};

export function AssetCard({ href, asset, smartMatch }: AssetCardProps) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-[1.75rem] border border-[var(--border)] bg-white p-5 shadow-[0_26px_60px_-42px_rgba(15,23,42,0.35)] transition hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-[0_30px_60px_-38px_rgba(15,23,42,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1 text-[0.72rem] font-semibold text-slate-600">
              {asset.country}
            </span>
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1 text-[0.72rem] font-semibold text-slate-600">
              {asset.category}
            </span>
            {smartMatch ? <SmartMatchBadge score={smartMatch.score} /> : null}
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">
            {asset.title}
          </h2>
        </div>

        <span className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-slate-500 transition group-hover:border-indigo-200 group-hover:text-indigo-700">
          View Asset
        </span>
      </div>

      <div className="mt-5 flex flex-1 flex-col gap-4">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2.5">
            <p className="text-[0.68rem] font-semibold text-slate-500">Status</p>
            <p className="mt-1 text-sm font-medium text-slate-900">{asset.businessStatus}</p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2.5">
            <p className="text-[0.68rem] font-semibold text-slate-500">License</p>
            <p className="mt-1 line-clamp-2 text-sm font-medium text-slate-900">
              {asset.licenseType || "Not listed"}
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2.5">
            <p className="text-[0.68rem] font-semibold text-slate-500">Listed</p>
            <p className="mt-1 text-sm font-medium text-slate-900">
              {formatDate(asset.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-end justify-between gap-4 border-t border-[var(--border)] pt-4">
          <div>
            <p className="text-[0.72rem] font-semibold text-slate-500">
              Asking price
            </p>
            <p className="mt-1 text-2xl font-semibold text-indigo-700">
              {formatCurrency(asset.askingPrice, asset.currency)}
            </p>
          </div>
          <p className="text-right text-xs text-slate-500">
            Created {formatDate(asset.createdAt)}
          </p>
        </div>

        <p className="min-h-12 text-sm leading-6 text-slate-600">
          {truncateDescription(asset.description)}
        </p>
      </div>
    </Link>
  );
}
