type AdminUsersFeedbackProps = {
  tone: "success" | "error";
  message: string;
};

export function AdminUsersFeedback({ tone, message }: AdminUsersFeedbackProps) {
  const toneClass =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : "border-rose-200 bg-rose-50 text-rose-900";

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${toneClass}`}>
      {message}
    </div>
  );
}
