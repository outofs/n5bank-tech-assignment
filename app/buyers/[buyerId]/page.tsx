import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { ContactRequestForm } from "@/components/contact/contact-request-form";
import { PageHeader, StatusBadge } from "@/components/shared";
import { SellerAccessState } from "@/components/seller";
import { AuthorizationError, requireSellerDemoUser } from "@/lib/authz";
import { buyerDetailSelect, hasBuyerProfile } from "@/lib/buyers/types";
import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/formatters";

import { createSellerBuyerContactRequestAction } from "./contact-request-actions";

const buyerIdSchema = z.string().trim().min(1);

function tagList(values: string[]) {
  return values.length > 0 ? (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => (
        <span
          key={value}
          className="inline-flex rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-medium text-stone-700"
        >
          {value}
        </span>
      ))}
    </div>
  ) : (
    <p className="text-sm text-stone-500">Not specified.</p>
  );
}

function detailPair(label: string, value: string) {
  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-stone-950">{value}</p>
    </div>
  );
}

export default async function BuyerDetailPage({
  params,
}: {
  params: Promise<{ buyerId: string }>;
}) {
  try {
    await requireSellerDemoUser();
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return (
        <SellerAccessState
          title="Seller access required"
          description="Select an active Seller demo identity from the header to view buyer details."
          actionHref="/buyers"
          actionLabel="Back to buyer directory"
        />
      );
    }

    throw error;
  }

  const { buyerId: rawBuyerId } = await params;
  const parsedBuyerId = buyerIdSchema.safeParse(rawBuyerId);

  if (!parsedBuyerId.success) {
    notFound();
  }

  const buyer = await db.user.findFirst({
    where: {
      id: parsedBuyerId.data,
      role: "BUYER",
      status: "ACTIVE",
      buyerProfile: {
        isNot: null,
      },
    },
    select: buyerDetailSelect,
  });

  if (!buyer || !hasBuyerProfile(buyer)) {
    notFound();
  }

  return (
    <main className="bg-stone-50/80">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Seller directory"
          title={buyer.name}
          description={`${buyer.company} | ${buyer.country}`}
          actions={
            <Link
              href="/buyers"
              className="inline-flex items-center rounded-full border border-[var(--border)] bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:border-[var(--border-strong)] hover:bg-slate-50"
            >
              Back to buyer directory
            </Link>
          }
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]">
          <section className="space-y-6 rounded-[1.75rem] border border-[var(--border)] bg-white p-5 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.28)] sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status="ACTIVE" />
              <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1 text-[0.72rem] font-semibold text-slate-600">
                {buyer.country}
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-[0.72rem] font-semibold text-slate-500">
                Company
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                {buyer.company}
              </h2>
              <p className="text-sm text-slate-600">
                Updated {formatDate(buyer.updatedAt)}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {detailPair(
                "Minimum investment",
                formatCurrency(buyer.buyerProfile.minInvestment, "EUR"),
              )}
              {detailPair(
                "Maximum investment",
                formatCurrency(buyer.buyerProfile.maxInvestment, "EUR"),
              )}
            </div>

            <section className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-muted)] p-5">
              <p className="text-[0.72rem] font-semibold text-slate-500">
                Bio
              </p>
              <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600">
                {buyer.buyerProfile.bio}
              </p>
            </section>

            <section className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-muted)] p-5">
              <p className="text-[0.72rem] font-semibold text-slate-500">
                Investment thesis
              </p>
              <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600">
                {buyer.buyerProfile.investmentThesis}
              </p>
            </section>
          </section>

          <aside className="space-y-4">
            <ContactRequestForm
              action={createSellerBuyerContactRequestAction}
              recipientName={buyer.name}
              recipientCompany={buyer.company}
              recipientRoleLabel="Active buyer in the seller directory."
              contextLabel="Buyer"
              contextValue={buyer.name}
              contextFieldName="buyerId"
              contextFieldValue={buyer.id}
              submitLabel="Contact buyer"
            />

            <section className="rounded-[1.75rem] border border-[var(--border)] bg-white p-5 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.28)] sm:p-6">
              <p className="text-[0.72rem] font-semibold text-slate-500">
                Preferred countries
              </p>
              <div className="mt-3">
                {tagList(buyer.buyerProfile.preferredCountries)}
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-[var(--border)] bg-white p-5 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.28)] sm:p-6">
              <p className="text-[0.72rem] font-semibold text-slate-500">
                Preferred categories
              </p>
              <div className="mt-3">
                {tagList(buyer.buyerProfile.preferredCategories)}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
