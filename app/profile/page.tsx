import Link from "next/link";

import { EmptyState, PageHeader } from "@/components/shared";
import {
  AuthorizationError,
  requireBuyerDemoUser,
  type BuyerDemoUser,
} from "@/lib/authz";
import { formatCurrency } from "@/lib/formatters";

type ProfilePageSearchParams = Promise<{
  saved?: string | string[];
}>;

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function tagList(values: string[]) {
  return (
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
  );
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: ProfilePageSearchParams;
}) {
  let currentUser: BuyerDemoUser;

  try {
    currentUser = await requireBuyerDemoUser();
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return (
        <main className="bg-stone-50/80">
          <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <EmptyState
              title="Buyer access required"
              description="Select an active Buyer demo identity from the header to view the profile page."
              action={
                <Link
                  href="/"
                  className="inline-flex items-center rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                >
                  Back to home
                </Link>
              }
            />
          </div>
        </main>
      );
    }

    throw error;
  }

  const { saved: rawSaved } = await searchParams;
  const saved = firstParam(rawSaved) === "1";
  const profile = currentUser.buyerProfile;

  if (!profile) {
    return (
      <main className="bg-stone-50/80">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <PageHeader
            eyebrow="Buyer profile"
            title="Profile unavailable"
            description="The selected Buyer demo identity does not have a seeded buyer profile."
            actions={
              <Link
                href="/"
                className="inline-flex items-center rounded-full border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
              >
                Back to home
              </Link>
            }
          />

          <EmptyState
            title="No buyer profile found"
            description="Switch to a seeded active Buyer identity with profile data to view this page."
          />
        </div>
      </main>
    );
  }

  return (
    <main className="bg-stone-50/80">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {saved ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            Profile saved successfully.
          </div>
        ) : null}

        <PageHeader
          eyebrow="Buyer profile"
          title={currentUser.name}
          description={`${currentUser.company} · ${currentUser.country}`}
          actions={
            <Link
              href="/profile/edit"
              className="inline-flex items-center rounded-full border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-stone-500"
            >
              Edit profile
            </Link>
          }
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)]">
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                  Name
                </p>
                <p className="mt-1 text-sm font-medium text-stone-950">
                  {currentUser.name}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                  Company
                </p>
                <p className="mt-1 text-sm font-medium text-stone-950">
                  {currentUser.company}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                  Country
                </p>
                <p className="mt-1 text-sm font-medium text-stone-950">
                  {currentUser.country}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                  Current role
                </p>
                <p className="mt-1 text-sm font-medium text-stone-950">
                  {currentUser.role}
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-stone-200 pt-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                Bio
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                {profile.bio}
              </p>
            </div>

            <div className="mt-6 border-t border-stone-200 pt-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                Investment thesis
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                {profile.investmentThesis}
              </p>
            </div>
          </section>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                Investment range
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                    Minimum
                  </p>
                  <p className="mt-1 text-lg font-semibold text-stone-950">
                    {formatCurrency(profile.minInvestment, "EUR")}
                  </p>
                </div>
                <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                    Maximum
                  </p>
                  <p className="mt-1 text-lg font-semibold text-stone-950">
                    {formatCurrency(profile.maxInvestment, "EUR")}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                Preferred countries
              </p>
              <div className="mt-3">
                {profile.preferredCountries.length > 0 ? (
                  tagList(profile.preferredCountries)
                ) : (
                  <p className="text-sm text-stone-500">
                    No country preferences set.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                Preferred categories
              </p>
              <div className="mt-3">
                {profile.preferredCategories.length > 0 ? (
                  tagList(profile.preferredCategories)
                ) : (
                  <p className="text-sm text-stone-500">
                    No category preferences set.
                  </p>
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
