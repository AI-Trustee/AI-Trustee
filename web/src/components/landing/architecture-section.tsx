"use client";

import { motion } from "framer-motion";
import { Wallet, Settings, Send, KeyRound, Database } from "lucide-react";

const nodes = [
  { icon: Wallet, label: "Fund Wallet", desc: "Cross-chain deposit", color: "#10b981" },
  { icon: Settings, label: "Configure", desc: "Set rules & lists", color: "#06b6d4" },
  { icon: Send, label: "Execute", desc: "Payroll / Trust", color: "#3b82f6" },
  { icon: KeyRound, label: "TEE Sign", desc: "Agentic Wallet", color: "#f59e0b" },
  { icon: Database, label: "Audit Log", desc: "X Layer contract", color: "#8b5cf6" },
];

const products = [
  "Agentic Wallet",
  "X Layer",
  "DEX Swap",
  "Security Scanner",
  "Wallet Portfolio",
  "Onchain Gateway",
  "Audit Log",
  "DEX Market",
];

export function ArchitectureSection() {
  return (
    <section id="architecture" className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-[#3b82f6] tracking-wider uppercase">
            Architecture
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">
            How It Works
          </h2>
          <p className="text-[#94a3b8] text-lg max-w-2xl mx-auto">
            Five-stage pipeline from funding to on-chain audit.
            Every step powered by OKX Onchain OS products.
          </p>
        </motion.div>

        {/* Pipeline */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-16">
          {nodes.map((node, i) => (
            <div key={node.label} className="flex items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 * i, type: "spring" }}
                className="glass-card rounded-xl px-5 py-5 text-center min-w-[130px] group hover:border-white/10 transition-all"
              >
                <node.icon
                  className="w-8 h-8 mx-auto mb-2 transition-transform group-hover:scale-110"
                  style={{ color: node.color }}
                />
                <div className="text-sm font-semibold text-[#e2e8f0]">{node.label}</div>
                <div className="text-xs text-[#94a3b8] mt-1">{node.desc}</div>
              </motion.div>

              {i < nodes.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="hidden md:flex items-center"
                >
                  <div className="w-8 h-[2px] bg-gradient-to-r from-white/15 to-white/5" />
                  <div className="w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-white/15" />
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* OKX Product Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="text-sm text-[#94a3b8] mb-4">Powered by 8+ OKX Onchain OS Products</div>
          <div className="flex flex-wrap justify-center gap-3">
            {products.map((p, i) => (
              <motion.span
                key={p}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + i * 0.05 }}
                className="px-3 py-1.5 rounded-full glass text-xs text-[#e2e8f0] hover:bg-white/10 transition-colors cursor-default"
              >
                {p}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
