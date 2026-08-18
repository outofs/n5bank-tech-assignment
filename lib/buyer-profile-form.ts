import type { Prisma } from "@prisma/client";
import { z } from "zod";

function splitProfileList(value: string) {
  return Array.from(
    new Set(
      value
        .split(/[\n,]/)
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}

function moneyField(label: string) {
  return z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .refine((value) => Number.isFinite(Number(value)), {
      message: `${label} must be a valid number`,
    })
    .transform((value) => Number(value))
    .refine((value) => value >= 0, {
      message: `${label} must be at least 0`,
    });
}

const requiredText = (label: string) =>
  z.string().trim().min(1, `${label} is required`);

export const buyerProfileEditSchema = z
  .object({
    name: requiredText("Name"),
    company: requiredText("Company"),
    country: requiredText("Country"),
    bio: requiredText("Bio"),
    investmentThesis: requiredText("Investment thesis"),
    minInvestment: moneyField("Minimum investment"),
    maxInvestment: moneyField("Maximum investment"),
    preferredCountries: z.string().transform(splitProfileList),
    preferredCategories: z.string().transform(splitProfileList),
  })
  .superRefine((value, ctx) => {
    if (value.minInvestment > value.maxInvestment) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["maxInvestment"],
        message:
          "Maximum investment must be greater than or equal to minimum investment.",
      });
    }
  });

export type BuyerProfileEditInput = z.infer<typeof buyerProfileEditSchema>;

export type BuyerProfileEditErrors = Partial<
  Record<keyof BuyerProfileEditInput | "form", string>
>;

export type BuyerProfileEditState = {
  errors: BuyerProfileEditErrors;
};

export type BuyerProfileEditFormValues = {
  name: string;
  company: string;
  country: string;
  bio: string;
  investmentThesis: string;
  minInvestment: string;
  maxInvestment: string;
  preferredCountries: string;
  preferredCategories: string;
};

type BuyerProfileEditValueSource = {
  name: string;
  company: string;
  country: string;
  bio: string;
  investmentThesis: string;
  minInvestment: Prisma.Decimal | number | string;
  maxInvestment: Prisma.Decimal | number | string;
  preferredCountries: string[];
  preferredCategories: string[];
};

export const emptyBuyerProfileEditState: BuyerProfileEditState = {
  errors: {},
};

export function mapBuyerProfileEditErrors(
  error: z.ZodError<BuyerProfileEditInput>,
): BuyerProfileEditState {
  const flattened = error.flatten();

  return {
    errors: {
      name: flattened.fieldErrors.name?.[0],
      company: flattened.fieldErrors.company?.[0],
      country: flattened.fieldErrors.country?.[0],
      bio: flattened.fieldErrors.bio?.[0],
      investmentThesis: flattened.fieldErrors.investmentThesis?.[0],
      minInvestment: flattened.fieldErrors.minInvestment?.[0],
      maxInvestment: flattened.fieldErrors.maxInvestment?.[0],
      preferredCountries: flattened.fieldErrors.preferredCountries?.[0],
      preferredCategories: flattened.fieldErrors.preferredCategories?.[0],
      form: flattened.formErrors[0],
    },
  };
}

export function joinProfileList(values: string[]) {
  return values.join("\n");
}

export function createProfileEditValues({
  name,
  company,
  country,
  bio,
  investmentThesis,
  minInvestment,
  maxInvestment,
  preferredCountries,
  preferredCategories,
}: BuyerProfileEditValueSource): BuyerProfileEditFormValues {
  return {
    name,
    company,
    country,
    bio,
    investmentThesis,
    minInvestment: minInvestment.toString(),
    maxInvestment: maxInvestment.toString(),
    preferredCountries: joinProfileList(preferredCountries),
    preferredCategories: joinProfileList(preferredCategories),
  };
}
