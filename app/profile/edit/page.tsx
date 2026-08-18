import Link from "next/link";

import { EmptyState, PageHeader } from "@/components/shared";
import { ProfileEditForm } from "@/components/profile/profile-edit-form";
import { AuthorizationError, requireBuyerDemoUser } from "@/lib/authz";
import { createProfileEditValues } from "@/lib/buyer-profile-form";

export default async function ProfileEditPage() {
  let currentUser: Awaited<ReturnType<typeof requireBuyerDemoUser>>;

  try {
    currentUser = await requireBuyerDemoUser();
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return (
        <main className="bg-stone-50/80">
          <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <EmptyState
              title="Buyer access required"
              description="Select an active Buyer demo identity from the header to edit the profile."
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
                href="/profile"
                className="inline-flex items-center rounded-full border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
              >
                Back to profile
              </Link>
            }
          />

          <EmptyState
            title="No buyer profile found"
            description="Switch to a seeded active Buyer identity with profile data to edit this page."
          />
        </div>
      </main>
    );
  }

  return (
    <main className="bg-stone-50/80">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Buyer profile"
          title="Edit profile"
          description="Update the active Buyer profile stored in PostgreSQL."
          actions={
            <Link
              href="/profile"
              className="inline-flex items-center rounded-full border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
            >
              Back to profile
            </Link>
          }
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]">
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
            <ProfileEditForm
              initialValues={createProfileEditValues({
                name: currentUser.name,
                company: currentUser.company,
                country: currentUser.country,
                bio: profile.bio,
                investmentThesis: profile.investmentThesis,
                minInvestment: profile.minInvestment,
                maxInvestment: profile.maxInvestment,
                preferredCountries: profile.preferredCountries,
                preferredCategories: profile.preferredCategories,
              })}
            />
          </section>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                Editing note
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Changes are saved directly to the active Buyer&apos;s seeded
                profile. Text fields are trimmed and the investment range is
                validated server-side.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
