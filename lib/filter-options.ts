import { COUNTRY_OPTIONS } from "./countries";
import { dedupeSelectValues, normalizeSelectValue } from "./select-options";

export type NormalizedOption = {
  value: string;
  label: string;
};

export type NormalizedOptionGroup = {
  options: NormalizedOption[];
  valuesByOption: Map<string, string[]>;
};

export function buildCanonicalCountryOptions(
  values: Array<string | null | undefined>,
) {
  const available = new Set(
    values
      .map((value) => normalizeSelectValue(value ?? ""))
      .filter(Boolean),
  );

  return COUNTRY_OPTIONS.filter((country) => available.has(country)).map(
    (country) => ({
      value: country,
      label: country,
    }),
  );
}

export function isCanonicalCountry(value: string) {
  return COUNTRY_OPTIONS.includes(value as (typeof COUNTRY_OPTIONS)[number]);
}

export function buildNormalizedFilterOptions(
  values: Array<string | null | undefined>,
): NormalizedOptionGroup {
  const valuesByOption = new Map<string, string[]>();
  const optionKeyByLowercase = new Map<string, string>();

  for (const value of values) {
    if (typeof value !== "string") {
      continue;
    }

    const normalized = normalizeSelectValue(value);
    if (!normalized) {
      continue;
    }

    const key = normalized.toLocaleLowerCase();
    const optionKey = optionKeyByLowercase.get(key) ?? normalized;
    const currentValues = valuesByOption.get(optionKey) ?? [];
    const rawValue = value.trim();

    if (!currentValues.includes(rawValue)) {
      currentValues.push(rawValue);
    }

    optionKeyByLowercase.set(key, optionKey);
    valuesByOption.set(optionKey, currentValues);
  }

  const options = dedupeSelectValues(Array.from(valuesByOption.keys()))
    .sort((left, right) => left.localeCompare(right))
    .map((value) => ({ value, label: value }));

  return { options, valuesByOption };
}

export function sanitizeOptionValue(value: string, options: NormalizedOption[]) {
  return options.some((option) => option.value === value) ? value : "";
}
