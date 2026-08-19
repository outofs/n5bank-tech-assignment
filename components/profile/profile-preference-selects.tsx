"use client";

import { useId, useState, type ReactNode } from "react";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import type { MultiValue, SingleValue } from "react-select";

import { joinProfileList } from "@/lib/buyer-profile-form";
import { COUNTRY_SELECT_OPTIONS } from "@/lib/countries";
import { createSharedSelectStyles } from "@/lib/select-styles";
import {
  dedupeSelectValues,
  mergeSelectOptions,
  normalizeSelectOptions,
  toSelectOption,
  type SelectOption,
} from "@/lib/select-options";
import { normalizeProfileListItem } from "@/lib/buyer-profile-form";

type ProfilePreferenceSelectsProps = {
  country: string;
  preferredCountries: string[];
  preferredCategories: string[];
  countryError?: string;
  preferredCountriesError?: string;
  preferredCategoriesError?: string;
  categoryOptions: string[];
  onCountryChange: (value: string) => void;
  onPreferredCountriesChange: (values: string[]) => void;
  onPreferredCategoriesChange: (values: string[]) => void;
};

const LABEL_CLASS =
  "text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500";

function SelectField({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label className={LABEL_CLASS} htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {error ? <p className="mt-1 text-sm text-rose-700">{error}</p> : null}
    </div>
  );
}

export function ProfilePreferenceSelects({
  country,
  preferredCountries,
  preferredCategories,
  countryError,
  preferredCountriesError,
  preferredCategoriesError,
  categoryOptions,
  onCountryChange,
  onPreferredCountriesChange,
  onPreferredCategoriesChange,
}: ProfilePreferenceSelectsProps) {
  const countryInputId = useId();
  const targetCountriesInputId = useId();
  const targetCategoriesInputId = useId();

  const [availableCategories, setAvailableCategories] = useState<SelectOption[]>(
    () => mergeSelectOptions(normalizeSelectOptions(categoryOptions), preferredCategories),
  );

  const countryValue = toSelectOption(country, COUNTRY_SELECT_OPTIONS);
  const targetCountryValues = preferredCountries
    .map((value) => toSelectOption(value, COUNTRY_SELECT_OPTIONS))
    .filter(Boolean) as SelectOption[];
  const categoryValue = preferredCategories
    .map((value) => toSelectOption(value, availableCategories))
    .filter(Boolean) as SelectOption[];

  return (
    <div className="grid gap-4">
      <SelectField
        label="Buyer location"
        htmlFor={countryInputId}
        error={countryError}
      >
        <>
          <input type="hidden" name="country" value={country} />
          <Select<SelectOption, false>
            inputId={countryInputId}
            instanceId={countryInputId}
            isClearable={false}
            isSearchable
            options={COUNTRY_SELECT_OPTIONS}
            value={countryValue}
            onChange={(option: SingleValue<SelectOption>) =>
              onCountryChange(option?.value ?? "")
            }
            placeholder="Select a country"
            className="w-full"
            aria-invalid={Boolean(countryError)}
            styles={createSharedSelectStyles(Boolean(countryError))}
          />
        </>
      </SelectField>

      <SelectField
        label="Target countries"
        htmlFor={targetCountriesInputId}
        error={preferredCountriesError}
      >
        <>
          <input
            type="hidden"
            name="preferredCountries"
            value={joinProfileList(preferredCountries)}
          />
          <Select<SelectOption, true>
            inputId={targetCountriesInputId}
            instanceId={targetCountriesInputId}
            isMulti
            isSearchable
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            options={COUNTRY_SELECT_OPTIONS}
            value={targetCountryValues}
            onChange={(options: MultiValue<SelectOption>) =>
              onPreferredCountriesChange(
                dedupeSelectValues(options.map((option) => option.value)),
              )
            }
            placeholder="Search and select countries"
            className="w-full"
            aria-invalid={Boolean(preferredCountriesError)}
            styles={createSharedSelectStyles(Boolean(preferredCountriesError))}
          />
        </>
      </SelectField>

      <SelectField
        label="Target categories"
        htmlFor={targetCategoriesInputId}
        error={preferredCategoriesError}
      >
        <>
          <input
            type="hidden"
            name="preferredCategories"
            value={joinProfileList(preferredCategories)}
          />
          <CreatableSelect<SelectOption, true>
            inputId={targetCategoriesInputId}
            instanceId={targetCategoriesInputId}
            isMulti
            isSearchable
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            options={availableCategories}
            value={categoryValue}
            onChange={(options: MultiValue<SelectOption>) =>
              onPreferredCategoriesChange(
                dedupeSelectValues(options.map((option) => option.value)),
              )
            }
            onCreateOption={(inputValue) => {
              const normalized = normalizeProfileListItem(inputValue);
              if (!normalized) {
                return;
              }

              setAvailableCategories((current) =>
                mergeSelectOptions(current, [normalized]),
              );
              onPreferredCategoriesChange(
                dedupeSelectValues([...preferredCategories, normalized]),
              );
            }}
            formatCreateLabel={(inputValue) => {
              const normalized = normalizeProfileListItem(inputValue);
              return normalized ? `Create "${normalized}"` : "Create";
            }}
            isValidNewOption={(inputValue, selectValue, selectOptions) => {
              const normalized = normalizeProfileListItem(inputValue);
              if (!normalized) {
                return false;
              }

              const nextValue = normalized.toLocaleLowerCase();
              const existingOptions = [
                ...selectValue,
                ...selectOptions.flatMap((option) =>
                  "options" in option ? option.options : [option],
                ),
              ];

              return !existingOptions.some(
                (option) =>
                  option.value.toLocaleLowerCase() === nextValue,
              );
            }}
            placeholder="Search or create categories"
            className="w-full"
            aria-invalid={Boolean(preferredCategoriesError)}
            styles={createSharedSelectStyles(Boolean(preferredCategoriesError))}
          />
        </>
      </SelectField>
    </div>
  );
}
