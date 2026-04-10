"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Layers, FileCheck, Ban } from "lucide-react";
import Image from "next/image";

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
    desc: "Balance check, address security scan, single-tx limit, daily payroll cap. First failure stops execution.",
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
    title: "Auto-Block Risky Addresses",
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

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left: Feature cards */}
          <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="glass-card rounded-xl p-5 hover:border-white/10 transition-all group relative overflow-hidden"
              >
                {/* Circuit corner */}
                <div className="absolute top-0 left-0 w-12 h-12">
                  <div className="absolute top-0 left-0 w-full h-[1px] opacity-20" style={{ background: `linear-gradient(to right, ${f.color}, transparent)` }} />
                  <div className="absolute top-0 left-0 h-full w-[1px] opacity-20" style={{ background: `linear-gradient(to bottom, ${f.color}, transparent)` }} />
                  <div className="absolute top-[-2px] left-[-2px] w-2 h-2 rounded-full opacity-40" style={{ background: f.color }} />
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className="p-2.5 rounded-lg transition-all group-hover:scale-110 shrink-0"
                    style={{ background: `${f.color}12` }}
                  >
                    <f.icon className="w-5 h-5" style={{ color: f.color }} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold mb-1.5">{f.title}</h3>
                    <p className="text-[#94a3b8] text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: Logo as shield visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: "spring" }}
            className="flex items-center justify-center"
          >
            <div className="relative">
              {/* Outer circuit ring */}
              <div className="w-48 h-48 rounded-full border border-[#10b981]/15 flex items-center justify-center" style={{ animation: "pulse-glow 5s ease-in-out infinite" }}>
                {/* Middle ring */}
                <div className="w-36 h-36 rounded-full border border-[#06b6d4]/20 flex items-center justify-center">
                  {/* Logo */}
                  <Image
                    src="/logo.jpeg"
                    alt="AI-Trustee Security"
                    width={96}
                    height={96}
                    className="rounded-xl"
                  />
                </div>
              </div>

              {/* Circuit node dots on rings */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2.5 h-2.5 rounded-full bg-[#10b981]/40" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-2.5 h-2.5 rounded-full bg-[#10b981]/40" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2.5 h-2.5 rounded-full bg-[#06b6d4]/40" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2.5 h-2.5 rounded-full bg-[#06b6d4]/40" />

              {/* Glow */}
              <div className="absolute inset-0 rounded-full bg-[#10b981]/5 blur-2xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
