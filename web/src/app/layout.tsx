import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_NAME = "AI-Trustee";
const SITE_DESC =
  "On-chain payroll distribution and programmable trust fund management. Batch salary payments, time-locked vesting, and milestone-based releases — all secured by TEE. Powered by OKX Onchain OS.";

export const viewport: Viewport = {
  themeColor: "#0a0e1a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — On-Chain Payroll & Trust Fund`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESC,
  applicationName: SITE_NAME,
  keywords: [
    "payroll",
    "trust fund",
    "salary distribution",
    "vesting",
    "on-chain",
    "OKX",
    "Web3",
    "DeFi",
    "TEE",
    "smart contract",
    "USDC",
    "batch payment",
  ],
  authors: [{ name: "AI-Trustee Team" }],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — On-Chain Payroll & Trust Fund`,
    description: SITE_DESC,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — On-Chain Payroll & Trust Fund`,
    description: SITE_DESC,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
