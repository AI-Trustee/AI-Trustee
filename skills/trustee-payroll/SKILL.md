---
name: trustee-payroll
description: "Batch on-chain salary distribution using OKX Agentic Wallet. Pay multiple recipients in one command, with security scanning and on-chain audit trail. Triggers: 'pay salaries', 'batch payment', 'distribute payroll', 'send salaries to team', 'pay employees', 'batch send USDC', 'payroll distribution', 'pay my team'."
license: MIT
metadata:
  author: trustee
  version: "1.0.0"
  homepage: "https://github.com/ai-trustee"
---

# Trustee Payroll — Batch Salary Distribution

Execute batch salary payments to multiple recipients in a single command. Every payment is security-scanned before execution and logged to the TrusteePayroll audit contract on X Layer (zero gas). All signing happens inside TEE — the private key never leaves the secure enclave.

## Architecture

```
User: "Pay salaries: Alice 2000 USDC, Bob 1500 USDC, Carol 1000 USDC"
  |
  v
[1] Parse recipient list (address + amount pairs)
[2] Check wallet balance (okx-agentic-wallet)
[3] Risk control: 4-layer validation
    - Layer 1: Balance sufficiency check
    - Layer 2: Address security scan (okx-security)
    - Layer 3: Single-tx limit ($10,000)
    - Layer 4: Daily payroll limit ($50,000)
[4] Execute batch transfers via onchainos wallet send
[5] Log payroll record to TrusteePayroll contract (X Layer)
[6] Return batch report with tx hashes
```

## Prerequisites

### One-time Setup

1. **Login to Agentic Wallet**:
   ```bash
   onchainos wallet login <email>
   onchainos wallet verify <code>
   ```

2. **Deploy TrusteePayroll contract** to X Layer (chainId 196):
   - Compile: `solc --optimize --bin src/TrusteePayroll.sol`
   - Deploy via: `onchainos wallet contract-call --chain 196 ...`
   - Save contract address to `.env` as `TRUSTEE_PAYROLL_CONTRACT`

3. **Fund the wallet** with USDC on the target chain

### Credentials (from .env)

```
AGENT_WALLET_ADDRESS=0x...
TRUSTEE_PAYROLL_CONTRACT=0x...
DAILY_PAYROLL_LIMIT=50000
SINGLE_TX_LIMIT=10000
```

## Command Index

| # | Command | Description |
|---|---------|-------------|
| 1 | Parse payroll | Convert natural language to recipient list |
| 2 | Validate payroll | Run 4-layer risk checks |
| 3 | Execute batch | Send payments to all recipients |
| 4 | Log on-chain | Record batch to TrusteePayroll contract |
| 5 | Generate report | Summarize results with tx hashes |

## Main Flow

### Step 1 — Parse Payroll Input

Accept payroll data in flexible formats:

```
# Natural language
"Pay Alice 2000, Bob 1500, Carol 1000 USDC"

# Structured
[
  { "address": "0xAlice...", "amount": 2000, "token": "USDC" },
  { "address": "0xBob...",   "amount": 1500, "token": "USDC" },
  { "address": "0xCarol...", "amount": 1000, "token": "USDC" }
]
```

If addresses are not provided, look up from a configured employee registry or ask the user.

### Step 2 — Validate (4-Layer Risk Control)

**Layer 1 — Balance Check**:
```bash
onchainos wallet balance --chain <chainId>
```
Verify: wallet balance >= sum of all payments + estimated gas

**Layer 2 — Address Security Scan**:
```bash
onchainos security token-scan --address <recipient> --chain <chainId>
```
For each recipient address. Flag any addresses with risk indicators.

**Layer 3 — Single Transaction Limit**:
Each individual payment must be <= `SINGLE_TX_LIMIT` (default $10,000 USDC).

**Layer 4 — Daily Payroll Limit**:
Sum of today's payroll batches must be <= `DAILY_PAYROLL_LIMIT` (default $50,000 USDC).

### Step 3 — Execute Batch Payments

For each recipient:
```bash
onchainos wallet send \
  --chain <chainId> \
  --to <recipient_address> \
  --token <token_contract> \
  --amount <amount_in_minimal_units> \
  --force
```

`--force` enables autonomous signing without manual confirmation (TEE-secured).

If the token differs across recipients (e.g., some in USDT, some in ETH), use `onchainos swap execute` to convert first.

### Step 4 — Log to X Layer Contract

After all payments complete, record the batch:

```bash
onchainos wallet contract-call \
  --chain 196 \
  --to <TRUSTEE_PAYROLL_CONTRACT> \
  --input-data "<encoded_logPayroll_call>" \
  --force
```

Parameters for `logPayroll(uint128 totalAmount, uint16 recipientCount, string batchId, string memo)`:
- `totalAmount`: sum of all payments in 6-decimal USDC
- `recipientCount`: number of recipients
- `batchId`: generated batch ID (e.g., "2026-04-001")
- `memo`: user-provided or auto-generated description

### Step 5 — Generate Report

Return a summary:
```
Payroll Batch: 2026-04-001
Status: COMPLETED
Total: 4,500 USDC
Recipients: 3

| Recipient | Amount | Tx Hash | Status |
|-----------|--------|---------|--------|
| Alice     | 2,000  | 0xabc.. | OK     |
| Bob       | 1,500  | 0xdef.. | OK     |
| Carol     | 1,000  | 0x123.. | OK     |

Audit Log: X Layer tx 0x456...
```

## Cross-Skill Workflows

### Workflow A: Fund then Pay

```
1. trustee-fund    → Top up wallet with USDC from another chain
2. trustee-payroll → Execute batch salary payment
```

### Workflow B: Scheduled Payroll

```
1. trustee-monitor → Auto-trigger on payroll day (e.g., 1st of month)
2. trustee-payroll → Execute pre-configured payroll list
```

## Critical Rules

| Rule | Detail |
|------|--------|
| **TEE signing** | All sends use `--force` flag for autonomous TEE signing |
| **Security scan first** | Every recipient address must pass security scan before payment |
| **Idempotency** | Generate unique batchId per run to prevent duplicate payments |
| **Audit trail** | Every batch MUST be logged to TrusteePayroll contract on X Layer |
| **Multi-token** | If recipients need different tokens, swap via okx-dex-swap first |

## Error Reference

| Error | Cause | Fix |
|-------|-------|-----|
| Insufficient balance | Wallet has less than total payroll | Fund wallet via trustee-fund |
| Security scan failed | Recipient address flagged | Review address, remove from batch or override |
| Daily limit exceeded | Total exceeds $50,000/day | Split into multiple days or increase limit |
| Send failed | Network issue or gas | Retry the failed transfer |
