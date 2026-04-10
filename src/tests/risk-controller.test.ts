import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getTodaySpend,
  recordSpend,
  resetDailySpend,
} from "../risk-controller.js";
import type { RiskConfig } from "../types.js";

// Mock okx-integration to avoid real CLI calls in tests
vi.mock("../okx-integration.js", () => ({
  securityScan: vi.fn().mockResolvedValue({
    address: "0xtest",
    safe: true,
    riskLevel: "low",
    warnings: [],
  }),
}));

const testConfig: RiskConfig = {
  dailyPayrollLimit: 50_000,
  singleTxLimit: 10_000,
  alertBalanceThreshold: 10_000,
};

describe("RiskController", () => {
  beforeEach(() => {
    resetDailySpend();
  });

  describe("Daily Spend Tracking", () => {
    it("should start at 0", () => {
      expect(getTodaySpend()).toBe(0);
    });

    it("should accumulate spending", () => {
      recordSpend(1000);
      recordSpend(2000);
      expect(getTodaySpend()).toBe(3000);
    });

    it("should reset correctly", () => {
      recordSpend(5000);
      resetDailySpend();
      expect(getTodaySpend()).toBe(0);
    });
  });

  describe("validatePayroll", async () => {
    // Import after mocks are set up
    const { validatePayroll } = await import("../risk-controller.js");

    it("should pass for valid payroll within all limits", async () => {
      const entries = [
        { address: "0xAlice", amount: 2000, token: "USDC", chain: 137 },
        { address: "0xBob", amount: 1500, token: "USDC", chain: 137 },
      ];

      const result = await validatePayroll(entries, 10000, testConfig);
      expect(result.passed).toBe(true);
      expect(result.checks.length).toBeGreaterThan(0);
    });

    it("should fail Layer 1 when balance insufficient", async () => {
      const entries = [
        { address: "0xAlice", amount: 5000, token: "USDC", chain: 137 },
      ];

      const result = await validatePayroll(entries, 1000, testConfig);
      expect(result.passed).toBe(false);
      expect(result.blockedBy).toContain("Layer 1");
    });

    it("should fail Layer 3 when single tx exceeds limit", async () => {
      const entries = [
        { address: "0xAlice", amount: 15000, token: "USDC", chain: 137 },
      ];

      const result = await validatePayroll(entries, 50000, testConfig);
      expect(result.passed).toBe(false);
      expect(result.blockedBy).toContain("Layer 3");
    });

    it("should fail Layer 4 when daily limit exceeded", async () => {
      recordSpend(45000);
      const entries = [
        { address: "0xAlice", amount: 8000, token: "USDC", chain: 137 },
      ];

      const result = await validatePayroll(entries, 50000, testConfig);
      expect(result.passed).toBe(false);
      expect(result.blockedBy).toContain("Layer 4");
    });
  });

  describe("validateTrustOperation", async () => {
    const { validateTrustOperation } = await import("../risk-controller.js");

    it("should pass for valid trust within limits", async () => {
      const result = await validateTrustOperation(
        5000, "0xBeneficiary", 137, 20000, testConfig
      );
      expect(result.passed).toBe(true);
    });

    it("should fail when amount exceeds balance", async () => {
      const result = await validateTrustOperation(
        15000, "0xBeneficiary", 137, 10000, testConfig
      );
      expect(result.passed).toBe(false);
      expect(result.blockedBy).toContain("Layer 1");
    });
  });
});
