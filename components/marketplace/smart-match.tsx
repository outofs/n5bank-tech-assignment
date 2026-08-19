import Link from "next/link";

import { type SmartMatchResult } from "@/lib/smart-match";

function getScoreTone(score: number) {
  if (score >= 80) {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }

  if (score >= 50) {
    return "border-amber-200 bg-amber-50 text-amber-800";
  }

  return "border-stone-200 bg-stone-50 text-stone-700";
}

export function SmartMatchBadge({ score }: { score: number }) {
  return (
    <span
      aria-label={`Smart Match ${score} percent`}
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${getScoreTone(score)}`}
    >
      Smart Match {score}%
    </span>
  );
}

export function SmartMatchPanel({
  match,
  ctaHref,
}: {
  match: SmartMatchResult | null;
  ctaHref: string;
}) {
  if (!match) {
    return (
      <section className="rounded-2xl border border-stone-200 bg-stone-50 p-5 shadow-sm sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
          Smart Match
        </p>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Complete your investment profile to see personalized matches.
        </p>
        <Link
          href={ctaHref}
          className="mt-4 inline-flex items-center rounded-full border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
        >
          Complete profile
        </Link>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 shadow-sm sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
        Smart Match
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <SmartMatchBadge score={match.score} />
        <p className="text-sm font-medium text-stone-900">
          {match.reasons.length > 0
            ? "This asset aligns with your saved preferences."
            : "This asset does not match any of your saved preferences."}
        </p>
      </div>
      <div className="mt-4 space-y-2">
        {match.reasons.length > 0 ? (
          match.reasons.map((reason) => (
            <p key={reason} className="text-sm leading-6 text-stone-700">
              {reason}
            </p>
          ))
        ) : (
          <p className="text-sm leading-6 text-stone-700">
            Update your profile to improve future matches.
          </p>
        )}
      </div>
      <p className="mt-4 text-xs leading-5 text-stone-500">
        Score based on your investment range, preferred countries, and preferred
        categories.
      </p>
    </section>
  );
}
