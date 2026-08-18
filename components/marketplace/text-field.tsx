import type { ReactNode } from "react";

const FIELD_LABEL_CLASS =
  "text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500";

export type TextFieldProps = {
  label: string;
  children: ReactNode;
};

export function TextField({ label, children }: TextFieldProps) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className={FIELD_LABEL_CLASS}>{label}</span>
      {children}
    </label>
  );
}
