import { describe, expect, it } from "vitest";
import {
  calculateSmartMatchScore,
  sortAssetsBySmartMatch,
} from "../lib/smart-match";

describe("smart match", () => {
  it("returns a perfect score for a strong match across all criteria", () => {
    const result = calculateSmartMatchScore(
      {
        minInvestment: "1000000.00",
        maxInvestment: "5000000.00",
        preferredCountries: ["United Kingdom", "Lithuania"],
        preferredCategories: ["Payments", "EMI"],
      },
      {
        askingPrice: "2500000.00",
        country: "Lithuania",
        category: "Payments",
      },
    );

    expect(result.score).toBe(100);
    expect(result.reasons).toEqual([
      "Asking price is within your investment range",
      "Located in one of your target countries",
      "Matches your preferred category",
    ]);
  });

  it("returns a partial score when only some preferences match", () => {
    const result = calculateSmartMatchScore(
      {
        minInvestment: "1000000.00",
        maxInvestment: "5000000.00",
        preferredCountries: ["Lithuania"],
        preferredCategories: ["EMI"],
      },
      {
        askingPrice: "2500000.00",
        country: "Lithuania",
        category: "Payments",
      },
    );

    expect(result.score).toBe(70);
    expect(result.reasons).toEqual([
      "Asking price is within your investment range",
      "Located in one of your target countries",
    ]);
  });

  it("penalizes a price mismatch even when country and category match", () => {
    const result = calculateSmartMatchScore(
      {
        minInvestment: "1000000.00",
        maxInvestment: "2000000.00",
        preferredCountries: ["Lithuania"],
        preferredCategories: ["Payments"],
      },
      {
        askingPrice: "3500000.00",
        country: "Lithuania",
        category: "Payments",
      },
    );

    expect(result.score).toBe(50);
    expect(result.reasons).toEqual([
      "Located in one of your target countries",
      "Matches your preferred category",
    ]);
  });

  it("returns only the price contribution when country and category do not match", () => {
    const result = calculateSmartMatchScore(
      {
        minInvestment: "1000000.00",
        maxInvestment: "5000000.00",
        preferredCountries: ["Germany"],
        preferredCategories: ["Banking"],
      },
      {
        askingPrice: "2500000.00",
        country: "Lithuania",
        category: "Payments",
      },
    );

    expect(result.score).toBe(50);
    expect(result.reasons).toEqual([
      "Asking price is within your investment range",
    ]);
  });

  it("normalizes the score across the preferences that are actually available", () => {
    const result = calculateSmartMatchScore(
      {
        preferredCategories: ["Payments"],
      },
      {
        askingPrice: "2500000.00",
        country: "Lithuania",
        category: "Payments",
      },
    );

    expect(result.score).toBe(100);
    expect(result.reasons).toEqual(["Matches your preferred category"]);
  });

  it("sorts assets by best match with deterministic tie-breakers", () => {
    const assets = sortAssetsBySmartMatch([
      {
        id: "asset-b",
        title: "Beta Asset",
        createdAt: new Date("2026-08-18T10:00:00.000Z"),
        smartMatch: { score: 90, reasons: [] },
      },
      {
        id: "asset-c",
        title: "Gamma Asset",
        createdAt: new Date("2026-08-19T10:00:00.000Z"),
        smartMatch: { score: 90, reasons: [] },
      },
      {
        id: "asset-a",
        title: "Alpha Asset",
        createdAt: new Date("2026-08-19T11:00:00.000Z"),
        smartMatch: { score: 100, reasons: [] },
      },
    ]);

    expect(assets.map((asset) => asset.id)).toEqual([
      "asset-a",
      "asset-c",
      "asset-b",
    ]);
  });
});
