"use client";

import { useState } from "react";
import { ChatMode } from "@/components/ChatMode";
import { WorkMode } from "@/components/WorkMode";
import { Menu } from "lucide-react";

export default function App() {
  const [mode, setMode] = useState<"chat" | "work">("chat");

  return (
    <div className="flex flex-col h-full bg-[#212121] relative">
      {/* Top Bar / Mode Switcher */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#212121]/80 backdrop-blur-md sticky top-0 z-50">
        <button className="md:hidden p-2 text-gray-400 hover:text-gray-200">
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1 flex justify-center">
          <div className="bg-[#171717] p-1 rounded-xl flex items-center gap-1 border border-white/5">
            <button
              onClick={() => setMode("chat")}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                mode === "chat" 
                  ? "bg-[#2f2f2f] text-white shadow-sm border border-white/10" 
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setMode("work")}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                mode === "work" 
                  ? "bg-[#2f2f2f] text-white shadow-sm border border-white/10" 
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Work
            </button>
          </div>
        </div>

        <div className="w-9 md:hidden"></div> {/* Spacer for centering */}
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {mode === "chat" ? <ChatMode /> : <WorkMode />}
      </div>
    </div>
  );
}
