import { describe, it, expect } from "vitest";
import { generateBatchId, calculateTotal, formatPayrollReport } from "../payroll.js";
import type { PayrollEntry, PayrollResult } from "../types.js";
import { CHAINS } from "../types.js";

describe("Payroll", () => {
  describe("generateBatchId", () => {
    it("should generate a batch ID in YYYY-MM-NNN format", () => {
      const id = generateBatchId();
      expect(id).toMatch(/^\d{4}-\d{2}-\d{3}$/);
    });

    it("should generate unique IDs", () => {
      const ids = new Set(Array.from({ length: 100 }, () => generateBatchId()));
      expect(ids.size).toBeGreaterThan(90); // High uniqueness
    });
  });

  describe("calculateTotal", () => {
    it("should sum all entry amounts", () => {
      const entries: PayrollEntry[] = [
        { address: "0xAlice", amount: 2000, token: "USDC", chain: CHAINS.POLYGON },
        { address: "0xBob", amount: 1500, token: "USDC", chain: CHAINS.POLYGON },
        { address: "0xCarol", amount: 1000, token: "USDC", chain: CHAINS.POLYGON },
      ];
      expect(calculateTotal(entries)).toBe(4500);
    });

    it("should return 0 for empty list", () => {
      expect(calculateTotal([])).toBe(0);
    });

    it("should handle single entry", () => {
      const entries: PayrollEntry[] = [
        { address: "0xAlice", amount: 5000, token: "USDC", chain: CHAINS.POLYGON },
      ];
      expect(calculateTotal(entries)).toBe(5000);
    });
  });

  describe("formatPayrollReport", () => {
    it("should format a successful payroll report", () => {
      const result: PayrollResult = {
        batchId: "2026-04-001",
        entries: [
          { address: "0xAlice123456789", amount: 2000, txHash: "0xabc123def456", status: "success" },
          { address: "0xBob123456789ab", amount: 1500, txHash: "0xdef456abc789", status: "success" },
        ],
        totalAmount: 3500,
        totalSucceeded: 2,
        totalFailed: 0,
        auditTxHash: "0xaudit123",
      };

      const report = formatPayrollReport(result);
      expect(report).toContain("2026-04-001");
      expect(report).toContain("COMPLETED");
      expect(report).toContain("3,500");
      expect(report).toContain("0xaudit123");
    });

    it("should show PARTIAL status when some fail", () => {
      const result: PayrollResult = {
        batchId: "2026-04-002",
        entries: [
          { address: "0xAlice123456789", amount: 2000, txHash: "0xabc", status: "success" },
          { address: "0xBob123456789ab", amount: 1500, status: "failed", error: "timeout" },
        ],
        totalAmount: 3500,
        totalSucceeded: 1,
        totalFailed: 1,
      };

      const report = formatPayrollReport(result);
      expect(report).toContain("PARTIAL");
      expect(report).toContain("1 OK, 1 failed");
    });
  });
});
