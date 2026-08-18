import { StatusBadge } from "@/components/shared";
import { formatCurrency, formatDate } from "@/lib/formatters";

export type AssetDetailProps = {
  title: string;
  askingPrice: string | number | { toString(): string };
  currency: string;
  country: string;
  category: string;
  assetType: string;
  businessStatus: string;
  description: string;
  employees: number | null;
  foundedYear: number | null;
  licenseType: string | null;
  createdAt: Date;
  seller: {
    name: string;
    company: string;
  };
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

export function AssetDetail({
  title,
  askingPrice,
  currency,
  country,
  category,
  assetType,
  businessStatus,
  description,
  employees,
  foundedYear,
  licenseType,
  createdAt,
  seller,
}: AssetDetailProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.9fr)]">
      <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status="PUBLISHED" />
          <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-600">
            {country}
          </span>
          <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-600">
            {category}
          </span>
          <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-600">
            {assetType}
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
              {title}
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-stone-600 sm:text-base">
              {description}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 sm:min-w-[220px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
              Asking price
            </p>
            <p className="mt-1 text-2xl font-semibold text-stone-950">
              {formatCurrency(askingPrice, currency)}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-stone-500">
              Created {formatDate(createdAt)}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <DetailRow label="Business status" value={businessStatus} />
            <DetailRow label="Country" value={country} />
            <DetailRow label="Category" value={category} />
            <DetailRow label="Asset type" value={assetType} />
            {employees !== null ? (
              <DetailRow
                label="Employees"
                value={employees.toLocaleString("en-US")}
              />
            ) : null}
            {foundedYear !== null ? (
              <DetailRow label="Founded year" value={String(foundedYear)} />
            ) : null}
            {licenseType ? (
              <DetailRow label="License type" value={licenseType} />
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
              {seller.name}
            </p>
            <p className="text-sm text-stone-600">{seller.company}</p>
            <p className="text-sm text-stone-600">
              Active seller on the N5Deal marketplace.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-stone-950 p-5 text-white shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-300">
            Next step
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">
            Contact the seller
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-300">
            The messaging flow is not implemented yet, but this CTA is already
            structured for a future contact form or server action.
          </p>
          <button
            type="button"
            className="mt-4 inline-flex h-11 items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-stone-950 transition hover:bg-stone-100"
          >
            Contact seller
          </button>
        </section>

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
