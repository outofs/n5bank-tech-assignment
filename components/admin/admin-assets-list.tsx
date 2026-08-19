import type { AdminAssetRow } from "@/lib/admin-assets";

import { AdminAssetCard } from "./admin-asset-card";

type AdminAssetsListProps = {
  assets: AdminAssetRow[];
  returnTo: string;
  suspendAction: (formData: FormData) => void | Promise<void>;
  restoreAction: (formData: FormData) => void | Promise<void>;
};

export function AdminAssetsList({
  assets,
  returnTo,
  suspendAction,
  restoreAction,
}: AdminAssetsListProps) {
  if (assets.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-6 text-center">
        <div className="mx-auto max-w-md space-y-2">
          <h2 className="text-base font-semibold text-stone-950">No matching assets</h2>
          <p className="text-sm leading-6 text-stone-600">
            Adjust the filters to see assets available for moderation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {assets.map((asset) => (
        <AdminAssetCard
          key={asset.id}
          asset={asset}
          returnTo={returnTo}
          suspendAction={suspendAction}
          restoreAction={restoreAction}
        />
      ))}
    </ul>
  );
}
