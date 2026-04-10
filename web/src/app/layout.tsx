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
  "The autonomous on-chain payroll and trust fund protocol. Batch salary distribution, programmable vesting with time-lock, periodic, and milestone-based releases — all secured by TEE signing and audited on X Layer. Powered by OKX Onchain OS.";
const SITE_URL = "https://ai-trustee.xyz";

export const viewport: Viewport = {
  themeColor: "#0a0e1a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  // -- Core --
  title: {
    default: `${SITE_NAME} — On-Chain Payroll & Trust Fund Protocol`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESC,
  applicationName: SITE_NAME,
  keywords: [
    "AI-Trustee",
    "on-chain payroll",
    "batch salary",
    "trust fund",
    "vesting schedule",
    "time-lock",
    "milestone release",
    "TEE signing",
    "OKX",
    "X Layer",
    "Onchain OS",
    "Agentic Wallet",
    "smart contract",
    "USDC payroll",
    "DAO treasury",
    "Web3 payroll",
    "DeFi",
    "crypto salary",
    "blockchain payroll",
    "programmable trust",
  ],
  authors: [{ name: "AI-Trustee Team", url: SITE_URL }],
  creator: SITE_NAME,

  // -- Icons --
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",

  // -- Open Graph --
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — On-Chain Payroll & Trust Fund Protocol`,
    description: SITE_DESC,
    url: SITE_URL,
    locale: "en_US",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "AI-Trustee — On-Chain Payroll & Trust Fund Protocol",
        type: "image/png",
      },
    ],
  },

  // -- Twitter / X --
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — On-Chain Payroll & Trust Fund Protocol`,
    description: SITE_DESC,
    images: ["/icon-512.png"],
  },

  // -- Robots --
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // -- Other --
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  category: "Finance",
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
