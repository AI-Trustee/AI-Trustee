import { describe, it, expect } from "vitest";
import { isReleasable, formatTrustSummary } from "../trust-manager.js";
import type { Trust } from "../types.js";

function makeTrust(overrides: Partial<Trust> = {}): Trust {
  return {
    id: 1,
    beneficiary: "0xAlice000000000000000000000000000000000001",
    totalAmount: 10000,
    releasedAmount: 0,
    startTime: Math.floor(Date.now() / 1000) - 86400, // Started yesterday
    releaseInterval: 2592000, // 30 days
    releasePerPeriod: 2500_000_000, // 2500 USDC in 6 decimals
    nextReleaseTime: 0,
    releaseType: "periodic",
    status: "active",
    description: "Test trust",
    ...overrides,
  };
}

describe("TrustManager", () => {
  describe("isReleasable", () => {
    it("should return true when periodic trust is past nextReleaseTime", () => {
      const trust = makeTrust({
        nextReleaseTime: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
      });
      expect(isReleasable(trust)).toBe(true);
    });

    it("should return false when nextReleaseTime is in the future", () => {
      const trust = makeTrust({
        nextReleaseTime: Math.floor(Date.now() / 1000) + 86400, // Tomorrow
      });
      expect(isReleasable(trust)).toBe(false);
    });

    it("should return false for completed trusts", () => {
      const trust = makeTrust({
        status: "completed",
        nextReleaseTime: 0,
      });
      expect(isReleasable(trust)).toBe(false);
    });

    it("should return false for cancelled trusts", () => {
      const trust = makeTrust({
        status: "cancelled",
        nextReleaseTime: 0,
      });
      expect(isReleasable(trust)).toBe(false);
    });

    it("should return false for milestone trusts (requires manual trigger)", () => {
      const trust = makeTrust({
        releaseType: "milestone",
        nextReleaseTime: 0,
      });
      expect(isReleasable(trust)).toBe(false);
    });

    it("should return false when fully released", () => {
      const trust = makeTrust({
        totalAmount: 10000,
        releasedAmount: 10000,
        nextReleaseTime: 0,
      });
      expect(isReleasable(trust)).toBe(false);
    });

    it("should return true for time_lock past due", () => {
      const trust = makeTrust({
        releaseType: "time_lock",
        nextReleaseTime: Math.floor(Date.now() / 1000) - 3600,
      });
      expect(isReleasable(trust)).toBe(true);
    });
  });

  describe("formatTrustSummary", () => {
    it("should format trust details", () => {
      const trust = makeTrust({
        id: 3,
        totalAmount: 10000,
        releasedAmount: 2500,
        nextReleaseTime: Math.floor(Date.now() / 1000) + 86400 * 30,
      });

      const summary = formatTrustSummary(trust);
      expect(summary).toContain("Trust #3");
      expect(summary).toContain("10,000");
      expect(summary).toContain("2,500");
      expect(summary).toContain("7,500");
      expect(summary).toContain("periodic");
      expect(summary).toContain("active");
    });

    it("should show 'On milestone' for milestone trusts", () => {
      const trust = makeTrust({ releaseType: "milestone" });
      const summary = formatTrustSummary(trust);
      expect(summary).toContain("On milestone");
    });
  });
});
