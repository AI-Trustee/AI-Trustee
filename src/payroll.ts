/**
 * Batch payroll distribution engine.
 *
 * Handles parsing, validation, execution, and audit logging
 * of batch salary payments.
 */

import {
  sendTokens,
  getWalletBalance,
  securityScan,
  contractCall,
} from "./okx-integration.js";
import { validatePayroll } from "./risk-controller.js";
import type {
  PayrollEntry,
  PayrollBatch,
  PayrollResult,
  PayrollEntryResult,
  RiskConfig,
} from "./types.js";
import { CHAINS, DEFAULT_RISK_CONFIG } from "./types.js";

/**
 * Generate a unique batch ID based on current date.
 */
export function generateBatchId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const seq = String(Math.floor(Math.random() * 999) + 1).padStart(3, "0");
  return `${year}-${month}-${seq}`;
}

/**
 * Calculate total amount for a payroll batch.
 */
export function calculateTotal(entries: PayrollEntry[]): number {
  return entries.reduce((sum, e) => sum + e.amount, 0);
}

/**
 * Execute a complete payroll batch.
 *
 * Flow:
 * 1. Validate via risk controller (4-layer check)
 * 2. Execute transfers one by one
 * 3. Log batch to TrusteePayroll contract on X Layer
 * 4. Return summary report
 */
export async function executePayroll(
  entries: PayrollEntry[],
  memo: string,
  riskConfig: RiskConfig = DEFAULT_RISK_CONFIG,
  payrollContract?: string
): Promise<PayrollResult> {
  const batchId = generateBatchId();
  const totalAmount = calculateTotal(entries);

  // Step 1: Risk validation
  const chain = entries[0]?.chain ?? CHAINS.POLYGON;
  const balance = await getWalletBalance(chain);
  const currentBalance = balance ? parseFloat(balance.balanceUsd) : 0;

  const validation = await validatePayroll(entries, currentBalance, riskConfig);
  if (!validation.passed) {
    return {
      batchId,
      entries: entries.map((e) => ({
        address: e.address,
        amount: e.amount,
        status: "failed" as const,
        error: `Risk check failed: ${validation.blockedBy}`,
      })),
      totalAmount,
      totalSucceeded: 0,
      totalFailed: entries.length,
    };
  }

  // Step 2: Execute transfers
  const results: PayrollEntryResult[] = [];

  for (const entry of entries) {
    const amountMinimal = String(entry.amount * 1e6); // USDC 6 decimals
    const tokenContract =
      entry.token === "USDC"
        ? "0x2791bca1f2de4661ed88a30c99a7a9449aa84174"
        : entry.token;

    const txResult = await sendTokens(
      entry.chain,
      entry.address,
      tokenContract,
      amountMinimal
    );

    results.push({
      address: entry.address,
      amount: entry.amount,
      txHash: txResult.data?.txHash as string | undefined,
      status: txResult.ok ? "success" : "failed",
      error: txResult.error,
    });
  }

  const succeeded = results.filter((r) => r.status === "success").length;
  const failed = results.filter((r) => r.status === "failed").length;

  // Step 3: Log to X Layer contract
  let auditTxHash: string | undefined;
  if (payrollContract) {
    const logResult = await logPayrollOnChain(
      payrollContract,
      totalAmount,
      entries.length,
      batchId,
      memo
    );
    auditTxHash = logResult.data?.txHash as string | undefined;
  }

  return {
    batchId,
    entries: results,
    totalAmount,
    totalSucceeded: succeeded,
    totalFailed: failed,
    auditTxHash,
  };
}

/**
 * Log a payroll batch to the TrusteePayroll contract on X Layer.
 */
async function logPayrollOnChain(
  contractAddress: string,
  totalAmount: number,
  recipientCount: number,
  batchId: string,
  memo: string
) {
  // ABI encode logPayroll(uint128, uint16, string, string)
  // Simplified: in production, use proper ABI encoding
  const amountHex = Math.floor(totalAmount * 1e6)
    .toString(16)
    .padStart(32, "0");
  const countHex = recipientCount.toString(16).padStart(4, "0");

  const inputData = `0x${amountHex}${countHex}`;

  return contractCall(CHAINS.X_LAYER, contractAddress, inputData);
}

/**
 * Format payroll results as a human-readable report.
 */
export function formatPayrollReport(result: PayrollResult): string {
  const lines: string[] = [
    `Payroll Batch: ${result.batchId}`,
    `Status: ${result.totalFailed === 0 ? "COMPLETED" : "PARTIAL"}`,
    `Total: ${result.totalAmount.toLocaleString()} USDC`,
    `Recipients: ${result.entries.length} (${result.totalSucceeded} OK, ${result.totalFailed} failed)`,
    "",
    "| Recipient | Amount | Tx Hash | Status |",
    "|-----------|--------|---------|--------|",
  ];

  for (const entry of result.entries) {
    const hash = entry.txHash
      ? `${entry.txHash.slice(0, 10)}...`
      : entry.error ?? "N/A";
    lines.push(
      `| ${entry.address.slice(0, 10)}... | ${entry.amount.toLocaleString()} | ${hash} | ${entry.status.toUpperCase()} |`
    );
  }

  if (result.auditTxHash) {
    lines.push("", `Audit Log: X Layer tx ${result.auditTxHash}`);
  }

  return lines.join("\n");
}
