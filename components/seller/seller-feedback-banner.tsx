type SellerFeedbackBannerProps = {
  message: string;
  tone?: "success" | "error";
};

const BANNER_TONES: Record<NonNullable<SellerFeedbackBannerProps["tone"]>, string> =
  {
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
    error: "border-rose-200 bg-rose-50 text-rose-900",
  };

export function SellerFeedbackBanner({
  message,
  tone = "success",
}: SellerFeedbackBannerProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm ${BANNER_TONES[tone]}`}
    >
      {message}
    </div>
  );
}
