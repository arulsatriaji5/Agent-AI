import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { ChatProvider } from "@/context/ChatContext";
import { ThemeProvider } from "@/components/ThemeProvider";

export const viewport: Viewport = {
  themeColor: "#131314",
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
    <html lang="id" suppressHydrationWarning>
      <body 
        className="flex h-screen overflow-hidden bg-white dark:bg-[#131314] text-gray-900 dark:text-gray-100 font-sans antialiased transition-colors duration-300"
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ChatProvider>
            <Sidebar />
            <main className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-[#131314] transition-colors duration-300">
              {children}
            </main>
          </ChatProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
