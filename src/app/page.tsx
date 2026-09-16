"use client";

import { useChatContext } from "@/context/ChatContext";
import { ChatMode } from "@/components/ChatMode";
import { WorkMode } from "@/components/WorkMode";
import { Menu } from "lucide-react";

export default function App() {
  const { activeMode, setActiveMode, setIsMobileSidebarOpen } = useChatContext();

  return (
    <div className="flex flex-col h-full bg-[#212121] relative">
      {/* Top Bar / Mode Switcher (Matching Image 3) */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#212121]/80 backdrop-blur-md sticky top-0 z-40">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="md:hidden p-2 text-gray-400 hover:text-gray-200"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1 flex justify-center">
          <div className="bg-[#171717] p-1 rounded-xl flex items-center gap-1 border border-white/5">
            <button
              onClick={() => setActiveMode("chat")}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeMode === "chat"
                  ? "bg-[#2f2f2f] text-white shadow-sm border border-white/10"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveMode("work")}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeMode === "work"
                  ? "bg-[#2f2f2f] text-white shadow-sm border border-white/10"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Work
            </button>
          </div>
        </div>

        <div className="w-9 md:hidden" />
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {activeMode === "chat" ? <ChatMode /> : <WorkMode />}
      </div>
    </div>
  );
}
