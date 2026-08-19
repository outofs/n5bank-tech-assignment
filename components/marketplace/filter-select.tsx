"use client";

import { useId, useState } from "react";
import Select from "react-select";
import type { SingleValue } from "react-select";

import { createSharedSelectStyles } from "@/lib/select-styles";
import { toSelectOption, type SelectOption } from "@/lib/select-options";

const FIELD_LABEL_CLASS = "text-[0.72rem] font-semibold text-slate-500";

export type FilterSelectOption = SelectOption;

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
  const inputId = useId();
  const [value, setValue] = useState(defaultValue);
  const selectedOption = toSelectOption(value, options);

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label className={FIELD_LABEL_CLASS} htmlFor={inputId}>
        {label}
      </label>
      <input type="hidden" name={name} value={value} />
      <Select<FilterSelectOption, false>
        inputId={inputId}
        instanceId={inputId}
        isClearable={Boolean(placeholderLabel)}
        isSearchable
        options={options}
        value={selectedOption}
        onChange={(option: SingleValue<FilterSelectOption>) =>
          setValue(option?.value ?? "")
        }
        placeholder={placeholderLabel ?? "Select"}
        className="w-full"
        styles={createSharedSelectStyles(false)}
      />
    </div>
  );
}
