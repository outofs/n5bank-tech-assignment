import type { DashboardMetric } from "./admin-types";

export function AdminMetricCard({ label, value, tone }: DashboardMetric) {
  return (
    <article className="rounded-[1.5rem] border border-[var(--border)] bg-white p-4 shadow-[0_24px_50px_-42px_rgba(15,23,42,0.28)]">
      <p className="text-[0.72rem] font-semibold text-slate-500">
        {label}
      </p>
      <p className={`mt-3 text-3xl font-semibold tracking-tight ${tone}`}>{value}</p>
    </article>
  );
}
