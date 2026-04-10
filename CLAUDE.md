# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

**AI-Trustee** — An on-chain payroll distribution and trust fund management platform for the OKX Build X Hackathon (Skills Arena). Combines batch salary payments with programmable trust funds (time-lock, periodic, milestone-based release), all secured by TEE signing and audited on X Layer.

## Architecture

```
User (natural language) -> Claude Code Skills -> TypeScript Engine -> OKX Onchain OS / Smart Contracts
```

- **Skills** (`skills/`) define AI interaction patterns — 4 skills: payroll, trust, fund, monitor
- **TypeScript Engine** (`src/`) implements business logic — payroll, trust management, risk control
- **Contracts** (`contracts/`) Solidity smart contracts on X Layer (chainId 196) for audit trail
- **Web** (`web/`) Next.js landing page showcasing the product

## Commands

```bash
# TypeScript engine — payroll + trust management
cd src && npm install && npx vitest run

# Web — landing page
cd web && npm install && npm run dev

# Smart contracts (requires solc 0.8.20+)
cd contracts && solc --optimize --bin --abi src/TrusteePayroll.sol src/TrusteeVault.sol
```

## Key Design Decisions

1. **Batch efficiency.** Payroll uses batch operations — one command pays all recipients.
2. **Programmable trusts.** Three release types: TimeLock, Periodic, Milestone.
3. **4-layer risk control.** Daily limit, single-tx limit, address security scan, balance check.
4. **TEE-only signing.** All transactions signed via Agentic Wallet — private key never exposed.
5. **X Layer audit trail.** Every payroll batch and trust action logged on-chain (zero gas).

## Conventions

- TypeScript: camelCase, strict mode, explicit types
- All code in English (no Chinese characters in source)
- Skill definitions follow OKX Onchain OS SKILL.md format
- Test files colocated in `src/tests/`

## Environment Variables

```
AGENT_WALLET_ADDRESS=0x...       # Agentic Wallet address
TRUSTEE_PAYROLL_CONTRACT=0x...   # TrusteePayroll on X Layer
TRUSTEE_VAULT_CONTRACT=0x...     # TrusteeVault on X Layer
DAILY_PAYROLL_LIMIT=50000        # Max daily payroll in USDC
SINGLE_TX_LIMIT=10000            # Max single transaction in USDC
```

## OKX Skills Used

okx-agentic-wallet, okx-onchain-gateway, okx-dex-swap, okx-dex-market, okx-security, okx-wallet-portfolio, okx-audit-log, okx-x402-payment
