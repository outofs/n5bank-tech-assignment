import { getCurrentUser } from "@/lib/demo-session";

export default async function Home() {
  const currentUser = await getCurrentUser();

  return (
    <main className="mx-auto flex w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="w-full rounded-[2rem] border border-[var(--border)] bg-white px-6 py-8 shadow-[0_34px_80px_-48px_rgba(15,23,42,0.35)] sm:px-8">
        <p className="text-[0.72rem] font-semibold text-indigo-600">
          Prototype workspace
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Marketplace shell and role flows
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          Use the compact header controls to enter buyer, seller, or manager
          views. The prototype keeps the current product flows intact while the
          visual layer now tracks a cleaner fintech marketplace direction.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[linear-gradient(180deg,#f8fbff,#eef4ff)] p-6">
            <p className="text-sm font-semibold text-slate-950">What changed</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Lighter surfaces, tighter navigation, pill-based filters, and
              denser cards aligned to a marketplace browsing experience rather
              than an internal admin prototype.
            </p>
          </div>

          <div
            className={`rounded-[1.5rem] border p-6 ${
              currentUser
                ? "border-emerald-200 bg-emerald-50"
                : "border-[var(--border)] bg-[var(--surface-muted)]"
            }`}
          >
            <p className="text-sm font-semibold text-slate-950">
              {currentUser ? `Signed in as ${currentUser.name}` : "No demo identity selected"}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {currentUser
                ? `${currentUser.company} | ${currentUser.role}`
                : "Pick a seeded user from the header to continue."}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
