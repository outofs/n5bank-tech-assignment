import Link from "next/link";

import { StatusBadge } from "@/components/shared";
import type { BuyerDirectoryCardBuyer } from "@/lib/buyers/types";
import { formatCurrency } from "@/lib/formatters";

export type BuyerCardProps = {
  href: string;
  buyer: BuyerDirectoryCardBuyer;
};

export function BuyerCard({ href, buyer }: BuyerCardProps) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status="ACTIVE" />
            <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-600">
              {buyer.country}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-stone-950">
              {buyer.name}
            </h2>
            <p className="mt-1 text-sm text-stone-600">{buyer.company}</p>
          </div>
        </div>

        <span className="text-sm font-semibold text-stone-400 transition group-hover:text-stone-700">
          View
        </span>
      </div>

      <div className="mt-5 border-t border-stone-200 pt-4">
        <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
            Investment range
          </p>
          <p className="mt-1 text-sm font-semibold text-stone-950">
            {formatCurrency(buyer.buyerProfile.minInvestment, "EUR")} -{" "}
            {formatCurrency(buyer.buyerProfile.maxInvestment, "EUR")}
          </p>
        </div>
      </div>
    </Link>
  );
}
