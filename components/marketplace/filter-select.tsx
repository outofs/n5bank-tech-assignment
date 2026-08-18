const FIELD_LABEL_CLASS =
  "text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500";
const CONTROL_CLASS =
  "h-11 w-full rounded-xl border border-stone-300 bg-white px-3 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-stone-500";

export type FilterSelectOption = {
  value: string;
  label: string;
};

export type FilterSelectProps = {
  label: string;
  name: string;
  defaultValue: string;
  options: FilterSelectOption[];
  placeholderLabel?: string;
};

export function FilterSelect({
  label,
  name,
  defaultValue,
  options,
  placeholderLabel,
}: FilterSelectProps) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className={FIELD_LABEL_CLASS}>{label}</span>
      <select name={name} defaultValue={defaultValue} className={CONTROL_CLASS}>
        {placeholderLabel ? <option value="">{placeholderLabel}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
