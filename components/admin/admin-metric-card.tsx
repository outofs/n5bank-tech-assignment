import type { DashboardMetric } from "./admin-types";

export function AdminMetricCard({ label, value, tone }: DashboardMetric) {
  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
        {label}
      </p>
      <p className={`mt-3 text-3xl font-semibold tracking-tight ${tone}`}>{value}</p>
    </article>
  );
}
