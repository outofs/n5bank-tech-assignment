import type { ReactNode } from "react";

export function AdminSectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white shadow-sm">
      <header className="border-b border-stone-200 px-4 py-4 sm:px-5">
        <h2 className="text-base font-semibold text-stone-950">{title}</h2>
        <p className="mt-1 text-sm text-stone-600">{description}</p>
      </header>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}
