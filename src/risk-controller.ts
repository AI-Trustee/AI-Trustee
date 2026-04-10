/**
 * 4-Layer Risk Control System.
 *
 * Every payroll and trust operation passes through these checks
 * before execution. Layers are evaluated in order — first failure stops.
 *
 * Layer 1: Balance sufficiency
 * Layer 2: Address security scan
 * Layer 3: Single transaction limit
 * Layer 4: Daily payroll limit
 */

import { securityScan } from "./okx-integration.js";
import type {
  PayrollEntry,
  RiskCheck,
  RiskValidation,
  RiskConfig,
} from "./types.js";
import { DEFAULT_RISK_CONFIG } from "./types.js";

// Track daily spending for circuit breaker
const dailySpending = new Map<string, number>();

/**
 * Get today's date key for tracking.
 */
function todayKey(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Get total amount spent today.
 */
export function getTodaySpend(): number {
  return dailySpending.get(todayKey()) ?? 0;
}

/**
 * Record spending for today.
 */
export function recordSpend(amount: number): void {
  const key = todayKey();
  dailySpending.set(key, (dailySpending.get(key) ?? 0) + amount);
}

/**
 * Reset daily spending tracker (for testing).
 */
export function resetDailySpend(): void {
  dailySpending.clear();
}

/**
 * Validate a payroll batch through all 4 risk layers.
 */
export async function validatePayroll(
  entries: PayrollEntry[],
  currentBalance: number,
  config: RiskConfig = DEFAULT_RISK_CONFIG
): Promise<RiskValidation> {
  const checks: RiskCheck[] = [];
  const totalAmount = entries.reduce((sum, e) => sum + e.amount, 0);

  // Layer 1: Balance sufficiency
  const balanceCheck = checkBalance(totalAmount, currentBalance);
  checks.push(balanceCheck);
  if (!balanceCheck.passed) {
    return { passed: false, checks, blockedBy: balanceCheck.layer };
  }

  // Layer 2: Address security (scan each recipient)
  for (const entry of entries) {
    const scanCheck = await checkAddressSecurity(entry.address, entry.chain);
    checks.push(scanCheck);
    if (!scanCheck.passed) {
      return { passed: false, checks, blockedBy: scanCheck.layer };
    }
  }

  // Layer 3: Single transaction limit
  for (const entry of entries) {
    const singleCheck = checkSingleTxLimit(entry.amount, config.singleTxLimit);
    checks.push(singleCheck);
    if (!singleCheck.passed) {
      return { passed: false, checks, blockedBy: singleCheck.layer };
    }
  }

  // Layer 4: Daily payroll limit
  const dailyCheck = checkDailyLimit(totalAmount, config.dailyPayrollLimit);
  checks.push(dailyCheck);
  if (!dailyCheck.passed) {
    return { passed: false, checks, blockedBy: dailyCheck.layer };
  }

  return { passed: true, checks };
}

/**
 * Validate a single trust operation.
 */
export async function validateTrustOperation(
  amount: number,
  beneficiary: string,
  chain: number,
  currentBalance: number,
  config: RiskConfig = DEFAULT_RISK_CONFIG
): Promise<RiskValidation> {
  const checks: RiskCheck[] = [];

  // Layer 1: Balance
  const balanceCheck = checkBalance(amount, currentBalance);
  checks.push(balanceCheck);
  if (!balanceCheck.passed) {
    return { passed: false, checks, blockedBy: balanceCheck.layer };
  }

  // Layer 2: Security scan
  const scanCheck = await checkAddressSecurity(beneficiary, chain);
  checks.push(scanCheck);
  if (!scanCheck.passed) {
    return { passed: false, checks, blockedBy: scanCheck.layer };
  }

  // Layer 3: Single tx limit
  const singleCheck = checkSingleTxLimit(amount, config.singleTxLimit);
  checks.push(singleCheck);
  if (!singleCheck.passed) {
    return { passed: false, checks, blockedBy: singleCheck.layer };
  }

  return { passed: true, checks };
}

// ─── Individual Layer Checks ─────────────────────────────

function checkBalance(required: number, available: number): RiskCheck {
  if (available >= required) {
    return { passed: true, layer: "Layer 1: Balance" };
  }
  return {
    passed: false,
    layer: "Layer 1: Balance",
    reason: `Insufficient balance: need ${required.toLocaleString()} USDC, have ${available.toLocaleString()} USDC`,
  };
}

async function checkAddressSecurity(
  address: string,
  chainId: number
): Promise<RiskCheck> {
  const result = await securityScan(address, chainId);
  if (result.safe) {
    return { passed: true, layer: `Layer 2: Security (${address.slice(0, 10)})` };
  }
  return {
    passed: false,
    layer: `Layer 2: Security (${address.slice(0, 10)})`,
    reason: `Address flagged: ${result.warnings.join(", ")}`,
  };
}

function checkSingleTxLimit(amount: number, limit: number): RiskCheck {
  if (amount <= limit) {
    return { passed: true, layer: "Layer 3: Single Tx Limit" };
  }
  return {
    passed: false,
    layer: "Layer 3: Single Tx Limit",
    reason: `Amount ${amount.toLocaleString()} exceeds single-tx limit of ${limit.toLocaleString()} USDC`,
  };
}

function checkDailyLimit(additionalAmount: number, limit: number): RiskCheck {
  const todayTotal = getTodaySpend() + additionalAmount;
  if (todayTotal <= limit) {
    return { passed: true, layer: "Layer 4: Daily Limit" };
  }
  return {
    passed: false,
    layer: "Layer 4: Daily Limit",
    reason: `Daily total ${todayTotal.toLocaleString()} would exceed limit of ${limit.toLocaleString()} USDC`,
  };
}
