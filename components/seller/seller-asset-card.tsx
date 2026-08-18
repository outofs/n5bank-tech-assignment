import Link from "next/link";

import { StatusBadge } from "@/components/shared";
import { formatCurrency, formatDate } from "@/lib/formatters";

const STATUS_TONES: Record<string, string> = {
  DRAFT: "border-amber-200 bg-amber-50/70",
  PUBLISHED: "border-emerald-200 bg-emerald-50/70",
  SUSPENDED: "border-rose-200 bg-rose-50/70",
};

function statusTone(status: string) {
  return (
    STATUS_TONES[status.toUpperCase()] ?? "border-stone-200 bg-stone-50"
  );
}

function statusDescription(status: string) {
  if (status === "DRAFT") {
    return "Draft assets are visible only to the seller.";
  }

  if (status === "PUBLISHED") {
    return "Published assets are listed in the buyer marketplace.";
  }

  return "Suspended assets are hidden until moderation clears them.";
}

export type SellerAssetCardProps = {
  id: string;
  title: string;
  country: string;
  category: string;
  askingPrice: string | number | { toString(): string };
  currency: string;
  status: string;
  updatedAt: Date;
  editHref?: string;
};

export function SellerAssetCard({
  title,
  country,
  category,
  askingPrice,
  currency,
  status,
  updatedAt,
  editHref,
}: SellerAssetCardProps) {
  return (
    <article className={`rounded-2xl border p-5 shadow-sm ${statusTone(status)}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={status} />
            <span className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-600">
              {country}
            </span>
            <span className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-600">
              {category}
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight text-stone-950">
              {title}
            </h2>
            <p className="text-sm text-stone-600">{statusDescription(status)}</p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          {editHref ? (
            <Link
              href={editHref}
              className="inline-flex rounded-full border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition hover:bg-stone-100"
            >
              Edit
            </Link>
          ) : null}

          <div className="rounded-2xl border border-stone-200 bg-white px-4 py-3 sm:min-w-[220px] sm:text-right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
              Asking price
            </p>
            <p className="mt-1 text-2xl font-semibold text-stone-950">
              {formatCurrency(askingPrice, currency)}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-stone-500">
              Updated {formatDate(updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
