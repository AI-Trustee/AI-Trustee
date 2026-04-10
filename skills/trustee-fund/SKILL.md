---
name: trustee-fund
description: "Cross-chain funding for the Trustee platform. Move assets from any chain into the agent's working wallet to prepare for payroll or trust fund deposits. Triggers: 'fund payroll', 'deposit for salaries', 'top up trust', 'cross-chain transfer', 'fund the agent', 'move USDC from Ethereum', 'bridge funds', 'fund wallet'."
license: MIT
metadata:
  author: trustee
  version: "1.0.0"
  homepage: "https://github.com/ai-trustee"
---

# Trustee Fund — Cross-Chain Wallet Funding

Move assets from any EVM chain into the Trustee agent's working wallet. Supports cross-chain swaps via OKX DEX Aggregator (500+ DEX sources), automatic token conversion, and balance verification. Ensures the wallet is funded and ready for payroll distribution or trust fund creation.

## Architecture

```
User: "Fund the payroll wallet with 5000 USDC from Ethereum"
  |
  v
[1] Check source balance on specified chain (okx-wallet-portfolio)
[2] Quote cross-chain swap (okx-dex-swap)
[3] Execute swap with TEE signing (okx-agentic-wallet)
[4] Verify arrival in target wallet
[5] Report funding result
```

## Prerequisites

1. **Agentic Wallet** logged in: `onchainos wallet login <email>`
2. **Source funds** available on the origin chain
3. **Target chain** determined (default: chain where payroll/trust operates)

## Command Index

| # | Command | Description |
|---|---------|-------------|
| 1 | Check balance | Query wallet balance across chains |
| 2 | Quote swap | Get cross-chain swap quote |
| 3 | Execute funding | Perform the cross-chain transfer |
| 4 | Verify arrival | Confirm funds received |

## Main Flow

### Step 1 — Check Source Balance

```bash
onchainos wallet balance --chain <sourceChainId>
```

Or query all chains:
```bash
# Via okx-wallet-portfolio MCP tool
mcp__onchainos-mcp__dex-okx-balance-total-value --address <wallet> --chains <chainId>
```

### Step 2 — Quote Cross-Chain Swap

```bash
onchainos swap quote \
  --chain <sourceChainId> \
  --from-token <sourceToken> \
  --to-token 0x2791bca1f2de4661ed88a30c99a7a9449aa84174 \
  --amount <amount> \
  --to-chain <targetChainId> \
  --slippage 1
```

Review quote: expected output, price impact, estimated gas.

### Step 3 — Execute Swap

```bash
onchainos swap execute \
  --chain <sourceChainId> \
  --from-token <sourceToken> \
  --to-token <targetToken> \
  --amount <amount> \
  --to-chain <targetChainId> \
  --slippage 1 \
  --force
```

### Step 4 — Verify Arrival

Wait for cross-chain settlement (typically 1-5 minutes), then:
```bash
onchainos wallet balance --chain <targetChainId>
```

### Step 5 — Report

```
Funding Complete
  Source: Ethereum (5,000 USDC)
  Target: Polygon (4,985 USDC received)
  Swap Fee: ~15 USDC
  Tx Hash: 0xabc...
  New Balance: 12,500 USDC
```

## Supported Chains

| Chain | Chain ID | Common tokens |
|-------|----------|---------------|
| Ethereum | 1 | USDC, USDT, ETH |
| Polygon | 137 | USDC.e, USDT, MATIC |
| X Layer | 196 | USDC, OKB |
| Arbitrum | 42161 | USDC, USDT, ETH |
| Base | 8453 | USDC, ETH |
| BSC | 56 | USDC, USDT, BNB |

## Critical Rules

| Rule | Detail |
|------|--------|
| **Slippage** | Default 1%, warn user if >3% |
| **Min amount** | Warn if funding < $100 (may not cover gas) |
| **X Layer advantage** | Route through X Layer when possible (zero gas) |
| **Verify before use** | Always confirm arrival before proceeding to payroll/trust |

## Error Reference

| Error | Cause | Fix |
|-------|-------|-----|
| Insufficient balance | Source chain has less than requested | Check balance first |
| Swap failed | Liquidity issue or high slippage | Try different route or increase slippage |
| Bridge timeout | Cross-chain settlement delayed | Wait and retry verification |
