import type { Prisma } from "@prisma/client";
import { z } from "zod";

export const SELLER_ASSET_CURRENCIES = ["EUR", "GBP", "USD", "SGD", "AED"] as const;
export const SELLER_ASSET_STATUSES = [
  "DRAFT",
  "PUBLISHED",
  "SUSPENDED",
] as const;

export const sellerAssetCreateIntentSchema = z.enum(["draft", "publish"]);
export const sellerAssetEditIntentSchema = z.enum([
  "save",
  "publish",
  "unpublish",
]);

export type SellerAssetStatus = (typeof SELLER_ASSET_STATUSES)[number];
export type SellerAssetFormValues = {
  title: string;
  description: string;
  country: string;
  category: string;
  assetType: string;
  businessStatus: string;
  askingPrice: string;
  currency: string;
  employees: string;
  foundedYear: string;
  licenseType: string;
};

export const sellerAssetFormAssetSelect = {
  id: true,
  title: true,
  description: true,
  country: true,
  category: true,
  assetType: true,
  businessStatus: true,
  askingPrice: true,
  currency: true,
  employees: true,
  foundedYear: true,
  licenseType: true,
  status: true,
  updatedAt: true,
} satisfies Prisma.AssetSelect;

export type SellerAssetFormAsset = Prisma.AssetGetPayload<{
  select: typeof sellerAssetFormAssetSelect;
}>;

function requiredText(label: string) {
  return z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : ""),
    z.string().min(1, `${label} is required`),
  );
}

function optionalText() {
  return z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : ""),
    z.string().transform((value) => (value === "" ? undefined : value)),
  );
}

function positiveMoney(label: string) {
  return z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : ""),
    z
      .string()
      .min(1, `${label} is required`)
      .transform((value) => Number(value))
      .refine((value) => Number.isFinite(value), {
        message: `${label} must be a valid number`,
      })
      .refine((value) => value > 0, {
        message: `${label} must be greater than 0`,
      }),
  );
}

function optionalInteger(label: string, min: number, max?: number) {
  let schema = z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : ""),
    z
      .string()
      .transform((value) => (value === "" ? undefined : Number(value)))
      .refine((value) => value === undefined || Number.isFinite(value), {
        message: `${label} must be a valid whole number`,
      })
      .refine((value) => value === undefined || Number.isInteger(value), {
        message: `${label} must be a valid whole number`,
      })
      .refine((value) => value === undefined || value >= min, {
        message: `${label} must be at least ${min}`,
      }),
  );

  if (typeof max === "number") {
    schema = schema.refine(
      (value) => value === undefined || value <= max,
      {
        message: `${label} must be between ${min} and ${max}`,
      },
    );
  }

  return schema;
}

export const sellerAssetCreateSchema = z
  .object({
    title: requiredText("Title"),
    description: requiredText("Description"),
    country: requiredText("Country"),
    category: requiredText("Category"),
    assetType: requiredText("Asset type"),
    businessStatus: requiredText("Business status"),
    askingPrice: positiveMoney("Asking price"),
    currency: z.enum(SELLER_ASSET_CURRENCIES),
    employees: optionalInteger("Employees", 0),
    foundedYear: optionalInteger("Founded year", 1900, 2100),
    licenseType: optionalText(),
    intent: sellerAssetCreateIntentSchema,
  })
  .strict();

export type SellerAssetCreateInput = z.infer<typeof sellerAssetCreateSchema>;

export const sellerAssetUpdateSchema = sellerAssetCreateSchema
  .extend({
    assetId: requiredText("Asset"),
    intent: sellerAssetEditIntentSchema,
  })
  .strict();

export type SellerAssetUpdateInput = z.infer<typeof sellerAssetUpdateSchema>;

export type SellerAssetCreateErrors = Partial<
  Record<
    keyof Omit<SellerAssetCreateInput, "intent"> | "form",
    string
  >
>;

export type SellerAssetCreateState = {
  errors: SellerAssetCreateErrors;
};

export const emptySellerAssetCreateState: SellerAssetCreateState = {
  errors: {},
};

export function createEmptySellerAssetFormValues(
  country: string,
): SellerAssetFormValues {
  return {
    title: "",
    description: "",
    country,
    category: "",
    assetType: "",
    businessStatus: "",
    askingPrice: "",
    currency: defaultSellerAssetCurrency(country),
    employees: "",
    foundedYear: "",
    licenseType: "",
  };
}

export function createSellerAssetFormValues({
  title,
  description,
  country,
  category,
  assetType,
  businessStatus,
  askingPrice,
  currency,
  employees,
  foundedYear,
  licenseType,
}: SellerAssetFormAsset): SellerAssetFormValues {
  return {
    title,
    description,
    country,
    category,
    assetType,
    businessStatus,
    askingPrice: askingPrice.toString(),
    currency: currency || defaultSellerAssetCurrency(country),
    employees: employees?.toString() ?? "",
    foundedYear: foundedYear?.toString() ?? "",
    licenseType: licenseType ?? "",
  };
}

function mapSellerAssetErrors(
  error: z.ZodError<Record<string, unknown>>,
): SellerAssetCreateState {
  const flattened = error.flatten();

  return {
    errors: {
      title: flattened.fieldErrors.title?.[0],
      description: flattened.fieldErrors.description?.[0],
      country: flattened.fieldErrors.country?.[0],
      category: flattened.fieldErrors.category?.[0],
      assetType: flattened.fieldErrors.assetType?.[0],
      businessStatus: flattened.fieldErrors.businessStatus?.[0],
      askingPrice: flattened.fieldErrors.askingPrice?.[0],
      currency: flattened.fieldErrors.currency?.[0],
      employees: flattened.fieldErrors.employees?.[0],
      foundedYear: flattened.fieldErrors.foundedYear?.[0],
      licenseType: flattened.fieldErrors.licenseType?.[0],
      form: flattened.formErrors[0],
    },
  };
}

export function mapSellerAssetCreateErrors(
  error: z.ZodError<SellerAssetCreateInput>,
): SellerAssetCreateState {
  return mapSellerAssetErrors(error);
}

export function mapSellerAssetUpdateErrors(
  error: z.ZodError<SellerAssetUpdateInput>,
): SellerAssetCreateState {
  return mapSellerAssetErrors(error);
}

export function defaultSellerAssetCurrency(country: string) {
  switch (country.trim()) {
    case "United Kingdom":
      return "GBP";
    case "UAE":
      return "AED";
    case "Singapore":
      return "SGD";
    default:
      return "EUR";
  }
}

export function resolveSellerAssetStatusTransition({
  currentStatus,
  intent,
}: {
  currentStatus: SellerAssetStatus;
  intent: "save" | "publish" | "unpublish";
}): SellerAssetStatus | null {
  if (currentStatus === "SUSPENDED") {
    return intent === "save" ? "SUSPENDED" : null;
  }

  if (currentStatus === "DRAFT") {
    if (intent === "publish") {
      return "PUBLISHED";
    }

    return "DRAFT";
  }

  if (intent === "unpublish") {
    return "DRAFT";
  }

  return "PUBLISHED";
}
