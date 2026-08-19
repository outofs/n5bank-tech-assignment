import { revalidatePath } from "next/cache";

import { RoleNavigation } from "@/app/_components/role-navigation";
import { clearDemoUser, getCurrentUser, setDemoUser } from "@/lib/demo-session";
import { getSeededDemoUsers } from "@/lib/demo-users";

function roleBadgeTone(role?: string) {
  switch (role) {
    case "BUYER":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "SELLER":
      return "border-sky-200 bg-sky-50 text-sky-700";
    case "MANAGER":
      return "border-slate-300 bg-slate-100 text-slate-700";
    default:
      return "border-slate-200 bg-slate-100 text-slate-600";
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
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-white/88 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-indigo-200 bg-[linear-gradient(135deg,#1f4ae0,#5b7cff)] text-[11px] font-semibold tracking-[0.18em] text-white shadow-[0_16px_30px_-20px_rgba(31,74,224,0.9)]">
              N5
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="text-[0.72rem] font-semibold text-indigo-600">
                N5Deal Marketplace
              </p>
              <h1 className="text-base font-semibold tracking-tight text-slate-950 sm:text-lg">
                Fintech and M&A marketplace prototype
              </h1>
              <p className="hidden text-sm text-slate-500 lg:block">
                Browse buyer, seller, and manager flows with seeded identities.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 xl:justify-end">
            <div className="flex min-w-0 items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 shadow-[0_10px_25px_-20px_rgba(15,23,42,0.45)]">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-950">
                  {currentUser ? currentUser.name : "No demo identity"}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {currentUser ? currentUser.company : "Select a seeded user"}
                </p>
              </div>
              {currentUser ? (
                <span
                  className={`inline-flex shrink-0 rounded-full border px-2.5 py-1 text-[0.72rem] font-semibold ${roleBadgeTone(
                    currentUser.role,
                  )}`}
                >
                  {currentUser.role}
                </span>
              ) : null}
            </div>

            <details className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-[var(--border)] bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-[0_10px_25px_-20px_rgba(15,23,42,0.45)] hover:border-[var(--border-strong)] hover:text-slate-900">
                Demo switch
              </summary>
              <div className="absolute right-0 top-[calc(100%+0.75rem)] w-72 rounded-[1.25rem] border border-[var(--border)] bg-white p-3 shadow-[0_30px_60px_-34px_rgba(15,23,42,0.4)]">
                <div className="mb-2 px-1">
                  <p className="text-sm font-semibold text-slate-950">
                    Switch demo identity
                  </p>
                  <p className="text-xs text-slate-500">
                    Secondary control for testing role-specific flows.
                  </p>
                </div>
                <div className="space-y-2">
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
                          className={`flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-left ${
                            isSelected
                              ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                              : "border-[var(--border)] bg-white text-slate-700 hover:border-[var(--border-strong)] hover:bg-slate-50"
                          }`}
                        >
                          <span className="text-sm font-medium">{label}</span>
                          <span className="text-xs text-slate-500">{user.company}</span>
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
                        className="flex w-full items-center justify-center rounded-2xl border border-[var(--border)] bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-600 hover:border-[var(--border-strong)] hover:bg-slate-100"
                      >
                        Clear identity
                      </button>
                    </form>
                  ) : null}
                </div>
              </div>
            </details>
          </div>
        </div>

        <nav
          aria-label="Role navigation"
          className="flex flex-col gap-3 rounded-[1.5rem] border border-[var(--border)] bg-white px-4 py-3 shadow-[0_20px_40px_-34px_rgba(15,23,42,0.45)]"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.72rem] font-semibold text-slate-500">
              Navigation
            </p>
            {currentRole ? (
              <span className="text-[0.72rem] text-slate-500">
                {currentRole}
              </span>
            ) : null}
          </div>

          {activeNavigation ? (
            <RoleNavigation
              role={activeNavigation.role}
              items={activeNavigation.navigation}
            />
          ) : (
            <p className="text-sm text-slate-600">
              Select a demo identity to view role-specific navigation.
            </p>
          )}
        </nav>
      </div>
    </header>
  );
}
