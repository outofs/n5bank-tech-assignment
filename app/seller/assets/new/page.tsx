import Link from "next/link";

import { PageHeader } from "@/components/shared";
import { SellerAccessState, SellerFeedbackBanner } from "@/components/seller";
import {
  AuthorizationError,
  requireSellerDemoUser,
  type SellerDemoUser,
} from "@/lib/authz";
import { db } from "@/lib/db";
import { createEmptySellerAssetFormValues } from "@/lib/seller-asset-form";
import { buildSellerAssetSelectOptions } from "@/lib/seller-asset-options";
import { SellerAssetForm } from "@/components/seller/seller-asset-form";

type SellerAssetNewSearchParams = Promise<{
  created?: string | string[];
  status?: string | string[];
}>;

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SellerAssetCreatePage({
  searchParams,
}: {
  searchParams: SellerAssetNewSearchParams;
}) {
  let currentUser: SellerDemoUser;

  try {
    currentUser = await requireSellerDemoUser();
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return (
        <SellerAccessState
          title="Seller access required"
          description="Select an active Seller demo identity from the header to create assets."
          actionHref="/"
          actionLabel="Back to home"
        />
      );
    }

    throw error;
  }

  const { created: rawCreated, status: rawStatus } = await searchParams;
  const created = firstParam(rawCreated) === "1";
  const status = firstParam(rawStatus);

  const successMessage =
    created && status === "published"
      ? "Asset published successfully."
      : created && status === "draft"
        ? "Draft saved successfully."
        : "";

  const initialValues = createEmptySellerAssetFormValues(currentUser.country);
  const assetRows = await db.asset.findMany({
    select: {
      category: true,
      assetType: true,
      licenseType: true,
    },
  });
  const assetSelectOptions = buildSellerAssetSelectOptions(assetRows);

  return (
    <main className="bg-stone-50/80">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <SellerFeedbackBanner message={successMessage} />

        <PageHeader
          eyebrow="Seller assets"
          title="Create asset"
          description="Create a new seller asset as a draft or publish it immediately. The asset will always be owned by the active Seller."
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
              initialValues={initialValues}
              categoryOptions={assetSelectOptions.categoryOptions}
              assetTypeOptions={assetSelectOptions.assetTypeOptions}
              licenseTypeOptions={assetSelectOptions.licenseTypeOptions}
            />
          </section>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                Draft vs publish
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Save draft stores the record as DRAFT. Publish stores the
                record as PUBLISHED and revalidates the buyer marketplace so
                it can appear immediately.
              </p>
            </section>

            <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                Seller note
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                The seller ID is taken from the active demo session and cannot
                be changed from the client.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
