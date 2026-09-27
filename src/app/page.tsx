"use client";

import { useChatContext } from "@/context/ChatContext";
import { ChatMode } from "@/components/ChatMode";
import { WorkMode } from "@/components/WorkMode";
import { Menu } from "lucide-react";

export default function App() {
  const { activeMode, setActiveMode, setIsMobileSidebarOpen, activeSession } = useChatContext();
  
  const isConversationActive = activeSession && activeSession.messages && activeSession.messages.length > 0;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#131314] relative transition-colors duration-300">
      {/* Top Bar - Gemini Style */}
      <header className="flex items-center justify-between px-3 md:px-5 py-2.5 sticky top-0 z-40">
        {/* Left: Hamburger for mobile */}
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Center: Mode Switcher - Floating Pill */}
        <div className="flex-1 flex justify-center">
          <div className="bg-gray-100 dark:bg-[#1e1f20] p-1 rounded-full flex items-center gap-0.5 border border-gray-200/60 dark:border-white/10 shadow-sm">
            <button
              disabled={!!isConversationActive}
              onClick={() => setActiveMode("chat")}
              className={`px-5 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                activeMode === "chat"
                  ? "bg-white dark:bg-[#37393b] text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              } ${isConversationActive ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              Chat
            </button>
            <button
              disabled={!!isConversationActive}
              onClick={() => setActiveMode("work")}
              className={`px-5 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                activeMode === "work"
                  ? "bg-white dark:bg-[#37393b] text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              } ${isConversationActive ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              Agens
            </button>
          </div>
        </div>

        {/* Right: Spacer for mobile balance */}
        <div className="w-9 md:hidden" />
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {activeMode === "chat" ? <ChatMode /> : <WorkMode />}
      </div>
    </div>
  );
}
