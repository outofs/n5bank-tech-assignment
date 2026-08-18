export function formatCurrency(
  value: number | string | { toString(): string },
  currency: string,
  locale = "en-GB",
) {
  const numericValue =
    typeof value === "number" ? value : Number(value.toString());

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(numericValue);
}

export function formatDate(value: string | Date, locale = "en-GB") {
  const date = value instanceof Date ? value : new Date(value);

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
