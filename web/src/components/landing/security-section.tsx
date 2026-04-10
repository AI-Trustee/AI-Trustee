"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Layers, FileCheck, Ban } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "TEE Signing",
    desc: "Private key never leaves the secure enclave. All transactions signed inside OKX's Trusted Execution Environment.",
    color: "#10b981",
  },
  {
    icon: Layers,
    title: "4-Layer Risk Control",
    desc: "Balance check → Address security scan → Single-tx limit → Daily payroll cap. First failure stops execution.",
    color: "#06b6d4",
  },
  {
    icon: FileCheck,
    title: "On-Chain Audit Trail",
    desc: "Every payroll batch and trust action logged on X Layer smart contracts. Zero gas, full transparency.",
    color: "#3b82f6",
  },
  {
    icon: Ban,
    title: "Auto-Block Unknown Addresses",
    desc: "OKX Security Scanner checks every recipient before payment. Flagged addresses are rejected automatically.",
    color: "#f59e0b",
  },
];

export function SecuritySection() {
  return (
    <section id="security" className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-[#f59e0b] tracking-wider uppercase">
            Security
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">
            Enterprise-Grade Protection
          </h2>
          <p className="text-[#94a3b8] text-lg max-w-2xl mx-auto">
            Hardware-level security with TEE signing, multi-layer risk controls,
            and full on-chain auditability. No human ever touches a private key.
          </p>
        </motion.div>

        {/* Security Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className="glass-card rounded-xl p-6 hover:border-white/10 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div
                  className="p-3 rounded-lg transition-all group-hover:scale-110"
                  style={{ background: `${f.color}15` }}
                >
                  <f.icon className="w-6 h-6" style={{ color: f.color }} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-[#94a3b8] text-sm">{f.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Shield Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, type: "spring" }}
          className="flex justify-center"
        >
          <div className="relative">
            {/* Outer ring */}
            <div
              className="w-32 h-32 rounded-full border-2 border-[#10b981]/20 flex items-center justify-center"
              style={{ animation: "pulse-glow 4s ease-in-out infinite" }}
            >
              {/* Middle ring */}
              <div className="w-24 h-24 rounded-full border-2 border-[#06b6d4]/30 flex items-center justify-center">
                {/* Inner ring */}
                <div className="w-16 h-16 rounded-full border-2 border-[#3b82f6]/40 flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-[#10b981]" />
                </div>
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-[#10b981]/5 blur-xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
