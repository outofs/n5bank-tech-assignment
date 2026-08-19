"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  emptyContactRequestFormState,
  type ContactRequestFormState,
} from "@/lib/contact-request";

const TEXTAREA_CLASS =
  "min-h-28 w-full rounded-3xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-[var(--accent)] focus:ring-4 focus:ring-indigo-100";

type ContactRequestAction = (
  state: ContactRequestFormState,
  formData: FormData,
) => Promise<ContactRequestFormState>;

type ContactRequestFormProps = {
  action: ContactRequestAction;
  recipientName: string;
  recipientCompany: string;
  recipientRoleLabel: string;
  contextLabel: string;
  contextValue: string;
  contextFieldName: "assetId" | "buyerId";
  contextFieldValue: string;
  submitLabel: string;
  tone?: "dark" | "light";
};

function SubmitButton({
  label,
  tone = "light",
}: {
  label: string;
  tone?: "dark" | "light";
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={
        tone === "dark"
          ? "inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          : "inline-flex h-11 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
      }
    >
      {pending ? "Sending..." : label}
    </button>
  );
}

export function ContactRequestForm({
  action,
  recipientName,
  recipientCompany,
  recipientRoleLabel,
  contextLabel,
  contextValue,
  contextFieldName,
  contextFieldValue,
  submitLabel,
  tone = "light",
}: ContactRequestFormProps) {
  const [state, formAction] = useActionState(
    action,
    emptyContactRequestFormState,
  );

  return (
    <div
      className={
        tone === "dark"
          ? "rounded-[1.75rem] border border-slate-900 bg-slate-950 p-5 text-white shadow-[0_30px_60px_-36px_rgba(15,23,42,0.8)] sm:p-6"
          : "rounded-[1.75rem] border border-[var(--border)] bg-white p-5 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.28)] sm:p-6"
      }
    >
      <p
        className={
          tone === "dark"
            ? "text-[0.72rem] font-semibold text-slate-300"
            : "text-[0.72rem] font-semibold text-slate-500"
        }
      >
        Contact action
      </p>

      <div className="mt-3 space-y-1.5">
        <h2 className="text-xl font-semibold tracking-tight">
          {submitLabel}
        </h2>
        <p className={tone === "dark" ? "text-sm text-stone-300" : "text-sm text-stone-600"}>
          {recipientName} | {recipientCompany}
        </p>
        <p className={tone === "dark" ? "text-sm text-stone-300" : "text-sm text-stone-600"}>
          {recipientRoleLabel}
        </p>
        <p className={tone === "dark" ? "text-sm text-stone-300" : "text-sm text-stone-600"}>
          {contextLabel}: {contextValue}
        </p>
      </div>

      <form action={formAction} className="mt-4 space-y-4">
        <input
          type="hidden"
          name={contextFieldName}
          value={contextFieldValue}
        />

        {state.successMessage ? (
          <div
            className={
              tone === "dark"
                ? "rounded-3xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
                : "rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
            }
          >
            {state.successMessage}
          </div>
        ) : null}

        {state.errors.form ? (
          <div
            className={
              tone === "dark"
                ? "rounded-3xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
                : "rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
            }
          >
            {state.errors.form}
          </div>
        ) : null}

        <label className="flex min-w-0 flex-col gap-1.5">
          <span
            className={
              tone === "dark"
                ? "text-[0.72rem] font-semibold text-slate-300"
                : "text-[0.72rem] font-semibold text-slate-500"
            }
          >
            Message
          </span>
          <textarea
            key={state.successMessage || "message"}
            name="message"
            rows={5}
            placeholder="Write a short introduction and explain why you want to connect."
            className={TEXTAREA_CLASS}
          />
          {state.errors.message ? (
            <p
              className={
                tone === "dark" ? "text-sm text-rose-200" : "text-sm text-rose-700"
              }
            >
              {state.errors.message}
            </p>
          ) : null}
        </label>

        <SubmitButton label={submitLabel} tone={tone} />
      </form>
    </div>
  );
}
