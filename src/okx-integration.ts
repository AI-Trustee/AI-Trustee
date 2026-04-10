/**
 * OKX Onchain OS CLI wrapper.
 *
 * Wraps the `onchainos` CLI for use in the Trustee engine.
 * All signing happens inside TEE — private key never exposed.
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type {
  OkxCommandResult,
  WalletBalance,
  SecurityScanResult,
} from "./types.js";

const execFileAsync = promisify(execFile);

const ONCHAINOS_BIN = "onchainos";
const COMMAND_TIMEOUT_MS = 30_000;

/**
 * Execute an onchainos CLI command and parse JSON output.
 */
export async function execOnchainos(
  module: string,
  command: string,
  args: string[] = []
): Promise<OkxCommandResult> {
  try {
    const { stdout, stderr } = await execFileAsync(
      ONCHAINOS_BIN,
      [module, command, ...args],
      { timeout: COMMAND_TIMEOUT_MS }
    );

    const trimmed = stdout.trim();
    if (!trimmed) {
      return { ok: true, data: {}, raw: stderr };
    }

    try {
      const parsed = JSON.parse(trimmed);
      return { ok: parsed.ok !== false, data: parsed.data ?? parsed, raw: trimmed };
    } catch {
      return { ok: true, raw: trimmed };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: message };
  }
}

/**
 * Get wallet balance on a specific chain.
 */
export async function getWalletBalance(
  chainId: number
): Promise<WalletBalance | null> {
  const result = await execOnchainos("wallet", "balance", [
    "--chain",
    String(chainId),
  ]);
  if (!result.ok || !result.data) return null;

  return {
    chain: chainId,
    token: String(result.data.symbol ?? "UNKNOWN"),
    balance: String(result.data.balance ?? "0"),
    balanceUsd: String(result.data.balanceUsd ?? "0"),
  };
}

/**
 * Send tokens to a recipient address.
 */
export async function sendTokens(
  chainId: number,
  to: string,
  tokenContract: string,
  amount: string
): Promise<OkxCommandResult> {
  const args = [
    "--chain", String(chainId),
    "--to", to,
    "--token", tokenContract,
    "--amount", amount,
    "--force",
  ];
  return execOnchainos("wallet", "send", args);
}

/**
 * Execute a contract call on-chain.
 */
export async function contractCall(
  chainId: number,
  contractAddress: string,
  inputData: string
): Promise<OkxCommandResult> {
  const args = [
    "--chain", String(chainId),
    "--to", contractAddress,
    "--input-data", inputData,
    "--force",
  ];
  return execOnchainos("wallet", "contract-call", args);
}

/**
 * Security scan an address.
 */
export async function securityScan(
  address: string,
  chainId: number
): Promise<SecurityScanResult> {
  const result = await execOnchainos("security", "token-scan", [
    "--address", address,
    "--chain", String(chainId),
  ]);

  if (!result.ok) {
    return {
      address,
      safe: false,
      riskLevel: "critical",
      warnings: [result.error ?? "Security scan failed"],
    };
  }

  return {
    address,
    safe: true,
    riskLevel: "low",
    warnings: [],
  };
}

/**
 * Get a DEX swap quote.
 */
export async function getSwapQuote(
  sourceChain: number,
  fromToken: string,
  toToken: string,
  amount: string,
  targetChain?: number
): Promise<OkxCommandResult> {
  const args = [
    "--chain", String(sourceChain),
    "--from-token", fromToken,
    "--to-token", toToken,
    "--amount", amount,
    "--slippage", "1",
  ];
  if (targetChain) {
    args.push("--to-chain", String(targetChain));
  }
  return execOnchainos("swap", "quote", args);
}

/**
 * Execute a DEX swap.
 */
export async function executeSwap(
  sourceChain: number,
  fromToken: string,
  toToken: string,
  amount: string,
  targetChain?: number
): Promise<OkxCommandResult> {
  const args = [
    "--chain", String(sourceChain),
    "--from-token", fromToken,
    "--to-token", toToken,
    "--amount", amount,
    "--slippage", "1",
    "--force",
  ];
  if (targetChain) {
    args.push("--to-chain", String(targetChain));
  }
  return execOnchainos("swap", "execute", args);
}

/**
 * Check wallet login status.
 */
export async function getWalletStatus(): Promise<OkxCommandResult> {
  return execOnchainos("wallet", "status", []);
}

/**
 * Sign an EIP-712 typed data message via TEE.
 */
export async function signTypedData(
  chainId: number,
  from: string,
  message: string
): Promise<OkxCommandResult> {
  return execOnchainos("wallet", "sign-message", [
    "--chain", String(chainId),
    "--from", from,
    "--type", "eip712",
    "--message", message,
    "--force",
  ]);
}
