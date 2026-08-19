import type { Prisma } from "@prisma/client";

export const smartMatchBuyerProfileSelect = {
  minInvestment: true,
  maxInvestment: true,
  preferredCountries: true,
  preferredCategories: true,
} satisfies Prisma.BuyerProfileSelect;

export type SmartMatchBuyerProfile = Prisma.BuyerProfileGetPayload<{
  select: typeof smartMatchBuyerProfileSelect;
}>;

export const smartMatchAssetSelect = {
  askingPrice: true,
  country: true,
  category: true,
} satisfies Prisma.AssetSelect;

export type SmartMatchAsset = Prisma.AssetGetPayload<{
  select: typeof smartMatchAssetSelect;
}>;

type SmartMatchDecimalLike = { toString(): string } | number | string | null | undefined;

export type SmartMatchBuyerPreferences = {
  minInvestment?: SmartMatchDecimalLike;
  maxInvestment?: SmartMatchDecimalLike;
  preferredCountries?: string[];
  preferredCategories?: string[];
};

export type SmartMatchAssetCandidate = {
  askingPrice: SmartMatchDecimalLike;
  country: string;
  category: string;
};

export type SmartMatchReason =
  | "Asking price is within your investment range"
  | "Asking price clears your minimum investment threshold"
  | "Asking price is below your maximum investment ceiling"
  | "Located in one of your target countries"
  | "Matches your preferred category";

export type SmartMatchResult = {
  score: number;
  reasons: SmartMatchReason[];
};

export type SmartMatchRankedAsset = {
  id: string;
  title: string;
  createdAt: Date;
  smartMatch: SmartMatchResult | null;
};

type SmartMatchCriterionResult = {
  applicableWeight: number;
  earnedWeight: number;
  reason?: SmartMatchReason;
};

// Weights prioritize price fit first, then strategic category fit, then geography.
const SMART_MATCH_WEIGHTS = {
  price: 50,
  category: 30,
  country: 20,
} as const;

function normalizeText(value: string) {
  return value.trim().toLocaleLowerCase();
}

function normalizePreferenceList(values: string[] | undefined) {
  if (!values) {
    return [];
  }

  return values
    .map((value) => normalizeText(value))
    .filter((value) => value.length > 0);
}

export function hasSmartMatchPreferences(
  profile?: SmartMatchBuyerProfile | SmartMatchBuyerPreferences | null,
) {
  return Boolean(
    profile?.preferredCountries?.some((value) => normalizeText(value).length > 0) ||
      profile?.preferredCategories?.some(
        (value) => normalizeText(value).length > 0,
      ),
  );
}

function parseDecimalLike(value: SmartMatchDecimalLike) {
  if (value === null || value === undefined) {
    return undefined;
  }

  const parsed = Number(value.toString());
  return Number.isFinite(parsed) ? parsed : undefined;
}

function evaluatePriceMatch(
  buyer: SmartMatchBuyerPreferences | null | undefined,
  asset: SmartMatchAssetCandidate,
): SmartMatchCriterionResult {
  const buyerPreferences = buyer ?? {};
  const askingPrice = parseDecimalLike(asset.askingPrice);
  const minInvestment = parseDecimalLike(buyerPreferences.minInvestment);
  const maxInvestment = parseDecimalLike(buyerPreferences.maxInvestment);

  if (askingPrice === undefined) {
    return {
      applicableWeight: 0,
      earnedWeight: 0,
    };
  }

  const hasMin = minInvestment !== undefined;
  const hasMax = maxInvestment !== undefined;

  if (!hasMin && !hasMax) {
    return {
      applicableWeight: 0,
      earnedWeight: 0,
    };
  }

  if (
    hasMin &&
    hasMax &&
    minInvestment !== undefined &&
    maxInvestment !== undefined &&
    minInvestment <= maxInvestment &&
    askingPrice >= minInvestment &&
    askingPrice <= maxInvestment
  ) {
    return {
      applicableWeight: SMART_MATCH_WEIGHTS.price,
      earnedWeight: SMART_MATCH_WEIGHTS.price,
      reason: "Asking price is within your investment range",
    };
  }

  if (hasMin && hasMax && minInvestment !== undefined && maxInvestment !== undefined) {
    return {
      applicableWeight: SMART_MATCH_WEIGHTS.price,
      earnedWeight: 0,
    };
  }

  if (hasMin && minInvestment !== undefined && askingPrice >= minInvestment) {
    return {
      applicableWeight: SMART_MATCH_WEIGHTS.price,
      earnedWeight: SMART_MATCH_WEIGHTS.price,
      reason: "Asking price clears your minimum investment threshold",
    };
  }

  if (hasMax && maxInvestment !== undefined && askingPrice <= maxInvestment) {
    return {
      applicableWeight: SMART_MATCH_WEIGHTS.price,
      earnedWeight: SMART_MATCH_WEIGHTS.price,
      reason: "Asking price is below your maximum investment ceiling",
    };
  }

  return {
    applicableWeight: SMART_MATCH_WEIGHTS.price,
    earnedWeight: 0,
  };
}

function evaluateListMatch({
  values,
  candidate,
  weight,
  reason,
}: {
  values: string[] | undefined;
  candidate: string;
  weight: number;
  reason: SmartMatchReason;
}): SmartMatchCriterionResult {
  const normalizedValues = normalizePreferenceList(values);

  if (normalizedValues.length === 0) {
    return {
      applicableWeight: 0,
      earnedWeight: 0,
    };
  }

  const matches = normalizedValues.includes(normalizeText(candidate));

  return {
    applicableWeight: weight,
    earnedWeight: matches ? weight : 0,
    reason: matches ? reason : undefined,
  };
}

export function calculateSmartMatchScore(
  buyer: SmartMatchBuyerPreferences | null | undefined,
  asset: SmartMatchAssetCandidate,
): SmartMatchResult {
  const buyerPreferences = buyer ?? {};
  const priceMatch = evaluatePriceMatch(buyer, asset);
  const countryMatch = evaluateListMatch({
    values: buyerPreferences.preferredCountries,
    candidate: asset.country,
    weight: SMART_MATCH_WEIGHTS.country,
    reason: "Located in one of your target countries",
  });
  const categoryMatch = evaluateListMatch({
    values: buyerPreferences.preferredCategories,
    candidate: asset.category,
    weight: SMART_MATCH_WEIGHTS.category,
    reason: "Matches your preferred category",
  });

  const criteria = [priceMatch, countryMatch, categoryMatch];
  const applicableWeight = criteria.reduce(
    (total, criterion) => total + criterion.applicableWeight,
    0,
  );
  const earnedWeight = criteria.reduce(
    (total, criterion) => total + criterion.earnedWeight,
    0,
  );

  return {
    score:
      applicableWeight === 0
        ? 0
        : Math.round((earnedWeight / applicableWeight) * 100),
    reasons: criteria.flatMap((criterion) =>
      criterion.reason ? [criterion.reason] : [],
    ),
  };
}

export function sortAssetsBySmartMatch<T extends SmartMatchRankedAsset>(
  assets: T[],
) {
  return [...assets].sort((left, right) => {
    const leftScore = left.smartMatch?.score ?? 0;
    const rightScore = right.smartMatch?.score ?? 0;

    if (leftScore !== rightScore) {
      return rightScore - leftScore;
    }

    const createdAtDelta =
      right.createdAt.getTime() - left.createdAt.getTime();

    if (createdAtDelta !== 0) {
      return createdAtDelta;
    }

    const titleDelta = left.title.localeCompare(right.title);
    if (titleDelta !== 0) {
      return titleDelta;
    }

    return left.id.localeCompare(right.id);
  });
}
