// ============================================================
// AnchorAI — Root Layout
// Premium dark theme, SEO metadata, font configuration
// ============================================================

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AnchorAI — When Words Fail, AnchorAI Speaks for You",
  description:
    "A voice-first, AI-powered recovery and prevention platform that delivers zero-typing crisis interventions, personalized emergency scripts, and caregiver alerts — powered by Google Gemini.",
  keywords: [
    "recovery",
    "substance use",
    "AI",
    "crisis intervention",
    "mental health",
    "caregiver",
    "voice-first",
    "Gemini",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0a0a1a] text-[#f1f5f9]">
        {children}
      </body>
    </html>
  );
}
