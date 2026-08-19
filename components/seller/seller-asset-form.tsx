"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { emptySellerAssetCreateState } from "@/lib/seller-asset-form";
import { createSellerAssetAction } from "@/app/seller/assets/new/actions";
import { updateSellerAssetAction } from "@/app/seller/assets/[id]/edit/actions";
import type {
  SellerAssetCreateState,
  SellerAssetFormValues,
  SellerAssetStatus,
} from "@/lib/seller-asset-form";
import { SellerAssetSelectFields } from "./seller-asset-select-fields";

const INPUT_CLASS =
  "h-11 w-full rounded-xl border border-stone-300 bg-white px-3 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-stone-500";
const TEXTAREA_CLASS =
  "min-h-28 w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-stone-500";
const LABEL_CLASS =
  "text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500";

function SubmitButton({
  intent,
  children,
  tone = "primary",
}: {
  intent: "draft" | "publish" | "save" | "unpublish";
  children: string;
  tone?: "primary" | "secondary";
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      name="intent"
      value={intent}
      disabled={pending}
      className={
        tone === "primary"
          ? "inline-flex h-11 items-center justify-center rounded-xl bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
          : "inline-flex h-11 items-center justify-center rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-60"
      }
    >
      {pending ? "Saving..." : children}
    </button>
  );
}

function ErrorText({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-1 text-sm text-rose-700">{message}</p>;
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className={LABEL_CLASS}>{label}</span>
      {children}
      <ErrorText message={error} />
    </label>
  );
}

type SellerAssetFormMode = "create" | "edit";

type SellerAssetFormAction = {
  intent: "draft" | "publish" | "save" | "unpublish";
  label: string;
  tone?: "primary" | "secondary";
};

export function SellerAssetForm({
  initialValues,
  state,
  mode = "create",
  assetId,
  currentStatus,
  actions,
  cancelHref = "/seller/assets",
  categoryOptions,
  assetTypeOptions,
  licenseTypeOptions,
}: {
  initialValues: SellerAssetFormValues;
  state?: SellerAssetCreateState;
  mode?: SellerAssetFormMode;
  assetId?: string;
  currentStatus?: SellerAssetStatus;
  actions?: SellerAssetFormAction[];
  cancelHref?: string;
  categoryOptions: string[];
  assetTypeOptions: string[];
  licenseTypeOptions: string[];
}) {
  const [values, setValues] = useState(initialValues);
  const [actionState, formAction] = useActionState(
    mode === "edit" ? updateSellerAssetAction : createSellerAssetAction,
    state ?? emptySellerAssetCreateState,
  );

  const currentState = state ?? actionState;
  const submitActions =
    actions ??
    (mode === "edit"
      ? currentStatus === "PUBLISHED"
        ? [
            {
              intent: "save" as const,
              label: "Save changes",
              tone: "secondary" as const,
            },
            {
              intent: "unpublish" as const,
              label: "Unpublish to DRAFT",
            },
          ]
        : currentStatus === "SUSPENDED"
          ? [
              {
                intent: "save" as const,
                label: "Save changes",
              },
            ]
          : [
              {
                intent: "save" as const,
                label: "Save changes",
                tone: "secondary" as const,
              },
              {
                intent: "publish" as const,
                label: "Publish",
              },
            ]
      : [
          {
            intent: "draft" as const,
            label: "Save draft",
            tone: "secondary" as const,
          },
          {
            intent: "publish" as const,
            label: "Publish",
          },
        ]);

  return (
    <form action={formAction} className="space-y-6">
      {mode === "edit" && assetId ? (
        <input type="hidden" name="assetId" value={assetId} />
      ) : null}

      {currentState.errors.form ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {currentState.errors.form}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <FormField label="Title" error={currentState.errors.title}>
            <input
              name="title"
              value={values.title}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              className={INPUT_CLASS}
            />
          </FormField>
        </div>

        <div className="sm:col-span-2">
        <div className="sm:col-span-2">
          <SellerAssetSelectFields
            country={values.country}
            category={values.category}
            assetType={values.assetType}
            businessStatus={values.businessStatus}
            currency={values.currency}
            licenseType={values.licenseType}
            countryError={currentState.errors.country}
            categoryError={currentState.errors.category}
            assetTypeError={currentState.errors.assetType}
            businessStatusError={currentState.errors.businessStatus}
            currencyError={currentState.errors.currency}
            licenseTypeError={currentState.errors.licenseType}
            categoryOptions={categoryOptions}
            assetTypeOptions={assetTypeOptions}
            licenseTypeOptions={licenseTypeOptions}
            onCountryChange={(country) =>
              setValues((current) => ({ ...current, country }))
            }
            onCategoryChange={(category) =>
              setValues((current) => ({ ...current, category }))
            }
            onAssetTypeChange={(assetType) =>
              setValues((current) => ({ ...current, assetType }))
            }
            onBusinessStatusChange={(businessStatus) =>
              setValues((current) => ({ ...current, businessStatus }))
            }
            onCurrencyChange={(currency) =>
              setValues((current) => ({ ...current, currency }))
            }
            onLicenseTypeChange={(licenseType) =>
              setValues((current) => ({ ...current, licenseType }))
            }
          />
        </div>
        </div>

        <FormField label="Asking price" error={currentState.errors.askingPrice}>
          <input
            type="number"
            name="askingPrice"
            min="0.01"
            step="0.01"
            value={values.askingPrice}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                askingPrice: event.target.value,
              }))
            }
            className={INPUT_CLASS}
          />
        </FormField>

        <FormField label="Employees" error={currentState.errors.employees}>
          <input
            type="number"
            name="employees"
            min="0"
            step="1"
            value={values.employees}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                employees: event.target.value,
              }))
            }
            className={INPUT_CLASS}
          />
        </FormField>
      </div>

      <FormField label="Description" error={currentState.errors.description}>
        <textarea
          name="description"
          rows={6}
          value={values.description}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              description: event.target.value,
            }))
          }
          className={TEXTAREA_CLASS}
        />
      </FormField>

      <FormField
        label="Founded year"
        error={currentState.errors.foundedYear}
      >
        <input
          type="number"
          name="foundedYear"
          min="1900"
          max="2100"
          step="1"
          value={values.foundedYear}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              foundedYear: event.target.value,
            }))
          }
          className={INPUT_CLASS}
        />
      </FormField>

      <div className="flex flex-wrap items-center gap-3 border-t border-stone-200 pt-4">
        {submitActions.map((action) => (
          <SubmitButton
            key={action.intent}
            intent={action.intent}
            tone={action.tone}
          >
            {action.label}
          </SubmitButton>
        ))}
        <Link
          href={cancelHref}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

export type { SellerAssetFormValues };
