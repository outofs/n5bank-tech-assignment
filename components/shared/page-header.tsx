import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="max-w-3xl text-sm leading-6 text-stone-600 sm:text-base">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}
