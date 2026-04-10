"use client";

import { motion } from "framer-motion";
import { Users, Zap, Globe, CalendarCheck } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Batch Distribution",
    desc: "Pay multiple recipients in a single command. One batch, one audit log.",
  },
  {
    icon: Zap,
    title: "Multi-Token Support",
    desc: "Send USDC, USDT, ETH, or any ERC-20. Auto-swap when needed.",
  },
  {
    icon: Globe,
    title: "Cross-Chain Payroll",
    desc: "Fund from any chain, distribute on any chain via OKX DEX Aggregator.",
  },
  {
    icon: CalendarCheck,
    title: "Scheduled Payments",
    desc: "Set it and forget it. Auto-pay on the 1st, 15th, or any day you choose.",
  },
];

const flowSteps = [
  { label: "Input", desc: "Employee list + amounts", color: "#10b981" },
  { label: "Validate", desc: "4-layer risk check", color: "#06b6d4" },
  { label: "Execute", desc: "Batch TEE signing", color: "#3b82f6" },
  { label: "Audit", desc: "X Layer on-chain log", color: "#8b5cf6" },
];

export function PayrollSection() {
  return (
    <section id="payroll" className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-[#10b981] tracking-wider uppercase">
            Payroll Engine
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">
            Batch Salary Distribution
          </h2>
          <p className="text-[#94a3b8] text-lg max-w-2xl mx-auto">
            Tell the AI who to pay and how much. It handles security scanning,
            batch execution, and on-chain audit — all in one command.
          </p>
        </motion.div>

        {/* Flow Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-0 mb-16"
        >
          {flowSteps.map((step, i) => (
            <div key={step.label} className="flex items-center">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.15, type: "spring" }}
                className="glass-card rounded-xl px-6 py-4 text-center min-w-[140px]"
              >
                <div
                  className="text-sm font-bold mb-1"
                  style={{ color: step.color }}
                >
                  {step.label}
                </div>
                <div className="text-xs text-[#94a3b8]">{step.desc}</div>
              </motion.div>
              {i < flowSteps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.15 }}
                  className="hidden md:block w-12 h-[2px] bg-gradient-to-r from-white/20 to-white/5"
                />
              )}
            </div>
          ))}
        </motion.div>

        {/* Demo Command */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-xl p-6 mb-16 max-w-3xl mx-auto"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="text-xs text-[#94a3b8] ml-2">Claude Code</span>
          </div>
          <pre className="text-sm font-mono text-[#e2e8f0] overflow-x-auto">
            <span className="text-[#94a3b8]">&gt; </span>
            <span className="text-[#10b981]">Pay this month&apos;s salaries:</span>
            {"\n"}
            <span className="text-[#94a3b8]">  </span>Alice 0x7a3B...4f2e → 2,000 USDC{"\n"}
            <span className="text-[#94a3b8]">  </span>Bob   0x9c1D...8a3b → 1,500 USDC{"\n"}
            <span className="text-[#94a3b8]">  </span>Carol 0x2e5F...1c7d → 1,000 USDC{"\n"}
            {"\n"}
            <span className="text-[#06b6d4]">{"✓"} Risk check passed (4/4 layers)</span>{"\n"}
            <span className="text-[#10b981]">{"✓"} 3/3 payments sent</span>{"\n"}
            <span className="text-[#8b5cf6]">{"✓"} Batch logged on X Layer: 0xabc...def</span>
          </pre>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className="glass-card rounded-xl p-6 hover:border-[#10b981]/20 transition-all group"
            >
              <f.icon className="w-8 h-8 text-[#10b981] mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-[#94a3b8] text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
