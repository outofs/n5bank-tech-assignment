import { EmptyState, StatusBadge } from "@/components/shared";
import { formatDate } from "@/lib/formatters";

import type { RecentAsset } from "./admin-types";

export function AdminRecentAssetsSection({ assets }: { assets: RecentAsset[] }) {
  if (assets.length === 0) {
    return (
      <EmptyState
        title="No assets yet"
        description="Assets will appear here once records exist in PostgreSQL."
      />
    );
  }

  return (
    <ul className="space-y-3">
      {assets.map((asset) => (
        <li
          key={asset.id}
          className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-stone-50/70 px-4 py-3"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-stone-950">{asset.title}</h3>
              <p className="text-sm text-stone-600">{asset.seller.company}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <StatusBadge status={asset.status} />
              <span className="text-xs uppercase tracking-[0.18em] text-stone-500">
                {formatDate(asset.updatedAt)}
              </span>
            </div>
          </div>

          <dl className="grid gap-3 text-sm text-stone-600 sm:grid-cols-2">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                Country
              </dt>
              <dd>{asset.country}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                Category
              </dt>
              <dd>{asset.category}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}
