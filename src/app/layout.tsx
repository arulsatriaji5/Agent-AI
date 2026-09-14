import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

export const viewport: Viewport = {
  themeColor: "#171717",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "BTC Research Dashboard",
  description: "AI-Powered Bitcoin Market Intelligence",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BTC Research",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="flex h-screen overflow-hidden bg-[#171717] text-gray-100 font-sans">
        <Sidebar />
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#212121] md:rounded-l-[2rem] border-l border-white/5 relative z-10 md:shadow-2xl">
          {children}
        </main>
      </body>
    </html>
  );
}
