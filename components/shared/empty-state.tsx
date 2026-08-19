import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-[var(--border-strong)] bg-white p-8 text-center shadow-[0_20px_45px_-36px_rgba(15,23,42,0.35)]">
      <div className="mx-auto max-w-md space-y-2">
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        {description ? (
          <p className="text-sm leading-6 text-slate-600">{description}</p>
        ) : null}
        {action ? <div className="pt-2">{action}</div> : null}
      </div>
    </div>
  );
}
