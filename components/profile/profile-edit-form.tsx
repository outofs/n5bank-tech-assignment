"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import {
  emptyBuyerProfileEditState,
  type BuyerProfileEditState,
  type BuyerProfileEditFormValues,
} from "@/lib/buyer-profile-form";
import { updateBuyerProfileAction } from "@/app/profile/edit/actions";

const INPUT_CLASS =
  "h-11 w-full rounded-xl border border-stone-300 bg-white px-3 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-stone-500";
const TEXTAREA_CLASS =
  "min-h-28 w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-stone-500";
const LABEL_CLASS =
  "text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 items-center justify-center rounded-xl bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving..." : "Save changes"}
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

export function ProfileEditForm({
  initialValues,
  state,
}: {
  initialValues: BuyerProfileEditFormValues;
  state?: BuyerProfileEditState;
}) {
  const [values, setValues] = useState(initialValues);
  const [actionState, formAction] = useActionState(
    updateBuyerProfileAction,
    state ?? emptyBuyerProfileEditState,
  );

  const currentState = state ?? actionState;

  return (
    <form action={formAction} className="space-y-6">
      {currentState.errors.form ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {currentState.errors.form}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Name" error={currentState.errors.name}>
          <input
            name="name"
            value={values.name}
            onChange={(event) =>
              setValues((current) => ({ ...current, name: event.target.value }))
            }
            className={INPUT_CLASS}
          />
        </FormField>

        <FormField label="Company" error={currentState.errors.company}>
          <input
            name="company"
            value={values.company}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                company: event.target.value,
              }))
            }
            className={INPUT_CLASS}
          />
        </FormField>

        <FormField label="Country" error={currentState.errors.country}>
          <input
            name="country"
            value={values.country}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                country: event.target.value,
              }))
            }
            className={INPUT_CLASS}
          />
        </FormField>

        <FormField
          label="Minimum investment"
          error={currentState.errors.minInvestment}
        >
          <input
            type="number"
            name="minInvestment"
            min="0"
            step="0.01"
            value={values.minInvestment}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                minInvestment: event.target.value,
              }))
            }
            className={INPUT_CLASS}
          />
        </FormField>

        <FormField
          label="Maximum investment"
          error={currentState.errors.maxInvestment}
        >
          <input
            type="number"
            name="maxInvestment"
            min="0"
            step="0.01"
            value={values.maxInvestment}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                maxInvestment: event.target.value,
              }))
            }
            className={INPUT_CLASS}
          />
        </FormField>
      </div>

      <FormField label="Bio" error={currentState.errors.bio}>
        <textarea
          name="bio"
          rows={5}
          value={values.bio}
          onChange={(event) =>
            setValues((current) => ({ ...current, bio: event.target.value }))
          }
          className={TEXTAREA_CLASS}
        />
      </FormField>

      <FormField
        label="Investment thesis"
        error={currentState.errors.investmentThesis}
      >
        <textarea
          name="investmentThesis"
          rows={5}
          value={values.investmentThesis}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              investmentThesis: event.target.value,
            }))
          }
          className={TEXTAREA_CLASS}
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Preferred countries"
          error={currentState.errors.preferredCountries}
        >
          <textarea
            name="preferredCountries"
            rows={5}
            value={values.preferredCountries}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                preferredCountries: event.target.value,
              }))
            }
            placeholder="One per line or comma-separated"
            className={TEXTAREA_CLASS}
          />
        </FormField>

        <FormField
          label="Preferred categories"
          error={currentState.errors.preferredCategories}
        >
          <textarea
            name="preferredCategories"
            rows={5}
            value={values.preferredCategories}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                preferredCategories: event.target.value,
              }))
            }
            placeholder="One per line or comma-separated"
            className={TEXTAREA_CLASS}
          />
        </FormField>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-stone-200 pt-4">
        <SubmitButton />
        <Link
          href="/profile"
          className="inline-flex h-11 items-center justify-center rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
