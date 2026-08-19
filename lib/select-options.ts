export type SelectOption = {
  value: string;
  label: string;
};

export function normalizeSelectValue(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function dedupeSelectValues(values: string[]) {
  const seen = new Map<string, string>();

  for (const value of values) {
    const normalized = normalizeSelectValue(value);
    if (!normalized) {
      continue;
    }

    const key = normalized.toLocaleLowerCase();
    if (!seen.has(key)) {
      seen.set(key, normalized);
    }
  }

  return Array.from(seen.values());
}

export function normalizeSelectOptions(values: string[]) {
  return dedupeSelectValues(values).map((value) => ({
    value,
    label: value,
  }));
}

export function toSelectOption(value: string, options: SelectOption[]) {
  return (
    options.find(
      (option) => option.value.toLocaleLowerCase() === value.toLocaleLowerCase(),
    ) ?? (value ? { value, label: value } : null)
  );
}

export function mergeSelectOptions(
  baseOptions: SelectOption[],
  values: string[],
) {
  const merged = new Map(
    baseOptions.map((option) => [option.value.toLocaleLowerCase(), option]),
  );

  for (const value of values) {
    const normalized = normalizeSelectValue(value);
    if (!normalized) {
      continue;
    }

    const key = normalized.toLocaleLowerCase();
    if (!merged.has(key)) {
      merged.set(key, { value: normalized, label: normalized });
    }
  }

  return Array.from(merged.values());
}

export function hasSelectOptionValue(options: SelectOption[], value: string) {
  const normalized = normalizeSelectValue(value);
  if (!normalized) {
    return false;
  }

  const key = normalized.toLocaleLowerCase();

  return options.some((option) => option.value.toLocaleLowerCase() === key);
}
