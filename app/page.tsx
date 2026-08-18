import { getCurrentUser } from "@/lib/demo-session";

export default async function Home() {
  const currentUser = await getCurrentUser();

  return (
    <main className="mx-auto flex w-full max-w-6xl px-6 py-10 sm:px-10">
      <section className="w-full rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
          Demo workspace
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
          Shared shell only
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600 sm:text-base">
          The marketplace pages are not built yet. Use the header to select a
          seeded demo identity and switch between buyer, seller, and manager
          views.
        </p>

        {currentUser ? (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-medium text-emerald-900">
              Signed in as {currentUser.name}
            </p>
            <p className="mt-1 text-sm text-emerald-800">
              {currentUser.company} · {currentUser.role}
            </p>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-stone-200 bg-stone-50 p-4">
            <p className="text-sm font-medium text-stone-800">
              No demo identity selected
            </p>
            <p className="mt-1 text-sm text-stone-600">
              Pick one in the header to continue.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
