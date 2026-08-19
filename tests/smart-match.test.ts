import assert from "node:assert/strict";

import {
  calculateSmartMatchScore,
  sortAssetsBySmartMatch,
} from "../lib/smart-match";

function runTest(name: string, fn: () => void) {
  fn();
  console.log(`PASS ${name}`);
}

runTest("returns a perfect score for a strong match across all criteria", () => {
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

  assert.equal(result.score, 100);
  assert.deepEqual(result.reasons, [
    "Asking price is within your investment range",
    "Located in one of your target countries",
    "Matches your preferred category",
  ]);
});

runTest("returns a partial score when only some preferences match", () => {
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

  assert.equal(result.score, 70);
  assert.deepEqual(result.reasons, [
    "Asking price is within your investment range",
    "Located in one of your target countries",
  ]);
});

runTest("penalizes a price mismatch even when country and category match", () => {
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

  assert.equal(result.score, 50);
  assert.deepEqual(result.reasons, [
    "Located in one of your target countries",
    "Matches your preferred category",
  ]);
});

runTest("returns only the price contribution when country and category do not match", () => {
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

  assert.equal(result.score, 50);
  assert.deepEqual(result.reasons, ["Asking price is within your investment range"]);
});

runTest("normalizes the score across the preferences that are actually available", () => {
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

  assert.equal(result.score, 100);
  assert.deepEqual(result.reasons, ["Matches your preferred category"]);
});

runTest("sorts assets by best match with deterministic tie-breakers", () => {
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

  assert.deepEqual(
    assets.map((asset) => asset.id),
    ["asset-a", "asset-c", "asset-b"],
  );
});
