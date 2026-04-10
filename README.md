# AI-Trustee — On-Chain Payroll & Trust Fund Manager

An autonomous AI agent that handles batch salary distribution and programmable trust fund management, secured by TEE signing and audited on X Layer. Built for the OKX Build X Hackathon.

## Architecture

```
User (natural language)
  ↓
Claude Code + AI Skills (4 skills)
  ↓
TypeScript Engine (payroll, trust, risk, monitor)
  ↓
OKX Onchain OS (Agentic Wallet, DEX, Security, Gateway)
  ↓
Smart Contracts (TrusteePayroll + TrusteeVault on X Layer)
```

## Core Capabilities

### 1. Batch Payroll Distribution
- Pay multiple recipients in one command
- 4-layer risk control (balance → security scan → tx limit → daily cap)
- On-chain batch audit log

### 2. Programmable Trust Funds
- **Time Lock** — release after fixed duration
- **Periodic** — monthly/quarterly/annual installments
- **Milestone** — admin-confirmed achievement triggers

### 3. TEE-Secured Signing
- All transactions signed in OKX Agentic Wallet TEE
- Private key never leaves the secure enclave
- Autonomous operation with `--force` flag

### 4. On-Chain Audit Trail
- Every batch and trust action logged on X Layer (zero gas)
- Fully queryable: `getRecent(n)`, `getActiveTrusts()`

## Quick Start

```bash
# 1. Login to Agentic Wallet
onchainos wallet login your@email.com
onchainos wallet verify <code>

# 2. Install engine dependencies
npm install

# 3. Run tests
npx vitest run

# 4. Start web landing page
cd web && npm install && npm run dev
```

## AI Skills

| Skill | Purpose |
|-------|---------|
| `trustee-payroll` | Batch salary distribution |
| `trustee-trust` | Trust fund creation & release |
| `trustee-fund` | Cross-chain wallet funding |
| `trustee-monitor` | Autonomous payroll & trust agent |

## OKX Products Used (8+)

| Product | Role |
|---------|------|
| Agentic Wallet (TEE) | All transaction signing |
| X Layer Contract | Audit trail (zero gas) |
| DEX Aggregator | Cross-chain funding + multi-token payroll |
| Security Scanner | Recipient address verification |
| Wallet Portfolio | Balance queries |
| Onchain Gateway | Transaction broadcasting |
| Audit Log | Decision recording |
| DEX Market | Token price lookups |

## Smart Contracts

| Contract | Chain | Purpose |
|----------|-------|---------|
| TrusteePayroll | X Layer (196) | Payroll batch audit log |
| TrusteeVault | X Layer (196) | Trust fund management |

## License

MIT
