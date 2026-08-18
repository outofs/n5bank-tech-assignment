import { z } from "zod";

export const USER_ROLES = ["BUYER", "SELLER", "MANAGER"] as const;
export const USER_STATUSES = ["ACTIVE", "SUSPENDED"] as const;
export const ASSET_STATUSES = ["DRAFT", "PUBLISHED", "SUSPENDED"] as const;
export const CONTACT_REQUEST_STATUSES = ["PENDING", "ACCEPTED", "DECLINED"] as const;

export const MARKET_COUNTRIES = [
  "United Kingdom",
  "Lithuania",
  "Estonia",
  "Germany",
  "Poland",
  "Spain",
  "Singapore",
  "UAE",
] as const;

export const MARKET_CATEGORIES = [
  "Payments",
  "EMI",
  "Fintech",
  "Banking",
  "Crypto",
  "Lending",
  "Wealth Management",
] as const;

export const ASSET_TYPES = [
  "Licensed entity",
  "Payment processor",
  "Fintech platform",
  "Crypto business",
  "Lending platform",
  "Wealth business",
] as const;

export const BUSINESS_STATUSES = [
  "Regulated and active",
  "Revenue-generating",
  "Scaling",
  "Pre-profit",
  "Under review",
] as const;

export const CURRENCIES = ["GBP", "EUR", "USD", "SGD", "AED"] as const;

export const userRoleSchema = z.enum(USER_ROLES);
export const userStatusSchema = z.enum(USER_STATUSES);
export const assetStatusSchema = z.enum(ASSET_STATUSES);
export const contactRequestStatusSchema = z.enum(CONTACT_REQUEST_STATUSES);
export const countrySchema = z.enum(MARKET_COUNTRIES);
export const categorySchema = z.enum(MARKET_CATEGORIES);
export const assetTypeSchema = z.enum(ASSET_TYPES);
export const businessStatusSchema = z.enum(BUSINESS_STATUSES);
export const currencySchema = z.enum(CURRENCIES);
