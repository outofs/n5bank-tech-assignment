import { revalidatePath } from "next/cache";
import Link from "next/link";

import { clearDemoUser, getCurrentUser, setDemoUser } from "@/lib/demo-session";
import { getSeededDemoUsers } from "@/lib/demo-users";

function roleBadgeTone(role?: string) {
  switch (role) {
    case "BUYER":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "SELLER":
      return "border-teal-200 bg-teal-50 text-teal-800";
    case "MANAGER":
      return "border-stone-300 bg-stone-100 text-stone-800";
    default:
      return "border-stone-200 bg-stone-100 text-stone-700";
  }
}

export default async function SiteHeader() {
  const [currentUser, seededUsers] = await Promise.all([
    getCurrentUser(),
    getSeededDemoUsers(),
  ]);

  const currentRole = currentUser?.role;
  const activeNavigation = seededUsers.find(({ role }) => role === currentRole);

  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 bg-stone-950 text-[11px] font-semibold tracking-[0.18em] text-white">
              N5
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                N5Deal Marketplace Prototype
              </p>
              <h1 className="mt-0.5 text-base font-semibold tracking-tight text-stone-950 sm:text-lg">
                Demo shell for an M&A marketplace
              </h1>
              <p className="mt-0.5 hidden max-w-2xl text-sm leading-6 text-stone-600 sm:block">
                A neutral, server-rendered shell for browsing seeded demo
                identities and moving between buyer, seller, and manager views.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-xl border border-stone-200 bg-stone-50/80 px-3 py-2.5 sm:min-w-[280px]">
            {currentUser ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                  Selected user
                </span>
                <span className="text-sm font-semibold text-stone-950">
                  {currentUser.name}
                </span>
                <span className="text-sm text-stone-500">•</span>
                <span className="text-sm text-stone-600">
                  {currentUser.company}
                </span>
                <span
                  className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${roleBadgeTone(
                    currentUser.role,
                  )}`}
                >
                  {currentUser.role}
                </span>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                  Demo mode
                </p>
                <p className="text-sm font-semibold text-stone-950">
                  No identity selected
                </p>
                <p className="w-full text-sm text-stone-600">
                  Pick a seeded demo user to enter the prototype.
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 border-t border-stone-200 pt-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                Switch demo identity
              </span>
              {seededUsers.map(({ label, user }) => {
                if (!user) {
                  return null;
                }

                const isSelected = user.id === currentUser?.id;

                return (
                  <form
                    key={user.id}
                    action={async () => {
                      "use server";
                      await setDemoUser(user.id);
                      revalidatePath("/");
                    }}
                  >
                    <button
                      type="submit"
                      className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                        isSelected
                          ? "border-stone-950 bg-stone-950 text-white"
                          : "border-stone-300 bg-white text-stone-700 hover:border-stone-400 hover:bg-stone-100"
                      }`}
                    >
                      {label}
                    </button>
                  </form>
                );
              })}

              {currentUser ? (
                <form
                  action={async () => {
                    "use server";
                    await clearDemoUser();
                    revalidatePath("/");
                  }}
                >
                  <button
                    type="submit"
                    className="rounded-full border border-stone-300 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-700 transition hover:bg-stone-100"
                  >
                    Clear
                  </button>
                </form>
              ) : null}
            </div>
          </div>
        </div>

        <nav
          aria-label="Role navigation"
          className="flex flex-col gap-2 border-t border-stone-200 pt-3"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
              Navigation
            </p>
            {currentRole ? (
              <span className="text-[11px] uppercase tracking-[0.2em] text-stone-500">
                {currentRole}
              </span>
            ) : null}
          </div>

          {activeNavigation ? (
            <div className="flex flex-wrap gap-2">
              {activeNavigation.navigation.map((item) =>
                activeNavigation.role === "BUYER" && item === "Marketplace" ? (
                  <Link
                    key={item}
                    href="/marketplace"
                    className="rounded-full border border-stone-200 bg-stone-950 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-stone-800"
                  >
                    {item}
                  </Link>
                ) : activeNavigation.role === "SELLER" && item === "My Assets" ? (
                  <Link
                    key={item}
                    href="/seller/assets"
                    className="rounded-full border border-stone-200 bg-stone-950 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-stone-800"
                  >
                    {item}
                  </Link>
                ) : activeNavigation.role === "SELLER" && item === "Buyers" ? (
                  <Link
                    key={item}
                    href="/buyers"
                    className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 transition hover:bg-stone-100"
                  >
                    {item}
                  </Link>
                ) : activeNavigation.role === "BUYER" && item === "Profile" ? (
                  <Link
                    key={item}
                    href="/profile"
                    className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 transition hover:bg-stone-100"
                  >
                    {item}
                  </Link>
                ) : (
                  <span
                    key={item}
                    className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700"
                  >
                    {item}
                  </span>
                ),
              )}
            </div>
          ) : (
            <p className="text-sm text-stone-600">
              Select a demo identity to view role-specific navigation.
            </p>
          )}
        </nav>
      </div>
    </header>
  );
}
