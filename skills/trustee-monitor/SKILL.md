---
name: trustee-monitor
description: "Autonomous monitoring loop for scheduled payroll execution and trust fund release management. Runs continuously, checking for due payroll dates and trust release conditions, then executes automatically. Triggers: 'start monitoring', 'auto-pay mode', 'schedule payroll', 'watch trusts', 'run trustee agent', 'begin autopilot', 'automated payroll', 'monitor trust releases'."
license: MIT
metadata:
  author: trustee
  version: "1.0.0"
  homepage: "https://github.com/ai-trustee"
---

# Trustee Monitor — Autonomous Payroll & Trust Agent

Fully autonomous monitoring loop that watches for scheduled payroll dates and trust fund release conditions. When conditions are met, it automatically executes payroll distributions and trust releases — all signed in TEE, all logged on X Layer. No human intervention required after startup.

## Architecture

```
User: "Start monitoring: auto-pay salaries on the 1st, check trust releases daily"
  |
  v
LOOP (every interval, default 1 hour):
  |
  [1] Check current date → Is it payroll day?
  |   YES → Execute trustee-payroll with pre-configured batch
  |   NO  → Skip
  |
  [2] Query all active trusts from TrusteeVault
  |   For each trust:
  |     Is nextReleaseTime <= now?
  |     YES → Execute trustee-trust release
  |     NO  → Skip
  |
  [3] Balance warning check
  |   If wallet balance < next scheduled total → ALERT
  |
  [4] Log monitoring cycle to X Layer audit trail
  |
  [5] Sleep until next cycle
```

## Prerequisites

1. **Agentic Wallet** logged in with `--force` enabled for autonomous signing
2. **TrusteePayroll** and **TrusteeVault** contracts deployed on X Layer
3. **Payroll configuration** saved (employee list + amounts)
4. **Sufficient balance** for upcoming payments

## Command Index

| # | Command | Description |
|---|---------|-------------|
| 1 | Start monitor | Begin autonomous monitoring loop |
| 2 | Stop monitor | Halt monitoring |
| 3 | Check status | View current monitor state and next actions |
| 4 | Dry run | Simulate next cycle without executing |

## Configuration

```typescript
{
  // Payroll schedule
  payrollDay: 1,                    // Day of month (1-28)
  payrollList: [                    // Pre-configured recipients
    { address: "0x...", amount: 2000, token: "USDC" },
    { address: "0x...", amount: 1500, token: "USDC" }
  ],

  // Monitor settings
  intervalMs: 3600000,              // Check every hour (default)
  dryRun: false,                    // Set true for simulation

  // Safety
  maxDailySpend: 50000,             // Circuit breaker
  alertBalanceThreshold: 10000      // Warn when balance drops below
}
```

## Main Loop

### Cycle 1 — Payroll Check

```python
current_day = datetime.now().day
if current_day == config.payrollDay:
    if not already_paid_this_month():
        execute_payroll(config.payrollList)
        log_to_xlayer("PAYROLL", batch_id, total_amount)
```

### Cycle 2 — Trust Release Check

```python
active_trusts = query_trustee_vault.getActiveTrusts()
for trust in active_trusts:
    if trust.nextReleaseTime <= now and trust.releaseType != MILESTONE:
        execute_release(trust.id)
        log_to_xlayer("TRUST_RELEASE", trust.id, release_amount)
```

### Cycle 3 — Balance Warning

```python
balance = get_wallet_balance()
upcoming = calculate_upcoming_obligations()
if balance < upcoming:
    alert("WARNING: Balance insufficient for upcoming obligations")
    alert(f"  Balance: {balance} USDC")
    alert(f"  Upcoming: {upcoming} USDC")
    alert(f"  Shortfall: {upcoming - balance} USDC")
```

### Cycle 4 — Audit Log

Every cycle (whether actions were taken or not) is logged:
```
[2026-04-10 09:00] Monitor Cycle #142
  Payroll: Not due (next: 2026-05-01)
  Trusts checked: 3 active
  Releases executed: 1 (Trust #2: 2,500 USDC to Alice)
  Balance: 45,000 USDC (OK)
  Next cycle: 2026-04-10 10:00
```

## Safety Features

| Feature | Description |
|---------|-------------|
| **Dry-run mode** | Simulate all actions without executing transactions |
| **Daily spend cap** | Circuit breaker if total daily spend exceeds limit |
| **Balance alerts** | Warn when balance insufficient for upcoming obligations |
| **Duplicate prevention** | Track executed batches to prevent double-payment |
| **Graceful shutdown** | Complete current cycle before stopping |
| **TEE-only** | All signing via Agentic Wallet `--force` |

## Critical Rules

| Rule | Detail |
|------|--------|
| **No double-pay** | Track payroll execution by month — never pay the same month twice |
| **Milestone trusts** | NEVER auto-release milestone trusts — admin must confirm manually |
| **Balance guard** | Alert (don't halt) if balance is low — some payments may still be possible |
| **Force flag** | All signing uses `--force` for autonomous operation |
| **Audit every cycle** | Log even idle cycles to prove the agent is alive |

## Error Reference

| Error | Cause | Fix |
|-------|-------|-----|
| Insufficient balance | Can't cover upcoming payments | Fund wallet via trustee-fund |
| Contract call failed | X Layer issue | Retry next cycle |
| Already executed | Payroll already run this month | Skip — duplicate prevention working correctly |
| Trust not active | Trust completed or cancelled | Remove from active watch list |
