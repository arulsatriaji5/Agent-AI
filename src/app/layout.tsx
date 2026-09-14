import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BTC Research Dashboard — AI-Powered Market Intelligence",
  description:
    "Automated Bitcoin market research powered by Gemini AI. Real-time price tracking, sentiment analysis, and AI-generated market visualizations.",
  keywords: ["Bitcoin", "BTC", "crypto", "market analysis", "AI", "Gemini", "sentiment"],
  openGraph: {
    title: "BTC Research Dashboard",
    description: "AI-Powered Bitcoin Market Intelligence",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
