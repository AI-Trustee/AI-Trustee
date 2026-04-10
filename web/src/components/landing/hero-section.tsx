"use client";

import { motion } from "framer-motion";
import { Shield, Users, Clock, Lock } from "lucide-react";
import Image from "next/image";

const stats = [
  { icon: Users, label: "Batch Payroll", value: "Multi-recipient", color: "#10b981" },
  { icon: Clock, label: "Smart Trusts", value: "3 Release Types", color: "#06b6d4" },
  { icon: Shield, label: "TEE Secured", value: "Zero Key Exposure", color: "#f59e0b" },
  { icon: Lock, label: "Risk Control", value: "4 Safety Layers", color: "#8b5cf6" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        poster="/logo.jpeg"
      >
        <source src="/trustee.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay to ensure text readability */}
      <div className="absolute inset-0 bg-[#0a0e1a]/60 z-[1]" />
      {/* Bottom fade to next section */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0e1a] z-[1]" />
      {/* Center vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(10,14,26,0.5)_100%)] z-[1]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <Image
              src="/logo.jpeg"
              alt="AI-Trustee"
              width={88}
              height={88}
              className="rounded-2xl"
              priority
            />
            {/* Circuit glow ring */}
            <div className="absolute -inset-2 rounded-2xl border border-[#10b981]/30" style={{ animation: "pulse-glow 4s ease-in-out infinite" }} />
            <div className="absolute -inset-4 rounded-3xl border border-[#10b981]/15" />
          </div>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
          <span className="text-sm text-[#94a3b8]">Powered by OKX Onchain OS</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          <span className="text-gradient">AI-Trustee</span>
          <br />
          <span className="text-[#e2e8f0] text-3xl md:text-5xl font-medium">
            On-Chain Payroll & Trust Fund
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg md:text-xl text-[#c8cdd8] max-w-2xl mx-auto mb-12"
        >
          Batch salary distribution and programmable trust funds with time-lock,
          periodic, and milestone-based releases. All signed in TEE, all audited on X Layer.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <a
            href="#architecture"
            className="group relative px-8 py-3 rounded-lg bg-[#10b981] text-[#0a0e1a] font-semibold hover:bg-[#059669] transition-colors overflow-hidden"
          >
            <span className="relative z-10">Explore Architecture</span>
          </a>
          <a
            href="#payroll"
            className="px-8 py-3 rounded-lg glass hover:bg-white/10 transition-colors font-medium border border-[#10b981]/20 hover:border-[#10b981]/40"
          >
            View Features
          </a>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.0 + i * 0.1 }}
              className="glass-card rounded-xl p-4 transition-all group hover:border-[#10b981]/15 relative overflow-hidden"
            >
              {/* Circuit corner accent */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r opacity-20 rounded-tr-xl" style={{ borderColor: stat.color }} />
              <div className="absolute top-[7px] right-[7px] w-1.5 h-1.5 rounded-full opacity-30" style={{ background: stat.color }} />

              <stat.icon
                className="w-6 h-6 mx-auto mb-2 transition-transform group-hover:scale-110"
                style={{ color: stat.color }}
              />
              <div className="text-sm font-semibold text-white">{stat.value}</div>
              <div className="text-xs text-[#94a3b8]">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ animation: "float 3s ease-in-out infinite" }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-[#10b981]/30 flex justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-[#10b981] animate-bounce" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
