/**
 * Trust fund management engine.
 *
 * Creates, queries, releases, and cancels programmable trust funds
 * backed by the TrusteeVault smart contract on X Layer.
 */

import {
  contractCall,
  sendTokens,
  getWalletBalance,
  securityScan,
} from "./okx-integration.js";
import type {
  TrustConfig,
  Trust,
  TrustReleaseResult,
  ReleaseType,
} from "./types.js";
import { CHAINS } from "./types.js";

/**
 * Convert days to seconds.
 */
function daysToSeconds(days: number): number {
  return days * 86400;
}

/**
 * Map string release type to contract enum value.
 */
function releaseTypeToEnum(type: ReleaseType): number {
  switch (type) {
    case "time_lock":
      return 0;
    case "periodic":
      return 1;
    case "milestone":
      return 2;
  }
}

/**
 * Create a new trust fund.
 *
 * 1. Validate beneficiary address
 * 2. Check wallet balance
 * 3. Call TrusteeVault.createTrust() on X Layer
 * 4. Return trust ID and schedule
 */
export async function createTrust(
  config: TrustConfig,
  vaultContract: string
): Promise<{ trustId: number; schedule: string } | { error: string }> {
  // Security scan beneficiary
  const scan = await securityScan(config.beneficiary, CHAINS.X_LAYER);
  if (!scan.safe) {
    return {
      error: `Beneficiary address flagged: ${scan.warnings.join(", ")}`,
    };
  }

  // Check balance
  const balance = await getWalletBalance(CHAINS.X_LAYER);
  if (!balance || parseFloat(balance.balanceUsd) < config.totalAmount) {
    return { error: "Insufficient balance to fund this trust" };
  }

  // Calculate release parameters
  const releaseInterval = config.releaseInterval
    ? daysToSeconds(config.releaseInterval)
    : config.lockDuration
      ? daysToSeconds(config.lockDuration)
      : 0;

  const releasePerPeriod = config.releasePerPeriod
    ? Math.floor(config.releasePerPeriod * 1e6)
    : Math.floor(config.totalAmount * 1e6);

  // Encode createTrust call
  const totalAmountMinimal = Math.floor(config.totalAmount * 1e6);
  const rTypeEnum = releaseTypeToEnum(config.releaseType);

  // In production: use proper ABI encoding (ethers.js or viem)
  const inputData = encodeTrustCreation(
    config.beneficiary,
    totalAmountMinimal,
    releaseInterval,
    releasePerPeriod,
    rTypeEnum,
    config.description
  );

  const result = await contractCall(CHAINS.X_LAYER, vaultContract, inputData);
  if (!result.ok) {
    return { error: result.error ?? "Failed to create trust on-chain" };
  }

  // Build schedule description
  const schedule = buildScheduleDescription(config);

  return {
    trustId: 0, // Would be parsed from event logs in production
    schedule,
  };
}

/**
 * Check if a trust is eligible for release.
 */
export function isReleasable(trust: Trust): boolean {
  if (trust.status !== "active") return false;
  if (trust.releaseType === "milestone") return false; // Needs manual trigger
  if (trust.releasedAmount >= trust.totalAmount) return false;

  const now = Math.floor(Date.now() / 1000);
  return now >= trust.nextReleaseTime;
}

/**
 * Execute a trust fund release.
 */
export async function releaseTrust(
  trust: Trust,
  vaultContract: string,
  chain: number = CHAINS.POLYGON
): Promise<TrustReleaseResult> {
  if (!isReleasable(trust)) {
    return {
      trustId: trust.id,
      amountReleased: 0,
      remaining: trust.totalAmount - trust.releasedAmount,
      beneficiary: trust.beneficiary,
    };
  }

  // Calculate release amount
  let releaseAmount: number;
  const remaining = trust.totalAmount - trust.releasedAmount;

  if (trust.releaseType === "time_lock") {
    releaseAmount = remaining;
  } else {
    releaseAmount = Math.min(trust.releasePerPeriod / 1e6, remaining);
  }

  // Call vault contract release
  const vaultResult = await contractCall(
    CHAINS.X_LAYER,
    vaultContract,
    `0x${trust.id.toString(16).padStart(64, "0")}`
  );

  // Send actual funds to beneficiary
  const sendResult = await sendTokens(
    chain,
    trust.beneficiary,
    "0x2791bca1f2de4661ed88a30c99a7a9449aa84174", // USDC
    String(Math.floor(releaseAmount * 1e6))
  );

  return {
    trustId: trust.id,
    amountReleased: releaseAmount,
    remaining: remaining - releaseAmount,
    beneficiary: trust.beneficiary,
    txHash: sendResult.data?.txHash as string | undefined,
    auditTxHash: vaultResult.data?.txHash as string | undefined,
  };
}

/**
 * Complete a milestone-based trust release.
 */
export async function completeMilestone(
  trustId: number,
  amount: number,
  beneficiary: string,
  vaultContract: string,
  chain: number = CHAINS.POLYGON
): Promise<TrustReleaseResult> {
  const amountMinimal = Math.floor(amount * 1e6);

  // Call vault completeMilestone
  const vaultResult = await contractCall(
    CHAINS.X_LAYER,
    vaultContract,
    `0x${trustId.toString(16).padStart(64, "0")}${amountMinimal.toString(16).padStart(32, "0")}`
  );

  // Send funds to beneficiary
  const sendResult = await sendTokens(
    chain,
    beneficiary,
    "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    String(amountMinimal)
  );

  return {
    trustId,
    amountReleased: amount,
    remaining: 0, // Would be calculated from contract state
    beneficiary,
    txHash: sendResult.data?.txHash as string | undefined,
    auditTxHash: vaultResult.data?.txHash as string | undefined,
  };
}

/**
 * Build a human-readable schedule description.
 */
function buildScheduleDescription(config: TrustConfig): string {
  switch (config.releaseType) {
    case "time_lock":
      return `Locked for ${config.lockDuration ?? config.releaseInterval ?? 0} days, then full release`;
    case "periodic": {
      const intervalDays = config.releaseInterval ?? 30;
      const periods = config.releasePerPeriod
        ? Math.ceil(config.totalAmount / config.releasePerPeriod)
        : 1;
      const intervalLabel =
        intervalDays === 30
          ? "monthly"
          : intervalDays === 90
            ? "quarterly"
            : intervalDays === 365
              ? "annually"
              : `every ${intervalDays} days`;
      return `${config.releasePerPeriod?.toLocaleString()} USDC ${intervalLabel} for ${periods} periods`;
    }
    case "milestone":
      return "Released on milestone confirmation by admin";
  }
}

/**
 * Format a trust as a human-readable summary.
 */
export function formatTrustSummary(trust: Trust): string {
  const released = trust.releasedAmount.toLocaleString();
  const total = trust.totalAmount.toLocaleString();
  const remaining = (trust.totalAmount - trust.releasedAmount).toLocaleString();

  const nextRelease =
    trust.releaseType === "milestone"
      ? "On milestone"
      : new Date(trust.nextReleaseTime * 1000).toISOString().split("T")[0];

  return [
    `Trust #${trust.id}`,
    `  Beneficiary: ${trust.beneficiary}`,
    `  Total: ${total} USDC`,
    `  Released: ${released} USDC`,
    `  Remaining: ${remaining} USDC`,
    `  Type: ${trust.releaseType}`,
    `  Next Release: ${nextRelease}`,
    `  Status: ${trust.status}`,
  ].join("\n");
}

/**
 * Encode trust creation parameters.
 * In production: use viem's encodeFunctionData or ethers.AbiCoder.
 */
function encodeTrustCreation(
  beneficiary: string,
  totalAmount: number,
  releaseInterval: number,
  releasePerPeriod: number,
  releaseType: number,
  description: string
): string {
  // Simplified encoding — production should use proper ABI encoding
  const addr = beneficiary.slice(2).padStart(64, "0");
  const amount = totalAmount.toString(16).padStart(32, "0");
  const interval = releaseInterval.toString(16).padStart(10, "0");
  const perPeriod = releasePerPeriod.toString(16).padStart(32, "0");
  const rType = releaseType.toString(16).padStart(2, "0");

  return `0x${addr}${amount}${interval}${perPeriod}${rType}`;
}
