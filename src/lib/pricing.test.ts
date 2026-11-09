import { describe, it, expect } from "vitest";
import { priceUSD } from "./pricing";

describe("priceUSD", () => {
  it("applies (materials + hours*wage)/(1-margin)*fx", () => {
    // (400 + 10*120)/(0.75) = 2133.33 INR * 0.012 = 25.6
    expect(priceUSD(400, 10)).toBe(25.6);
  });
  it("rejects margin of 100%", () => {
    expect(() => priceUSD(100, 1, 120, 1)).toThrow();
  });
});
