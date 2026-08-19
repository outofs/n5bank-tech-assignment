import { describe, expect, it } from "vitest";

import {
  buildCanonicalCountryOptions,
  buildNormalizedFilterOptions,
  sanitizeOptionValue,
} from "../lib/filter-options";

describe("filter options", () => {
  it("normalizes and deduplicates category options while preserving raw variants", () => {
    const result = buildNormalizedFilterOptions([
      " Payments ",
      "payments",
      "EMI",
      " EMI ",
      "",
      null,
    ]);

    expect(result.options).toEqual([
      { value: "EMI", label: "EMI" },
      { value: "Payments", label: "Payments" },
    ]);
    expect(result.valuesByOption.get("Payments")).toEqual([
      "Payments",
      "payments",
    ]);
  });

  it("only exposes supported canonical countries", () => {
    const options = buildCanonicalCountryOptions([
      " Lithuania ",
      "Atlantis",
      "United States",
    ]);

    expect(options).toEqual([
      { value: "Lithuania", label: "Lithuania" },
      { value: "United States", label: "United States" },
    ]);
    expect(sanitizeOptionValue("Atlantis", options)).toBe("");
    expect(sanitizeOptionValue("Lithuania", options)).toBe("Lithuania");
  });
});
