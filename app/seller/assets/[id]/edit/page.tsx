import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { PageHeader, StatusBadge } from "@/components/shared";
import { SellerFeedbackBanner, SellerAssetForm } from "@/components/seller";
import { AuthorizationError, requireSellerOwnsAsset } from "@/lib/authz";
import { db } from "@/lib/db";
import {
  createSellerAssetFormValues,
  sellerAssetFormAssetSelect,
} from "@/lib/seller-asset-form";
import { buildSellerAssetSelectOptions } from "@/lib/seller-asset-options";

type SellerAssetEditSearchParams = Promise<{
  updated?: string | string[];
  status?: string | string[];
}>;

const assetIdSchema = z.string().trim().min(1);

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function statusMessage(status: string, updated: boolean) {
  if (!updated) {
    return "";
  }

  if (status === "published") {
    return "Asset published successfully.";
  }

  if (status === "draft") {
    return "Asset saved as a draft.";
  }

  return "Asset updated successfully.";
}

export default async function SellerAssetEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: SellerAssetEditSearchParams;
}) {
  const { id: rawAssetId } = await params;
  const parsedAssetId = assetIdSchema.safeParse(rawAssetId);

  if (!parsedAssetId.success) {
    notFound();
  }

  try {
    await requireSellerOwnsAsset(parsedAssetId.data);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      notFound();
    }

    throw error;
  }

  const [asset, assetRows] = await Promise.all([
    db.asset.findUnique({
      where: { id: parsedAssetId.data },
      select: sellerAssetFormAssetSelect,
    }),
    db.asset.findMany({
      select: {
        category: true,
        assetType: true,
        licenseType: true,
      },
    }),
  ]);

  if (!asset) {
    notFound();
  }

  const { updated: rawUpdated, status: rawStatus } = await searchParams;
  const updated = firstParam(rawUpdated) === "1";
  const status = firstParam(rawStatus);

  const formMessage = statusMessage(status ?? "", updated);
  const initialValues = createSellerAssetFormValues(asset);
  const assetSelectOptions = buildSellerAssetSelectOptions(assetRows);

  return (
    <main className="bg-stone-50/80">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <SellerFeedbackBanner message={formMessage} />

        <PageHeader
          eyebrow="Seller assets"
          title="Edit asset"
          description="Update your own asset. Status transitions are explicit and seller-controlled; suspended assets cannot be restored here."
          actions={
            <Link
              href="/seller/assets"
              className="inline-flex items-center rounded-full border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
            >
              Back to assets
            </Link>
          }
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]">
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
            <SellerAssetForm
              mode="edit"
              assetId={asset.id}
              currentStatus={asset.status}
              initialValues={initialValues}
              cancelHref="/seller/assets"
              categoryOptions={assetSelectOptions.categoryOptions}
              assetTypeOptions={assetSelectOptions.assetTypeOptions}
              licenseTypeOptions={assetSelectOptions.licenseTypeOptions}
            />
          </section>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                Current status
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <StatusBadge status={asset.status} />
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                {asset.status === "DRAFT"
                  ? "Save changes keeps the asset in draft. Publish makes it visible to buyers."
                  : asset.status === "PUBLISHED"
                    ? "Save changes keeps the asset published. Unpublish sends it back to draft."
                    : "You can edit the content, but only moderation can restore a suspended asset."}
              </p>
            </section>

            <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                Ownership rule
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                The seller ID is resolved from the active session and cannot be
                changed from the client.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
