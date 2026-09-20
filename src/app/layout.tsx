import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { ChatProvider } from "@/context/ChatContext";

export const viewport: Viewport = {
  themeColor: "#171717",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Agens - Autonomous Trading & Market Intelligence",
  description: "Agens: Asisten AI otonom untuk analisis teknikal, tren pasar kripto, dan riset saham profesional.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Agens",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body 
        className="flex h-screen overflow-hidden bg-[#171717] text-gray-100 font-sans antialiased"
        suppressHydrationWarning
      >
        <ChatProvider>
          <Sidebar />
          <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#212121] md:rounded-l-[2rem] border-l border-white/5 relative z-10 md:shadow-2xl">
            {children}
          </main>
        </ChatProvider>
      </body>
    </html>
  );
}
