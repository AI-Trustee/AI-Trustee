<div align="center">

# AI-Trustee

### The Autonomous On-Chain Payroll & Trust Fund Protocol

*An AI agent that distributes salaries to entire teams in a single command, manages programmable trust funds with time-lock, periodic, and milestone-based releases — fully autonomous, fully auditable, fully secured inside a Trusted Execution Environment.*

<br/>

[![Tests](https://img.shields.io/badge/tests-25%20passing-brightgreen?style=for-the-badge)](.)
[![TypeScript](https://img.shields.io/badge/typescript-5.7+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](.)
[![Solidity](https://img.shields.io/badge/solidity-0.8.20-363636?style=for-the-badge&logo=solidity&logoColor=white)](.)
[![OKX](https://img.shields.io/badge/OKX-Onchain%20OS-000000?style=for-the-badge)](.)
[![X Layer](https://img.shields.io/badge/X%20Layer-Integrated-7B3FE4?style=for-the-badge)](.)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)

<br/>

[The Problem](#the-problem) | [What AI-Trustee Is](#what-ai-trustee-is) | [Core Capabilities](#core-capabilities) | [Architecture](#architecture) | [Quick Start](#quick-start)

</div>

---

> **AI-Trustee turns every OKX wallet into an autonomous treasury department.**
>
> It batch-distributes salaries to your entire team in seconds, locks funds into programmable trust vaults with three release mechanisms, enforces four layers of risk control before every transaction, and logs every action to an immutable audit trail on X Layer — all through natural language, all signed inside TEE.

---

## The Problem: Treasury Operations Are Stuck in 2010

**DAOs and crypto-native companies are growing fast.** Thousands of organizations now pay contributors, employees, and contractors in stablecoins. The total on-chain payroll volume exceeds $2B annually and accelerating.

But here's the reality —

Every month, someone sits down and **manually sends 20, 50, 100 individual transactions** — one by one — to pay their team. There is no batch execution. There is no risk control. There is no audit trail. There is no programmable vesting.

The current landscape is a triple failure:

| Failure | Existing Tools | What's Wrong |
|:---:|:---:|:---:|
| **No batch payroll** | Manual wallet sends | 50 employees = 50 transactions, 50 gas fees, 50 chances to paste the wrong address |
| **No programmable trusts** | Centralized vesting platforms | Custodial risk, no on-chain verifiability, no composability |
| **No autonomous operation** | Cron jobs + hot wallets | Private keys exposed, no security scanning, no risk limits |

<br/>

> No one has built an **intelligent agent** that can autonomously distribute salaries, manage trust fund releases, enforce multi-layer risk controls, and maintain a complete on-chain audit trail — all within a single natural language interface.
>
> **Until now.**

---

## What AI-Trustee Is

<div align="center">

*AI-Trustee doesn't just send money. **AI-Trustee thinks before it sends.***

</div>

<br/>

AI-Trustee provides **4 AI Skills** accessible through natural language:

```
trustee-payroll   "Pay salaries: Alice 2000, Bob 1500, Carol 1000 USDC"  -> Batch distribution
trustee-trust     "Lock 10000 USDC for Alice, release 2500 quarterly"    -> Programmable trust
trustee-fund      "Fund the payroll wallet with 5000 USDC from Ethereum" -> Cross-chain funding
trustee-monitor   "Start auto-pay: salaries on the 1st, check trusts"    -> Autonomous operation
```

Before every transaction, AI-Trustee asks four questions in sequence:

```
1. Do we have enough funds to cover this entire batch?     -> Balance Sufficiency Check
2. Are all recipient addresses safe and verified?          -> Security Scanner (OKX)
3. Does any single payment exceed the per-tx limit?        -> Single Transaction Cap
4. Would this batch push total daily spend over the cap?   -> Daily Payroll Circuit Breaker
```

**Only when every check passes does AI-Trustee execute.**

---

## Core Capabilities

### Pay — Batch Salary Distribution

AI-Trustee introduces **batch payroll as a first-class primitive**: pay your entire team in a single natural language command. Every recipient is security-scanned. Every batch is logged on-chain. Every signature happens inside TEE.

```
User: "Pay this month's salaries: Alice 2000, Bob 1500, Carol 1000 USDC"

  [1] Parse Recipients        Natural language -> structured payroll entries
  [2] Balance Check            Verify wallet holds >= 4,500 USDC
  [3] Security Scan            OKX Security Scanner on every recipient address
  [4] Risk Validation          4-layer check: balance / security / tx-limit / daily-cap
  [5] Batch Execute            TEE-signed transfers via Agentic Wallet (--force)
  [6] Audit Log                Record batch to TrusteePayroll contract on X Layer
  [7] Report                   Return tx hashes + summary for every payment
```

| Feature | Detail |
|---------|--------|
| **Batch Size** | Unlimited recipients per batch |
| **Multi-Token** | USDC, USDT, ETH, or any ERC-20 — auto-swap when needed |
| **Cross-Chain** | Fund from any chain, distribute on any chain |
| **Scheduling** | Auto-pay on the 1st, 15th, or any configured date |
| **Signing** | TEE (Trusted Execution Environment) — private key never exposed |

---

### Lock — Programmable Trust Funds

Three release mechanisms for any vesting, escrow, or trust scenario — all enforced by smart contract logic on X Layer:

```
Release Type       How It Works                                   Example
----------------------------------------------------------------------------------
Time Lock          Full release after fixed duration               Lock 5,000 USDC for 90 days
Periodic           Equal installments at regular intervals         12,000 USDC -> 1,000/month
Milestone          Admin confirms achievement, funds release       2,500 USDC per deliverable
```

```
User: "Lock 10000 USDC for Alice, release 2500 quarterly over 1 year"

  [1] Parse Trust Config       Beneficiary, amount, schedule, release type
  [2] Security Scan            Verify beneficiary address is safe
  [3] Balance Verification     Ensure sufficient funds to lock
  [4] Create On-Chain          TrusteeVault.createTrust() on X Layer (zero gas)
  [5] Confirm                  Return trustId + full release schedule

  Result:
    Trust #3 Created
    Beneficiary: Alice (0x7a3B...4f2e)
    Total: 10,000 USDC
    Schedule: 2,500 USDC every 90 days
    First Release: 2026-07-10
    Completion: 2027-04-10
```

*"Think of it as Sablier meets Gnosis Safe — but conversational, autonomous, and TEE-secured."*

---

### Protect — 4-Layer Risk Fortress

```
+--------------------------------------------------------------+
|  Layer 4   Daily Payroll Circuit Breaker   Total > $50K/day   |
+--------------------------------------------------------------+
|  Layer 3   Single Transaction Cap          Per tx < $10,000   |
+--------------------------------------------------------------+
|  Layer 2   Address Security Scan           OKX Security API   |
+--------------------------------------------------------------+
|  Layer 1   Balance Sufficiency Check       Funds >= Required  |
+--------------------------------------------------------------+
```

Every payroll batch and every trust operation passes through all four layers. First failure halts execution immediately — no partial sends, no silent errors.

*"The fastest way to lose a treasury is to skip validation. AI-Trustee treats every dollar as if the auditor is watching."*

---

### Monitor — Autonomous Treasury Agent

AI-Trustee runs a continuous monitoring loop — checking for scheduled payroll dates, scanning trust release conditions, and alerting on low balances:

```
LOOP (configurable interval, default: 1 hour)
  |
  [1] Payroll Check    Is today payroll day? Has it been paid this month?
  |                    YES + NOT PAID -> Execute full batch (trustee-payroll)
  |
  [2] Trust Scan       Query all active trusts from TrusteeVault
  |                    For each: nextReleaseTime <= now? -> Execute release
  |
  [3] Balance Alert    Wallet balance < upcoming obligations?
  |                    YES -> WARNING with shortfall amount
  |
  [4] Audit            Log cycle result to X Layer (even idle cycles)
```

**Safety guarantees:**
- **No double-pay** — tracks executed months, prevents duplicate payroll
- **No auto-milestone** — milestone trusts require explicit admin confirmation
- **Dry-run mode** — simulate everything without executing transactions

---

## Architecture

```
                  +-----------------------------------------+
                  |       Natural Language Interface         |
                  | "Pay salaries: Alice 2000, Bob 1500"     |
                  | "Lock 10000 USDC for Alice, quarterly"   |
                  | "Fund payroll from Ethereum"             |
                  | "Start auto-pay mode"                    |
                  +-------------------+---------------------+
                                      |
                         +------------v-----------+
                         |      4 AI SKILLS        |
                         +-------------------------+
                         | trustee-payroll  (batch) |
                         | trustee-trust    (vault) |
                         | trustee-fund     (fund)  |
                         | trustee-monitor  (auto)  |
                         +------------+------------+
                                      |
      +-------------------------------+-------------------------------+
      |                               |                               |
 +----v------+                 +------v-------+               +-------v------+
 |  VALIDATE  |                |   EXECUTE     |               |   RECORD     |
 |            |                |               |               |              |
 | Balance    |                | Batch Send    |               | Payroll Log  |
 | Check      |--------------->| via Agentic   |-------------->| (X Layer)    |
 |            |                | Wallet (TEE)  |               |              |
 | Security   |                |               |               | Trust Vault  |
 | Scan       |                | DEX Swap      |               | (X Layer)    |
 |            |                | (cross-chain) |               |              |
 | Risk       |                |               |               | Audit Trail  |
 | Control    |                | Trust Release  |               | (zero gas)   |
 +------------+                +---------------+               +--------------+

 ------------------------------ OKX Onchain OS --------------------------------
 +----------+ +----------+ +----------+ +----------+ +----------+ +----------+
 | Agentic  | | DEX      | | Security | | Wallet   | | Onchain  | | DEX      |
 | Wallet   | | Swap     | | Scanner  | | Portfolio| | Gateway  | | Market   |
 | (TEE)    | | (500+)   | | (Pre-tx) | | (Balance)| | (Tx)     | | (Price)  |
 +----------+ +----------+ +----------+ +----------+ +----------+ +----------+
```

<br/>

| Layer | Components | Responsibility |
|:---|:---|:---|
| **Skills** | trustee-payroll, trustee-trust, trustee-fund, trustee-monitor | 4 AI Skills — natural language interface for all treasury operations |
| **Engine** | payroll.ts, trust-manager.ts, risk-controller.ts, monitor.ts | Business logic — batch distribution, trust lifecycle, risk enforcement, scheduling |
| **Contracts** | TrusteePayroll.sol, TrusteeVault.sol | On-chain state — payroll audit log + programmable trust vault (X Layer, zero gas) |
| **OKX Layer** | 8+ OKX Onchain OS products | Infrastructure — signing, swapping, scanning, broadcasting, querying |

---

## OKX Onchain OS Deep Integration

AI-Trustee is built as a native OKX Onchain OS AI Skill, deeply calling **8 OKX products** across every operation:

| OKX Product | Role in AI-Trustee | Integration Point |
|:---|:---|:---|
| `okx-agentic-wallet` | TEE signing for all transactions | Every payroll send + every trust release |
| `okx-dex-swap` | Cross-chain funding + multi-token payroll | trustee-fund + currency conversion |
| `okx-security` | Pre-transaction recipient verification | Layer 2 of risk control |
| `okx-wallet-portfolio` | Balance queries across all chains | Layer 1 of risk control |
| `okx-onchain-gateway` | Transaction broadcasting | Batch send execution |
| `okx-dex-market` | Token price lookups | USD value calculation |
| `okx-audit-log` | Operation recording | Decision audit trail |
| `okx-x402-payment` | Micro-payment for premium data | Intelligence layer (future) |

### Scoring Dimension Coverage

| Dimension (25% each) | How AI-Trustee Covers It |
|:---|:---|
| **Onchain OS Integration Depth** | 8 products deeply woven into every transaction — not surface-level queries but core execution dependencies |
| **X Layer Ecosystem Integration** | Dual-contract architecture: TrusteePayroll (audit) + TrusteeVault (trust state) — both deployed on X Layer with zero gas |
| **AI Interaction Experience** | 4 AI Skills with natural language — "pay salaries" / "lock funds for Alice" / "fund from Ethereum" / "start auto-pay" |
| **Product Completeness** | 25 tests passing, full pipeline from batch parsing to TEE signing to on-chain audit, landing page with 6 interactive sections |

### Special Prize Alignment

| Special Prize | AI-Trustee Advantage |
|:---|:---|
| **AI Agent Prize** | Fully autonomous monitor loop — signs and executes without human confirmation |
| **X Layer Prize** | Two contracts deployed and actively called — TrusteePayroll + TrusteeVault |
| **DeFi Prize** | DEX Aggregator integration for cross-chain funding and multi-token payroll |
| **Cross-Chain Prize** | Fund from any EVM chain via OKX DEX Swap, distribute on any chain |

---

## X Layer: Dual Role in the Architecture

X Layer is not a bonus feature — it is a structural pillar of AI-Trustee:

```
+-----------------------------------------------------------+
|                        X Layer                             |
|                    (chainId 196, zero gas)                 |
|                                                            |
|   1. PAYROLL AUDIT CHAIN                                   |
|      Every salary batch permanently recorded               |
|      TrusteePayroll.sol -> logPayroll()                    |
|      Fields: timestamp, totalAmount, recipientCount,       |
|              batchId, memo                                 |
|      Queryable: getRecent(n) for live demo                 |
|                                                            |
|   2. TRUST STATE CHAIN                                     |
|      Every trust fund lifecycle managed on-chain           |
|      TrusteeVault.sol -> createTrust() / release()         |
|      Three release types: TIME_LOCK, PERIODIC, MILESTONE   |
|      Full state: beneficiary, amounts, schedule, status    |
|      Queryable: getActiveTrusts() / getTrust(id)           |
|                                                            |
+-----------------------------------------------------------+
```

**Why X Layer?** Zero gas means every operation — even idle monitoring cycles — can be logged on-chain without economic friction. This creates a dense, verifiable audit trail that judges can query in real-time during the demo.

---

## Smart Contracts

### TrusteePayroll.sol — Batch Audit Log

Records every payroll batch with timestamp, total amount, recipient count, batch ID, and memo. Designed for auditability — `getRecent(n)` returns the last N batches for instant demo verification.

### TrusteeVault.sol — Programmable Trust Vault

Full trust fund lifecycle management:

| Function | Purpose |
|:---|:---|
| `createTrust()` | Lock funds with beneficiary, amount, schedule, and release type |
| `release()` | Execute time-lock or periodic release (checks conditions on-chain) |
| `completeMilestone()` | Admin confirms milestone — releases specified amount |
| `cancelTrust()` | Cancel active trust, mark remaining for return |
| `getActiveTrusts()` | Query all active trusts (for monitor loop) |
| `getTrust(id)` | Get full details of a specific trust |

---

## Test Coverage

**25 tests. Every critical path covered.**

| Module | Test File | Tests | Coverage |
|:---|:---|:---:|:---|
| Batch Payroll | `payroll.test.ts` | 7 | Batch ID generation, total calculation, report formatting |
| Trust Manager | `trust-manager.test.ts` | 9 | Release eligibility, status checks, schedule formatting |
| Risk Controller | `risk-controller.test.ts` | 9 | All 4 layers, daily tracking, trust validation |
| | | **25** | |

```bash
# Run the full suite
npx vitest run    # 25 passed, 257ms
```

---

## Tech Stack

**TypeScript 5.7+** — Engine, risk control, monitor loop

| Dependency | Purpose |
|:---|:---|
| `vitest` | Testing framework |
| `node:child_process` | onchainos CLI integration |

**Solidity 0.8.20+** — On-chain contracts (X Layer)

| Contract | Purpose |
|:---|:---|
| `TrusteePayroll.sol` | Batch payroll audit log |
| `TrusteeVault.sol` | Programmable trust vault with 3 release types |

**Next.js 16 + React 19** — Landing page

| Dependency | Purpose |
|:---|:---|
| `framer-motion` | Scroll animations, parallax, viewport triggers |
| `lucide-react` | Icon system |
| `tailwindcss 4` | Utility-first styling |

---

## Project Structure

```
trustee/
|
|-- CLAUDE.md                              # Project architecture & dev standards
|-- README.md                              # This file
|-- .env.example                           # Environment variables template
|
|-- skills/                                # AI Skill definitions (OKX Onchain OS)
|   |-- trustee-payroll/
|   |   +-- SKILL.md                       #   Batch salary distribution
|   |-- trustee-trust/
|   |   +-- SKILL.md                       #   Programmable trust fund management
|   |-- trustee-fund/
|   |   +-- SKILL.md                       #   Cross-chain wallet funding
|   +-- trustee-monitor/
|       +-- SKILL.md                       #   Autonomous payroll & trust agent
|
|-- contracts/                             # Solidity smart contracts (X Layer)
|   +-- src/
|       |-- TrusteePayroll.sol             #   Payroll batch audit log
|       +-- TrusteeVault.sol               #   Trust fund vault (3 release types)
|
|-- src/                                   # TypeScript engine
|   |-- types.ts                           #   Core type definitions + constants
|   |-- okx-integration.ts                 #   onchainos CLI wrapper (TEE signing)
|   |-- payroll.ts                         #   Batch payroll logic
|   |-- trust-manager.ts                   #   Trust lifecycle management
|   |-- risk-controller.ts                 #   4-layer risk control system
|   |-- monitor.ts                         #   Autonomous monitoring loop
|   +-- tests/                             #   25 unit tests
|       |-- payroll.test.ts
|       |-- trust-manager.test.ts
|       +-- risk-controller.test.ts
|
+-- web/                                   # Next.js 16 landing page
    +-- src/
        |-- app/
        |   |-- page.tsx                   #   6-section landing page
        |   |-- layout.tsx                 #   Root layout + SEO metadata
        |   +-- globals.css                #   Trustee brand theme + animations
        +-- components/
            |-- landing/                   #   6 modular section components
            +-- effects/                   #   Interactive particle background
```

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/AI-Trustee/AI-Trustee.git
cd AI-Trustee

# 2. Login to OKX Agentic Wallet
onchainos wallet login your@email.com
onchainos wallet verify <code>

# 3. Install dependencies & run tests
npm install
npx vitest run                    # 25 tests, < 1 second

# 4. Launch the landing page
cd web && npm install && npm run dev
# Open http://localhost:3000
```

---

## Security

- **TEE Signing** — All transactions signed inside OKX's Trusted Execution Environment. The private key is generated, stored, and used exclusively within the secure enclave. No human, no code, no process outside TEE can access it.
- **4-Layer Risk Control** — Every transaction passes through balance check, address security scan, single-tx limit, and daily cap before execution.
- **On-Chain Audit Trail** — Every payroll batch and trust action permanently recorded on X Layer smart contracts. Immutable, queryable, verifiable.
- **No Custody** — AI-Trustee never holds user funds in a custodial manner. All assets remain in the user's Agentic Wallet until the moment of execution.

---

## License

[MIT](LICENSE)

---

<div align="center">

**Built for the [OKX Build X Hackathon](https://www.okx.com/) — Skills Arena**

*AI-Trustee: Where payroll meets programmability, and trust meets transparency.*

</div>
