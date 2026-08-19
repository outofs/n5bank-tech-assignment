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
    <section className="rounded-[1.5rem] border border-[var(--border)] bg-white shadow-[0_24px_50px_-42px_rgba(15,23,42,0.28)]">
      <header className="border-b border-[var(--border)] px-4 py-4 sm:px-5">
        <h2 className="text-base font-semibold text-slate-950">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </header>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}
