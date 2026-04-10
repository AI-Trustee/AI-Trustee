"use client";

import { motion } from "framer-motion";
import { Lock, Clock, Target, Eye } from "lucide-react";

const releaseTypes = [
  {
    icon: Lock,
    title: "Time Lock",
    desc: "Lock funds for a fixed duration, then release everything at once.",
    example: "Lock 5,000 USDC for 90 days",
    color: "#f59e0b",
  },
  {
    icon: Clock,
    title: "Periodic Release",
    desc: "Equal installments at regular intervals — monthly, quarterly, or annual.",
    example: "12,000 USDC → 1,000/month for 12 months",
    color: "#06b6d4",
  },
  {
    icon: Target,
    title: "Milestone Release",
    desc: "Funds released when admin confirms a project milestone is achieved.",
    example: "Release 2,500 USDC on each deliverable",
    color: "#10b981",
  },
];

const timelineSteps = [
  { month: "Jan", amount: 2500, total: 2500, pct: 25 },
  { month: "Apr", amount: 2500, total: 5000, pct: 50 },
  { month: "Jul", amount: 2500, total: 7500, pct: 75 },
  { month: "Oct", amount: 2500, total: 10000, pct: 100 },
];

export function TrustSection() {
  return (
    <section id="trust" className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-[#06b6d4] tracking-wider uppercase">
            Trust Engine
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">
            Programmable Trust Funds
          </h2>
          <p className="text-[#94a3b8] text-lg max-w-2xl mx-auto">
            Lock funds on-chain with programmable release conditions.
            Three release mechanisms for any vesting or escrow scenario.
          </p>
        </motion.div>

        {/* Release Types */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {releaseTypes.map((type, i) => (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className="glass-card rounded-xl p-6 hover:border-white/10 transition-all group"
            >
              <type.icon
                className="w-10 h-10 mb-4 transition-transform group-hover:scale-110"
                style={{ color: type.color }}
              />
              <h3 className="text-xl font-semibold mb-2">{type.title}</h3>
              <p className="text-[#94a3b8] text-sm mb-4">{type.desc}</p>
              <div
                className="text-xs font-mono px-3 py-1.5 rounded-lg inline-block"
                style={{ background: `${type.color}15`, color: type.color }}
              >
                {type.example}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Timeline Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-xl p-8 max-w-3xl mx-auto"
        >
          <div className="flex items-center gap-2 mb-6">
            <Eye className="w-5 h-5 text-[#06b6d4]" />
            <h4 className="font-semibold">Example: Quarterly Vesting — 10,000 USDC over 1 Year</h4>
          </div>

          {/* Progress bar */}
          <div className="relative mb-8">
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 2, delay: 0.5 }}
                className="h-full rounded-full bg-gradient-to-r from-[#06b6d4] to-[#10b981]"
              />
            </div>

            {/* Markers */}
            <div className="flex justify-between mt-4">
              {timelineSteps.map((step, i) => (
                <motion.div
                  key={step.month}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 + i * 0.2 }}
                  className="text-center"
                >
                  <div className="w-3 h-3 rounded-full bg-[#06b6d4] mx-auto mb-2 ring-4 ring-[#06b6d4]/20" />
                  <div className="text-xs font-semibold text-[#e2e8f0]">{step.month}</div>
                  <div className="text-xs text-[#10b981]">+{step.amount.toLocaleString()}</div>
                  <div className="text-xs text-[#94a3b8]">{step.total.toLocaleString()} total</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Trust details */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="glass rounded-lg p-3">
              <div className="text-lg font-bold text-[#06b6d4]">10,000</div>
              <div className="text-xs text-[#94a3b8]">USDC Locked</div>
            </div>
            <div className="glass rounded-lg p-3">
              <div className="text-lg font-bold text-[#10b981]">4</div>
              <div className="text-xs text-[#94a3b8]">Release Periods</div>
            </div>
            <div className="glass rounded-lg p-3">
              <div className="text-lg font-bold text-[#f59e0b]">100%</div>
              <div className="text-xs text-[#94a3b8]">On-Chain Auditable</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
