"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative py-24 px-6">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.06)_0%,transparent_60%)]" />

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Start Managing Your{" "}
            <span className="text-gradient">On-Chain Payroll</span>
            {" "}Today
          </h2>
          <p className="text-[#94a3b8] text-lg mb-8 max-w-xl mx-auto">
            Tell the AI who to pay, set your trust conditions, and let the agent handle
            the rest — securely, autonomously, on-chain.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="https://github.com/ai-trustee"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-[#10b981] text-[#0a0e1a] font-semibold hover:bg-[#059669] transition-colors"
            >
              View on GitHub <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#payroll"
              className="px-8 py-3 rounded-lg glass hover:bg-white/10 transition-colors font-medium"
            >
              Explore Features
            </a>
          </div>

          {/* Hackathon attribution */}
          <div className="glass rounded-xl inline-flex items-center gap-3 px-6 py-3">
            <span className="text-sm text-[#94a3b8]">Built for</span>
            <span className="text-sm font-semibold text-[#e2e8f0]">
              OKX Build X Hackathon 2025
            </span>
            <span className="text-sm text-[#94a3b8]">|</span>
            <span className="text-sm text-[#94a3b8]">Skills Arena</span>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-white/5 text-center">
          <p className="text-xs text-[#64748b]">
            AI-Trustee is an open-source project. All signing happens inside TEE.
            No private keys are stored or transmitted.
          </p>
        </div>
      </div>
    </section>
  );
}
