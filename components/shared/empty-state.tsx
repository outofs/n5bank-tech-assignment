import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-6 text-center">
      <div className="mx-auto max-w-md space-y-2">
        <h2 className="text-base font-semibold text-stone-950">{title}</h2>
        {description ? (
          <p className="text-sm leading-6 text-stone-600">{description}</p>
        ) : null}
        {action ? <div className="pt-2">{action}</div> : null}
      </div>
    </div>
  );
}
