"use client";

import React, { useState } from "react";
import { 
  MessageSquarePlus, 
  CalendarClock, 
  Pin,
  PinOff,
  Trash2,
  Settings,
  X,
  Copy,
  Check,
  Menu,
  SquarePen
} from "lucide-react";
import Image from "next/image";
import { useChatContext } from "@/context/ChatContext";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Sidebar() {
  const {
    sessions,
    activeSessionId,
    activeMode,
    setActiveMode,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    createNewSession,
    selectSession,
    togglePinSession,
    deleteSession,
  } = useChatContext();

  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [copiedCron, setCopiedCron] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const pinnedSessions = sessions.filter((s) => s.isPinned);
  const recentSessions = sessions.filter((s) => !s.isPinned);

  // Define sidebarContent FIRST to avoid ReferenceError in MobileDrawer
  const sidebarContent = (
    <aside className="w-[260px] h-full flex-shrink-0 bg-gray-50 dark:bg-[#1b1b1d] flex flex-col transition-all duration-300 select-none border-r border-gray-200/60 dark:border-white/5">
      {/* Brand Header */}
      <div className="px-3 pt-3 pb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors"
            title="Tutup Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={() => { setActiveMode("chat"); createNewSession(); }}
          className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors"
          title="Obrolan Baru"
        >
          <SquarePen className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 pt-2 pb-4 flex items-center gap-2.5">
        <div className="relative w-8 h-8 flex-shrink-0">
          <Image src="/logo_1.png" alt="Agens" fill className="object-contain" priority />
        </div>
        <span className="text-lg font-semibold text-gray-800 dark:text-white tracking-wide">Agens</span>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1 scrollbar-none">
        <button
          onClick={createNewSession}
          className="flex items-center gap-3 px-3 py-2.5 w-full hover:bg-gray-200/70 dark:hover:bg-white/5 rounded-xl transition-colors text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white group"
        >
          <MessageSquarePlus className="w-[18px] h-[18px] text-gray-500 dark:text-gray-400" />
          <span>Percakapan baru</span>
        </button>

        <button
          onClick={() => setIsSchedulerOpen(true)}
          className="flex items-center gap-3 px-3 py-2.5 w-full hover:bg-gray-200/70 dark:hover:bg-white/5 rounded-xl transition-colors text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white group"
        >
          <CalendarClock className="w-[18px] h-[18px] text-gray-500 dark:text-gray-400" />
          <span>Terjadwal</span>
        </button>

        {pinnedSessions.length > 0 && (
          <div className="pt-4 space-y-0.5">
            <div className="px-3 py-1.5 text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <Pin className="w-3 h-3" />
              Disematkan
            </div>
            {pinnedSessions.map((session) => (
              <ChatItem
                key={session.id}
                session={session}
                isActive={activeSessionId === session.id && activeMode === "chat"}
                onSelect={() => selectSession(session.id)}
                onTogglePin={(e) => togglePinSession(session.id, e)}
                onDelete={(e) => deleteSession(session.id, e)}
              />
            ))}
          </div>
        )}

        {recentSessions.length > 0 && (
          <div className="pt-4 space-y-0.5">
            <div className="px-3 py-1.5 text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Terbaru
            </div>
            {recentSessions.map((session) => (
              <ChatItem
                key={session.id}
                session={session}
                isActive={activeSessionId === session.id && activeMode === "chat"}
                onSelect={() => selectSession(session.id)}
                onTogglePin={(e) => togglePinSession(session.id, e)}
                onDelete={(e) => deleteSession(session.id, e)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-200/60 dark:border-white/5 mt-auto">
        <div className="flex items-center gap-3 px-2 py-2 hover:bg-gray-200/70 dark:hover:bg-white/5 rounded-xl cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
            S
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">Satriaji</p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">Pro</p>
          </div>
          <ThemeToggle />
          <Settings className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
        </div>
      </div>
    </aside>
  );

  function MobileDrawer({ close }: { close: () => void }) {
    return (
      <div className="fixed inset-0 z-50 flex md:hidden">
        <div className="fixed inset-0 bg-black/50 dark:bg-black/60 backdrop-blur-sm" onClick={close} />
        <div className="relative z-10 w-[280px] h-full shadow-2xl">
          {sidebarContent}
        </div>
      </div>
    );
  }

  // --- Render phase ---
  if (!isSidebarOpen) {
    return (
      <>
        <aside className="hidden md:flex w-[60px] h-full flex-shrink-0 bg-gray-50 dark:bg-[#1b1b1d] flex-col items-center py-3 gap-2 transition-all duration-300 border-r border-gray-200/60 dark:border-white/5">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors mb-1"
            title="Buka Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <button
            onClick={() => { setActiveMode("chat"); createNewSession(); }}
            className="p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors"
            title="Obrolan Baru"
          >
            <SquarePen className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <ThemeToggle />
          <button className="p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors" title="Pengaturan">
            <Settings className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold mt-1 cursor-pointer" title="Satriaji">
            S
          </div>
        </aside>
        {isMobileSidebarOpen && <MobileDrawer close={() => setIsMobileSidebarOpen(false)} />}
      </>
    );
  }

  return (
    <>
      <div className="hidden md:flex h-full flex-shrink-0">
        {sidebarContent}
      </div>
      {isMobileSidebarOpen && <MobileDrawer close={() => setIsMobileSidebarOpen(false)} />}
      {isSchedulerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
            onClick={() => setIsSchedulerOpen(false)}
          />
          <div className="relative z-10 bg-white dark:bg-[#242424] border border-gray-200 dark:border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                  Jadwal Riset Otomatis (Cron)
                </h3>
              </div>
              <button
                onClick={() => setIsSchedulerOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5 text-center py-6">
                <CalendarClock className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2 opacity-50" />
                <p className="font-medium text-gray-500 dark:text-gray-400">Belum ada tugas yang terjadwal.</p>
                <p className="text-gray-400 dark:text-gray-500 text-[11px] mt-1">Tugas otomatis (cron) akan muncul di sini.</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-white/5 space-y-1">
                <span className="text-gray-500 dark:text-gray-400 font-mono text-[11px]">Endpoint Cron:</span>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value="/api/cron/research"
                    className="flex-1 bg-transparent text-gray-800 dark:text-gray-200 font-mono text-[11px] focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("/api/cron/research");
                      setCopiedCron(true);
                      setTimeout(() => setCopiedCron(false), 2000);
                    }}
                    className="p-1.5 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 rounded-lg text-gray-700 dark:text-gray-200 transition-colors"
                  >
                    {copiedCron ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsSchedulerOpen(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-[#2f2f2f] hover:bg-gray-200 dark:hover:bg-[#3a3a3a] text-gray-900 dark:text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface ChatItemProps {
  session: {
    id: string;
    title: string;
    isPinned: boolean;
  };
  isActive: boolean;
  onSelect: () => void;
  onTogglePin: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

function ChatItem({ session, isActive, onSelect, onTogglePin, onDelete }: ChatItemProps) {
  return (
    <div
      onClick={onSelect}
      className={`group flex items-center justify-between px-3 py-2 w-full rounded-xl transition-colors text-sm cursor-pointer ${
        isActive
          ? "bg-gray-200/80 dark:bg-white/10 text-gray-900 dark:text-white font-medium"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200"
      }`}
    >
      <span className="truncate flex-1 pr-2">{session.title}</span>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          title={session.isPinned ? "Lepaskan sematan" : "Sematkan obrolan"}
          onClick={onTogglePin}
          className={`p-1 rounded hover:bg-gray-300/50 dark:hover:bg-white/10 transition-colors ${
            session.isPinned ? "text-blue-500" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          }`}
        >
          {session.isPinned ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
        </button>
        <button
          title="Hapus obrolan"
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm("Apakah Anda yakin ingin menghapus obrolan ini?")) {
              onDelete(e);
            }
          }}
          className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-gray-300/50 dark:hover:bg-white/10 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
