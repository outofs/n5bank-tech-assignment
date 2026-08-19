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
      className="group flex h-full flex-col rounded-[1.75rem] border border-[var(--border)] bg-white p-5 shadow-[0_26px_60px_-42px_rgba(15,23,42,0.35)] transition hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-[0_30px_60px_-38px_rgba(15,23,42,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status="ACTIVE" />
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1 text-[0.72rem] font-semibold text-slate-600">
              {buyer.country}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">
              {buyer.name}
            </h2>
            <p className="mt-1 text-sm text-slate-600">{buyer.company}</p>
          </div>
        </div>

        <span className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-slate-500 transition group-hover:border-indigo-200 group-hover:text-indigo-700">
          View Buyer
        </span>
      </div>

      <div className="mt-5 grid gap-3 border-t border-[var(--border)] pt-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3">
          <p className="text-[0.72rem] font-semibold text-slate-500">
            Investment range
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-950">
            {formatCurrency(buyer.buyerProfile.minInvestment, "EUR")} -{" "}
            {formatCurrency(buyer.buyerProfile.maxInvestment, "EUR")}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3">
          <p className="text-[0.72rem] font-semibold text-slate-500">
            Directory note
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-950">
            Active buyer profile
          </p>
        </div>
      </div>
    </Link>
  );
}
