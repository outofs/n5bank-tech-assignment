"use client";

import { useId, useState } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import type { ReactNode } from "react";
import type { SingleValue } from "react-select";

import { COUNTRY_SELECT_OPTIONS } from "@/lib/countries";
import {
  mergeSelectOptions,
  normalizeSelectOptions,
  normalizeSelectValue,
  toSelectOption,
  type SelectOption,
} from "@/lib/select-options";
import { createSharedSelectStyles } from "@/lib/select-styles";
import { SELLER_OPERATING_STATUSES } from "@/lib/seller-asset-form";

const LABEL_CLASS =
  "text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500";

const INPUT_CLASS =
  "h-11 w-full rounded-xl border border-stone-300 bg-white px-3 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-stone-500";

type SellerAssetSelectFieldsProps = {
  country: string;
  category: string;
  assetType: string;
  businessStatus: string;
  currency: string;
  licenseType: string;
  countryError?: string;
  categoryError?: string;
  assetTypeError?: string;
  businessStatusError?: string;
  currencyError?: string;
  licenseTypeError?: string;
  categoryOptions: string[];
  assetTypeOptions: string[];
  licenseTypeOptions: string[];
  onCountryChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onAssetTypeChange: (value: string) => void;
  onBusinessStatusChange: (value: string) => void;
  onCurrencyChange: (value: string) => void;
  onLicenseTypeChange: (value: string) => void;
};

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
    <label className="flex min-w-0 flex-col gap-1.5" htmlFor={htmlFor}>
      <span className={LABEL_CLASS}>{label}</span>
      {children}
      {error ? <p className="mt-1 text-sm text-rose-700">{error}</p> : null}
    </label>
  );
}

function createSelectOptionLabel(value: string) {
  return value ? `Create "${value}"` : "Create";
}

export function SellerAssetSelectFields({
  country,
  category,
  assetType,
  businessStatus,
  currency,
  licenseType,
  countryError,
  categoryError,
  assetTypeError,
  businessStatusError,
  currencyError,
  licenseTypeError,
  categoryOptions,
  assetTypeOptions,
  licenseTypeOptions,
  onCountryChange,
  onCategoryChange,
  onAssetTypeChange,
  onBusinessStatusChange,
  onCurrencyChange,
  onLicenseTypeChange,
}: SellerAssetSelectFieldsProps) {
  const countryInputId = useId();
  const categoryInputId = useId();
  const assetTypeInputId = useId();
  const operatingStatusInputId = useId();
  const currencyInputId = useId();
  const licenseTypeInputId = useId();

  const [availableCategories, setAvailableCategories] = useState<SelectOption[]>(
    () => mergeSelectOptions(normalizeSelectOptions(categoryOptions), [category]),
  );
  const [availableAssetTypes, setAvailableAssetTypes] = useState<SelectOption[]>(
    () =>
      mergeSelectOptions(normalizeSelectOptions(assetTypeOptions), [assetType]),
  );
  const [availableLicenseTypes, setAvailableLicenseTypes] = useState<
    SelectOption[]
  >(() =>
    mergeSelectOptions(normalizeSelectOptions(licenseTypeOptions), [licenseType]),
  );

  const categoryValue = toSelectOption(category, availableCategories);
  const assetTypeValue = toSelectOption(assetType, availableAssetTypes);
  const licenseTypeValue = toSelectOption(licenseType, availableLicenseTypes);

  const operatingStatusOptions = SELLER_OPERATING_STATUSES.map((value) => ({
    value,
    label: value,
  }));
  const operatingStatusValue = toSelectOption(
    businessStatus,
    operatingStatusOptions,
  );
  const countryValue = toSelectOption(country, COUNTRY_SELECT_OPTIONS);
  const currencyOptions = [
    { value: "EUR", label: "EUR - Euro" },
    { value: "GBP", label: "GBP - British pound" },
    { value: "USD", label: "USD - US dollar" },
    { value: "SGD", label: "SGD - Singapore dollar" },
    { value: "AED", label: "AED - UAE dirham" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <SelectField label="Country" htmlFor={countryInputId} error={countryError}>
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
        label="Category"
        htmlFor={categoryInputId}
        error={categoryError}
      >
        <>
          <input type="hidden" name="category" value={category} />
          <CreatableSelect<SelectOption, false>
            inputId={categoryInputId}
            instanceId={categoryInputId}
            isClearable={false}
            isSearchable
            options={availableCategories}
            value={categoryValue}
            onChange={(option: SingleValue<SelectOption>) =>
              onCategoryChange(option?.value ?? "")
            }
            onCreateOption={(inputValue) => {
              const normalized = normalizeSelectValue(inputValue);
              if (!normalized) {
                return;
              }

              setAvailableCategories((current) =>
                mergeSelectOptions(current, [normalized]),
              );
              onCategoryChange(normalized);
            }}
            formatCreateLabel={createSelectOptionLabel}
            isValidNewOption={(inputValue, selectValue, selectOptions) => {
              const normalized = normalizeSelectValue(inputValue);
              if (!normalized) {
                return false;
              }

              const existingOptions = [
                ...selectValue,
                ...selectOptions.flatMap((option) =>
                  "options" in option ? option.options : [option],
                ),
              ];

              return !existingOptions.some((option) =>
                option.value.toLocaleLowerCase() ===
                normalized.toLocaleLowerCase(),
              );
            }}
            placeholder="Search or create categories"
            className="w-full"
            aria-invalid={Boolean(categoryError)}
            styles={createSharedSelectStyles(Boolean(categoryError))}
          />
        </>
      </SelectField>

      <SelectField
        label="Asset type"
        htmlFor={assetTypeInputId}
        error={assetTypeError}
      >
        <>
          <input type="hidden" name="assetType" value={assetType} />
          <CreatableSelect<SelectOption, false>
            inputId={assetTypeInputId}
            instanceId={assetTypeInputId}
            isClearable={false}
            isSearchable
            options={availableAssetTypes}
            value={assetTypeValue}
            onChange={(option: SingleValue<SelectOption>) =>
              onAssetTypeChange(option?.value ?? "")
            }
            onCreateOption={(inputValue) => {
              const normalized = normalizeSelectValue(inputValue);
              if (!normalized) {
                return;
              }

              setAvailableAssetTypes((current) =>
                mergeSelectOptions(current, [normalized]),
              );
              onAssetTypeChange(normalized);
            }}
            formatCreateLabel={createSelectOptionLabel}
            isValidNewOption={(inputValue, selectValue, selectOptions) => {
              const normalized = normalizeSelectValue(inputValue);
              if (!normalized) {
                return false;
              }

              const existingOptions = [
                ...selectValue,
                ...selectOptions.flatMap((option) =>
                  "options" in option ? option.options : [option],
                ),
              ];

              return !existingOptions.some((option) =>
                option.value.toLocaleLowerCase() ===
                normalized.toLocaleLowerCase(),
              );
            }}
            placeholder="Search or create asset types"
            className="w-full"
            aria-invalid={Boolean(assetTypeError)}
            styles={createSharedSelectStyles(Boolean(assetTypeError))}
          />
        </>
      </SelectField>

      <SelectField
        label="Operating status"
        htmlFor={operatingStatusInputId}
        error={businessStatusError}
      >
        <>
          <input
            type="hidden"
            name="businessStatus"
            value={businessStatus}
          />
          <Select<SelectOption, false>
            inputId={operatingStatusInputId}
            instanceId={operatingStatusInputId}
            isClearable={false}
            isSearchable={false}
            options={operatingStatusOptions}
            value={operatingStatusValue}
            onChange={(option: SingleValue<SelectOption>) =>
              onBusinessStatusChange(option?.value ?? "")
            }
            placeholder="Select operating status"
            className="w-full"
            aria-invalid={Boolean(businessStatusError)}
            styles={createSharedSelectStyles(Boolean(businessStatusError))}
          />
          <p className="text-xs leading-5 text-stone-500">
            Operating status describes the underlying business, not the listing status.
          </p>
        </>
      </SelectField>

      <SelectField
        label="Currency"
        htmlFor={currencyInputId}
        error={currencyError}
      >
        <>
          <select
            id={currencyInputId}
            name="currency"
            value={currency}
            onChange={(event) => onCurrencyChange(event.target.value)}
            className={INPUT_CLASS}
          >
            {currencyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </>
      </SelectField>

      <div className="sm:col-span-2">
        <SelectField
          label="License type"
          htmlFor={licenseTypeInputId}
          error={licenseTypeError}
        >
          <>
            <input type="hidden" name="licenseType" value={licenseType} />
            <CreatableSelect<SelectOption, false>
              inputId={licenseTypeInputId}
              instanceId={licenseTypeInputId}
              isClearable
              isSearchable
              options={availableLicenseTypes}
              value={licenseTypeValue}
              onChange={(option: SingleValue<SelectOption>) =>
                onLicenseTypeChange(option?.value ?? "")
              }
              onCreateOption={(inputValue) => {
                const normalized = normalizeSelectValue(inputValue);
                if (!normalized) {
                  return;
                }

                setAvailableLicenseTypes((current) =>
                  mergeSelectOptions(current, [normalized]),
                );
                onLicenseTypeChange(normalized);
              }}
              formatCreateLabel={createSelectOptionLabel}
              isValidNewOption={(inputValue, selectValue, selectOptions) => {
                const normalized = normalizeSelectValue(inputValue);
                if (!normalized) {
                  return false;
                }

                const existingOptions = [
                  ...selectValue,
                  ...selectOptions.flatMap((option) =>
                    "options" in option ? option.options : [option],
                  ),
                ];

                return !existingOptions.some((option) =>
                  option.value.toLocaleLowerCase() ===
                  normalized.toLocaleLowerCase(),
                );
              }}
              placeholder="Search or create license types"
              className="w-full"
              aria-invalid={Boolean(licenseTypeError)}
              styles={createSharedSelectStyles(Boolean(licenseTypeError))}
            />
          </>
        </SelectField>
      </div>
    </div>
  );
}
