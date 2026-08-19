import { describe, expect, it } from "vitest";
import { buyerProfileEditSchema } from "../lib/buyer-profile-form";
import {
  buyerAssetContactRequestSchema,
  contactRequestMessageSchema,
  sellerBuyerContactRequestSchema,
} from "../lib/contact-request";
import {
  resolveSellerAssetStatusTransition,
  sellerAssetCreateSchema,
  sellerAssetUpdateSchema,
} from "../lib/seller-asset-form";

const validBuyerProfileInput = {
  name: " Marta Nowak ",
  company: " Northstar Capital ",
  country: " Poland ",
  bio: "Focused buyer",
  investmentThesis: "Acquire regulated fintech assets.",
  minInvestment: "1000000",
  maxInvestment: "5000000",
  preferredCountries: "Poland, Lithuania\nPoland",
  preferredCategories: "Payments\nEMI, Payments",
};

const validSellerAssetInput = {
  title: "Payment institution license",
  description: "A regulated payments asset with active customers.",
  country: "Lithuania",
  category: "Payments",
  assetType: "License",
  businessStatus: "Operating",
  askingPrice: "2500000",
  currency: "EUR",
  employees: "",
  foundedYear: "",
  licenseType: "",
  intent: "draft",
};

describe("buyer profile validation", () => {
  it("normalizes buyer profile list preferences and money fields", () => {
    const result = buyerProfileEditSchema.parse(validBuyerProfileInput);

    expect(result.name).toBe("Marta Nowak");
    expect(result.company).toBe("Northstar Capital");
    expect(result.minInvestment).toBe(1000000);
    expect(result.maxInvestment).toBe(5000000);
    expect(result.preferredCountries).toEqual(["Poland", "Lithuania"]);
    expect(result.preferredCategories).toEqual(["Payments", "EMI"]);
  });

  it("rejects buyer profile ranges where minimum exceeds maximum", () => {
    const result = buyerProfileEditSchema.safeParse({
      ...validBuyerProfileInput,
      minInvestment: "5000000",
      maxInvestment: "1000000",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.maxInvestment?.[0]).toBe(
        "Maximum investment must be greater than or equal to minimum investment.",
      );
    }
  });

  it("rejects non-numeric buyer investment values", () => {
    const result = buyerProfileEditSchema.safeParse({
      ...validBuyerProfileInput,
      minInvestment: "not a number",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.minInvestment?.[0]).toBe(
        "Minimum investment must be a valid number",
      );
    }
  });
});

describe("seller asset validation", () => {
  it("normalizes optional seller asset numeric fields", () => {
    const result = sellerAssetCreateSchema.parse(validSellerAssetInput);

    expect(result.askingPrice).toBe(2500000);
    expect(result.employees).toBeUndefined();
    expect(result.foundedYear).toBeUndefined();
    expect(result.licenseType).toBeUndefined();
  });

  it("rejects seller assets without a positive asking price", () => {
    const result = sellerAssetCreateSchema.safeParse({
      ...validSellerAssetInput,
      askingPrice: "0",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.askingPrice?.[0]).toBe(
        "Asking price must be greater than 0",
      );
    }
  });

  it("rejects seller asset founded years outside the allowed range", () => {
    const result = sellerAssetCreateSchema.safeParse({
      ...validSellerAssetInput,
      foundedYear: "1800",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.foundedYear?.[0]).toBe(
        "Founded year must be at least 1900",
      );
    }
  });

  it("requires an asset id and valid edit intent for seller asset updates", () => {
    const missingAssetId = sellerAssetUpdateSchema.safeParse({
      ...validSellerAssetInput,
      assetId: "",
      intent: "publish",
    });
    const invalidIntent = sellerAssetUpdateSchema.safeParse({
      ...validSellerAssetInput,
      assetId: "asset-123",
      intent: "restore",
    });

    expect(missingAssetId.success).toBe(false);
    if (!missingAssetId.success) {
      expect(missingAssetId.error.flatten().fieldErrors.assetId?.[0]).toBe(
        "Asset is required",
      );
    }
    expect(invalidIntent.success).toBe(false);
  });

  it("resolves allowed seller asset status transitions", () => {
    expect(
      resolveSellerAssetStatusTransition({
        currentStatus: "DRAFT",
        intent: "publish",
      }),
    ).toBe("PUBLISHED");
    expect(
      resolveSellerAssetStatusTransition({
        currentStatus: "PUBLISHED",
        intent: "unpublish",
      }),
    ).toBe("DRAFT");
    expect(
      resolveSellerAssetStatusTransition({
        currentStatus: "PUBLISHED",
        intent: "save",
      }),
    ).toBe("PUBLISHED");
  });

  it("blocks seller publish and unpublish actions on suspended assets", () => {
    expect(
      resolveSellerAssetStatusTransition({
        currentStatus: "SUSPENDED",
        intent: "publish",
      }),
    ).toBeNull();
    expect(
      resolveSellerAssetStatusTransition({
        currentStatus: "SUSPENDED",
        intent: "unpublish",
      }),
    ).toBeNull();
    expect(
      resolveSellerAssetStatusTransition({
        currentStatus: "SUSPENDED",
        intent: "save",
      }),
    ).toBe("SUSPENDED");
  });
});

describe("contact request validation", () => {
  it("validates and trims contact request messages", () => {
    expect(
      contactRequestMessageSchema.parse("  Interested in this asset.  "),
    ).toBe("Interested in this asset.");
    expect(contactRequestMessageSchema.safeParse("   ").success).toBe(false);
    expect(contactRequestMessageSchema.safeParse("x".repeat(1001)).success).toBe(
      false,
    );
  });

  it("validates buyer-to-asset and seller-to-buyer contact request inputs", () => {
    const buyerToAsset = buyerAssetContactRequestSchema.parse({
      assetId: " asset-123 ",
      message: " Please share more details. ",
    });
    const sellerToBuyer = sellerBuyerContactRequestSchema.parse({
      buyerId: " buyer-123 ",
      message: " We may have a fit. ",
    });

    expect(buyerToAsset.assetId).toBe("asset-123");
    expect(buyerToAsset.message).toBe("Please share more details.");
    expect(sellerToBuyer.buyerId).toBe("buyer-123");
    expect(sellerToBuyer.message).toBe("We may have a fit.");
    expect(
      buyerAssetContactRequestSchema.safeParse({
        assetId: "",
        message: "Hello",
      }).success,
    ).toBe(false);
  });
});
