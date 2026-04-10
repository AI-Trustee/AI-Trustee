/**
 * Core type definitions for the AI-Trustee platform.
 */

// ─── Payroll ─────────────────────────────────────────────

export interface PayrollEntry {
  address: string;
  amount: number; // Human-readable (e.g., 2000 = 2000 USDC)
  token: string; // "USDC", "USDT", etc.
  chain: number; // chainId
  memo?: string; // Optional note (e.g., "April bonus")
}

export interface PayrollBatch {
  batchId: string; // Unique batch identifier
  entries: PayrollEntry[];
  totalAmount: number;
  memo: string;
  timestamp: number;
}

export interface PayrollResult {
  batchId: string;
  entries: PayrollEntryResult[];
  totalAmount: number;
  totalSucceeded: number;
  totalFailed: number;
  auditTxHash?: string; // X Layer log tx
}

export interface PayrollEntryResult {
  address: string;
  amount: number;
  txHash?: string;
  status: "success" | "failed";
  error?: string;
}

// ─── Trust ───────────────────────────────────────────────

export type ReleaseType = "time_lock" | "periodic" | "milestone";
export type TrustStatus = "active" | "completed" | "cancelled";

export interface TrustConfig {
  beneficiary: string;
  totalAmount: number; // USDC
  releaseType: ReleaseType;
  releaseInterval?: number; // Days between releases
  releasePerPeriod?: number; // USDC per period
  lockDuration?: number; // Days (for time_lock)
  description: string;
}

export interface Trust {
  id: number;
  beneficiary: string;
  totalAmount: number;
  releasedAmount: number;
  startTime: number; // Unix timestamp
  releaseInterval: number; // Seconds
  releasePerPeriod: number;
  nextReleaseTime: number; // Unix timestamp
  releaseType: ReleaseType;
  status: TrustStatus;
  description: string;
}

export interface TrustReleaseResult {
  trustId: number;
  amountReleased: number;
  remaining: number;
  beneficiary: string;
  txHash?: string;
  auditTxHash?: string;
}

// ─── Risk Control ────────────────────────────────────────

export interface RiskCheck {
  passed: boolean;
  layer: string;
  reason?: string;
}

export interface RiskValidation {
  passed: boolean;
  checks: RiskCheck[];
  blockedBy?: string; // Layer that blocked
}

export interface RiskConfig {
  dailyPayrollLimit: number; // Max daily payroll (USDC)
  singleTxLimit: number; // Max single transaction (USDC)
  alertBalanceThreshold: number; // Warn when balance below this
}

// ─── Monitor ─────────────────────────────────────────────

export interface MonitorConfig {
  payrollDay: number; // Day of month (1-28)
  payrollList: PayrollEntry[];
  intervalMs: number; // Loop interval
  dryRun: boolean;
  riskConfig: RiskConfig;
}

export interface MonitorCycleResult {
  cycleNumber: number;
  timestamp: number;
  payrollExecuted: boolean;
  trustsChecked: number;
  trustsReleased: number;
  balanceUsd: number;
  alerts: string[];
}

// ─── OKX Integration ────────────────────────────────────

export interface OkxCommandResult {
  ok: boolean;
  data?: Record<string, unknown>;
  error?: string;
  raw?: string;
}

export interface WalletBalance {
  chain: number;
  token: string;
  balance: string;
  balanceUsd: string;
}

export interface SecurityScanResult {
  address: string;
  safe: boolean;
  riskLevel: "low" | "medium" | "high" | "critical";
  warnings: string[];
}

export interface SwapQuote {
  fromAmount: string;
  toAmount: string;
  priceImpact: string;
  estimatedGas: string;
}

// ─── Constants ───────────────────────────────────────────

export const CHAINS = {
  ETHEREUM: 1,
  POLYGON: 137,
  X_LAYER: 196,
  ARBITRUM: 42161,
  BASE: 8453,
  BSC: 56,
} as const;

export const TOKENS = {
  USDC_POLYGON: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
  USDC_ETHEREUM: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  NATIVE: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
} as const;

export const DEFAULT_RISK_CONFIG: RiskConfig = {
  dailyPayrollLimit: 50_000,
  singleTxLimit: 10_000,
  alertBalanceThreshold: 10_000,
};
