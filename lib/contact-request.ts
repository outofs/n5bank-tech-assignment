import { z } from "zod";

export const CONTACT_REQUEST_MESSAGE_MAX_LENGTH = 1000;

export const contactRequestMessageSchema = z
  .string()
  .trim()
  .min(1, "Message is required.")
  .max(
    CONTACT_REQUEST_MESSAGE_MAX_LENGTH,
    `Message must be ${CONTACT_REQUEST_MESSAGE_MAX_LENGTH} characters or fewer.`,
  );

export const buyerAssetContactRequestSchema = z
  .object({
    assetId: z.string().trim().min(1, "Asset is required."),
    message: contactRequestMessageSchema,
  })
  .strict();

export const sellerBuyerContactRequestSchema = z
  .object({
    buyerId: z.string().trim().min(1, "Buyer is required."),
    message: contactRequestMessageSchema,
  })
  .strict();

export type BuyerAssetContactRequestInput = z.infer<
  typeof buyerAssetContactRequestSchema
>;
export type SellerBuyerContactRequestInput = z.infer<
  typeof sellerBuyerContactRequestSchema
>;

export type ContactRequestFormErrors = Partial<
  Record<"message" | "form", string>
>;

export type ContactRequestFormState = {
  errors: ContactRequestFormErrors;
  successMessage: string;
};

export const emptyContactRequestFormState: ContactRequestFormState = {
  errors: {},
  successMessage: "",
};

function mapContactRequestErrors(
  error: z.ZodError<Record<string, unknown>>,
): ContactRequestFormState {
  const flattened = error.flatten();

  return {
    errors: {
      message: flattened.fieldErrors.message?.[0],
      form: flattened.formErrors[0],
    },
    successMessage: "",
  };
}

export function mapBuyerAssetContactRequestErrors(
  error: z.ZodError<BuyerAssetContactRequestInput>,
): ContactRequestFormState {
  return mapContactRequestErrors(error);
}

export function mapSellerBuyerContactRequestErrors(
  error: z.ZodError<SellerBuyerContactRequestInput>,
): ContactRequestFormState {
  return mapContactRequestErrors(error);
}
