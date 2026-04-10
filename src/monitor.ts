/**
 * Autonomous monitoring loop.
 *
 * Watches for scheduled payroll dates and trust fund release conditions.
 * When conditions are met, auto-executes via trustee-payroll and trustee-trust.
 * All actions logged to X Layer.
 */

import { executePayroll, formatPayrollReport } from "./payroll.js";
import { isReleasable, releaseTrust, formatTrustSummary } from "./trust-manager.js";
import { getWalletBalance } from "./okx-integration.js";
import { recordSpend } from "./risk-controller.js";
import type {
  MonitorConfig,
  MonitorCycleResult,
  Trust,
} from "./types.js";
import { CHAINS, DEFAULT_RISK_CONFIG } from "./types.js";

// Track which months payroll has already been executed
const executedPayrolls = new Set<string>();

/**
 * Get the current month key (e.g., "2026-04").
 */
function currentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * Check if today is payroll day and payroll hasn't been run yet this month.
 */
export function isPayrollDue(payrollDay: number): boolean {
  const today = new Date().getDate();
  const monthKey = currentMonthKey();
  return today === payrollDay && !executedPayrolls.has(monthKey);
}

/**
 * Mark payroll as executed for current month.
 */
function markPayrollExecuted(): void {
  executedPayrolls.set(currentMonthKey());
}

/**
 * Run a single monitor cycle.
 *
 * Checks:
 * 1. Is today payroll day? → Execute batch
 * 2. Any trusts due for release? → Execute releases
 * 3. Balance warning if low
 */
export async function runCycle(
  config: MonitorConfig,
  activeTrusts: Trust[],
  cycleNumber: number
): Promise<MonitorCycleResult> {
  const alerts: string[] = [];
  let payrollExecuted = false;
  let trustsReleased = 0;

  // ── Payroll Check ──
  if (isPayrollDue(config.payrollDay)) {
    if (config.dryRun) {
      alerts.push(
        `[DRY RUN] Would execute payroll for ${config.payrollList.length} recipients`
      );
    } else {
      const memo = `${currentMonthKey()} Salary`;
      const result = await executePayroll(
        config.payrollList,
        memo,
        config.riskConfig
      );
      payrollExecuted = true;
      recordSpend(result.totalAmount);
      markPayrollExecuted();

      if (result.totalFailed > 0) {
        alerts.push(
          `Payroll partial: ${result.totalSucceeded}/${result.entries.length} succeeded`
        );
      }
      alerts.push(formatPayrollReport(result));
    }
  }

  // ── Trust Release Check ──
  for (const trust of activeTrusts) {
    if (isReleasable(trust)) {
      if (config.dryRun) {
        alerts.push(
          `[DRY RUN] Would release Trust #${trust.id}: ${trust.releasePerPeriod / 1e6} USDC to ${trust.beneficiary}`
        );
        trustsReleased++;
      } else {
        const vaultContract =
          process.env.TRUSTEE_VAULT_CONTRACT ?? "0x0000000000000000000000000000000000000000";
        const result = await releaseTrust(trust, vaultContract);
        if (result.amountReleased > 0) {
          trustsReleased++;
          recordSpend(result.amountReleased);
          alerts.push(
            `Released Trust #${trust.id}: ${result.amountReleased.toLocaleString()} USDC to ${trust.beneficiary.slice(0, 10)}...`
          );
        }
      }
    }
  }

  // ── Balance Check ──
  const balance = await getWalletBalance(CHAINS.POLYGON);
  const balanceUsd = balance ? parseFloat(balance.balanceUsd) : 0;

  if (balanceUsd < config.riskConfig.alertBalanceThreshold) {
    alerts.push(
      `WARNING: Balance ${balanceUsd.toLocaleString()} USDC below threshold ${config.riskConfig.alertBalanceThreshold.toLocaleString()} USDC`
    );
  }

  return {
    cycleNumber,
    timestamp: Date.now(),
    payrollExecuted,
    trustsChecked: activeTrusts.length,
    trustsReleased,
    balanceUsd,
    alerts,
  };
}

/**
 * Format a cycle result as a log entry.
 */
export function formatCycleLog(result: MonitorCycleResult): string {
  const time = new Date(result.timestamp).toISOString();
  const lines = [
    `[${time}] Monitor Cycle #${result.cycleNumber}`,
    `  Payroll: ${result.payrollExecuted ? "EXECUTED" : "Not due"}`,
    `  Trusts checked: ${result.trustsChecked}`,
    `  Trusts released: ${result.trustsReleased}`,
    `  Balance: ${result.balanceUsd.toLocaleString()} USDC`,
  ];

  if (result.alerts.length > 0) {
    lines.push("  Alerts:");
    for (const alert of result.alerts) {
      lines.push(`    - ${alert}`);
    }
  }

  return lines.join("\n");
}

/**
 * Start the monitoring loop.
 * Runs indefinitely until the process is stopped.
 */
export async function startMonitor(
  config: MonitorConfig,
  getTrusts: () => Promise<Trust[]>
): Promise<void> {
  let cycle = 0;

  console.log("Trustee Monitor started");
  console.log(`  Payroll day: ${config.payrollDay}`);
  console.log(`  Interval: ${config.intervalMs / 1000}s`);
  console.log(`  Dry run: ${config.dryRun}`);
  console.log(`  Recipients: ${config.payrollList.length}`);

  const loop = async () => {
    cycle++;
    const trusts = await getTrusts();
    const result = await runCycle(config, trusts, cycle);
    console.log(formatCycleLog(result));
  };

  // Run immediately, then on interval
  await loop();
  setInterval(loop, config.intervalMs);
}
