---
name: trustee-trust
description: "Create and manage on-chain trust funds with programmable release schedules — time-lock, periodic, or milestone-based. View trust status, release due funds, and cancel trusts. Triggers: 'create trust fund', 'set up vesting', 'lock funds for', 'release trust', 'check trust status', 'vesting schedule', 'milestone release', 'trust fund management'."
license: MIT
metadata:
  author: trustee
  version: "1.0.0"
  homepage: "https://github.com/ai-trustee"
---

# Trustee Trust — Programmable Trust Fund Management

Create, manage, and release on-chain trust funds with three programmable release mechanisms: time-lock (release after N days), periodic (monthly/quarterly/annual), and milestone-based (manual trigger). All operations are recorded on the TrusteeVault contract on X Layer (zero gas) and signed via TEE.

## Architecture

```
User: "Lock 10000 USDC for Alice, release 2500 quarterly for 1 year"
  |
  v
[1] Parse trust parameters (beneficiary, amount, schedule, type)
[2] Verify wallet balance (okx-agentic-wallet)
[3] Security scan beneficiary address (okx-security)
[4] Call TrusteeVault.createTrust() on X Layer
[5] Transfer USDC to vault (or earmark in wallet)
[6] Return trustId + release schedule

User: "Release trust #3"
  |
  v
[1] Query trust status from TrusteeVault
[2] Verify release conditions (time elapsed / milestone confirmed)
[3] Execute release transfer to beneficiary
[4] Log release event on X Layer
```

## Prerequisites

### One-time Setup

1. **Login to Agentic Wallet**: `onchainos wallet login <email>`
2. **Deploy TrusteeVault contract** to X Layer (chainId 196)
3. **Fund the wallet** with USDC for trust deposits

### Credentials (from .env)

```
AGENT_WALLET_ADDRESS=0x...
TRUSTEE_VAULT_CONTRACT=0x...
```

## Command Index

| # | Command | Description |
|---|---------|-------------|
| 1 | Create trust | Lock funds with a release schedule |
| 2 | List trusts | View all active trusts |
| 3 | Check status | Get details of a specific trust |
| 4 | Release funds | Execute a due release |
| 5 | Complete milestone | Confirm milestone for milestone-type trusts |
| 6 | Cancel trust | Cancel and return remaining funds |

## Release Types

### TimeLock
Lock funds for a fixed duration, then release everything at once.
- Example: "Lock 5000 USDC for Alice for 90 days"
- After 90 days: full 5000 USDC released to Alice

### Periodic
Release equal installments at regular intervals.
- Example: "Lock 12000 USDC for Bob, release 1000 monthly"
- Each month: 1000 USDC released, for 12 months

### Milestone
Release funds when the admin confirms a milestone is achieved.
- Example: "Lock 10000 USDC for Carol, release on project milestones"
- Admin calls `completeMilestone(trustId, amount)` for each milestone

## Main Flow

### Creating a Trust

**Step 1 — Parse Parameters**:

```typescript
{
  beneficiary: "0xAlice...",
  totalAmount: 10000,          // USDC
  releaseType: "periodic",
  releaseInterval: 90,         // days (quarterly)
  releasePerPeriod: 2500,      // USDC per quarter
  description: "2026 Quarterly Bonus"
}
```

**Step 2 — Validate**:
- Check wallet balance >= totalAmount
- Security scan beneficiary address

**Step 3 — Create on-chain**:
```bash
onchainos wallet contract-call \
  --chain 196 \
  --to <TRUSTEE_VAULT_CONTRACT> \
  --input-data "<encoded_createTrust_call>" \
  --force
```

**Step 4 — Return confirmation**:
```
Trust Created Successfully
  Trust ID: #3
  Beneficiary: Alice (0xAlice...)
  Total: 10,000 USDC
  Type: Periodic (quarterly)
  Schedule: 2,500 USDC every 90 days
  First Release: 2026-07-10
  Completion: 2027-04-10
  Tx: 0xabc...
```

### Releasing Funds

**Step 1 — Check status**:
```bash
# Query TrusteeVault.getTrust(trustId)
onchainos wallet contract-call \
  --chain 196 \
  --to <TRUSTEE_VAULT_CONTRACT> \
  --input-data "<encoded_getTrust_call>"
```

**Step 2 — Verify conditions**:
- For TIME_LOCK: `block.timestamp >= nextReleaseTime`
- For PERIODIC: `block.timestamp >= nextReleaseTime`
- For MILESTONE: admin must call `completeMilestone`

**Step 3 — Execute release**:
```bash
# Call TrusteeVault.release(trustId) on X Layer
onchainos wallet contract-call --chain 196 --to <contract> --input-data "<encoded>" --force

# Then send actual USDC to beneficiary
onchainos wallet send --chain <chainId> --to <beneficiary> --token <USDC> --amount <amount> --force
```

### Listing Active Trusts

Query TrusteeVault.getActiveTrusts() and format:

```
Active Trusts (3 total)

| ID | Beneficiary | Total    | Released | Next Release | Type      |
|----|-------------|----------|----------|--------------|-----------|
| #1 | Alice       | 10,000   | 2,500    | 2026-07-10   | Periodic  |
| #2 | Bob         | 5,000    | 0        | 2026-06-15   | TimeLock  |
| #3 | Carol       | 8,000    | 3,000    | Milestone    | Milestone |
```

## Cross-Skill Workflows

### Workflow A: Fund then Create Trust
```
1. trustee-fund  → Bring USDC from Ethereum to X Layer
2. trustee-trust → Create trust for beneficiary
```

### Workflow B: Auto-Release via Monitor
```
1. trustee-monitor → Checks all trusts hourly
2. trustee-trust   → Auto-releases any due periodic trusts
```

## Critical Rules

| Rule | Detail |
|------|--------|
| **Immutable schedule** | Once created, release schedule cannot be changed (only cancelled) |
| **Beneficiary verified** | Security scan required before trust creation |
| **Dual logging** | Trust operations logged on TrusteeVault contract + audit log |
| **Cancel = return** | Cancelling a trust returns unreleased funds to admin wallet |
| **Milestone authority** | Only admin can confirm milestones |

## Error Reference

| Error | Cause | Fix |
|-------|-------|-----|
| Trust not active | Trust completed or cancelled | Check trust status first |
| Lock period not elapsed | TimeLock hasn't expired | Wait until nextReleaseTime |
| Next release not due | Periodic interval not reached | Wait until nextReleaseTime |
| Amount exceeds remaining | Milestone release > remaining | Reduce release amount |
| Insufficient balance | Not enough to fund trust | Top up via trustee-fund |
