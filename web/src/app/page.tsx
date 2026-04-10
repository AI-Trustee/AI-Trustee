import { HeroSection } from "@/components/landing/hero-section";
import { PayrollSection } from "@/components/landing/payroll-section";
import { TrustSection } from "@/components/landing/trust-section";
import { SecuritySection } from "@/components/landing/security-section";
import { ArchitectureSection } from "@/components/landing/architecture-section";
import { CTASection } from "@/components/landing/cta-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <PayrollSection />
      <TrustSection />
      <SecuritySection />
      <ArchitectureSection />
      <CTASection />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "AI-Trustee",
            description:
              "On-chain payroll distribution and programmable trust fund management platform, secured by TEE and powered by OKX Onchain OS.",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web3",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            featureList: [
              "Batch salary distribution",
              "Time-lock trust funds",
              "Periodic vesting schedules",
              "Milestone-based releases",
              "TEE-secured signing",
              "On-chain audit trail on X Layer",
              "4-layer risk control",
              "Cross-chain funding",
            ],
          }),
        }}
      />
    </>
  );
}
