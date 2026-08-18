type StatusBadgeProps = {
  status: string;
};

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "border-emerald-200 bg-emerald-50 text-emerald-800",
  PUBLISHED: "border-emerald-200 bg-emerald-50 text-emerald-800",
  SUSPENDED: "border-rose-200 bg-rose-50 text-rose-800",
  DRAFT: "border-amber-200 bg-amber-50 text-amber-800",
  PENDING: "border-slate-200 bg-slate-100 text-slate-700",
  ACCEPTED: "border-emerald-200 bg-emerald-50 text-emerald-800",
  DECLINED: "border-rose-200 bg-rose-50 text-rose-800",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalizedStatus = status.toUpperCase();
  const tone =
    STATUS_STYLES[normalizedStatus] ??
    "border-stone-200 bg-stone-100 text-stone-700";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${tone}`}
    >
      {status}
    </span>
  );
}
