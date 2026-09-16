"use client";

import React, { useState } from "react";
import { 
  MessageSquarePlus, 
  Image as ImageIcon, 
  Library, 
  Briefcase, 
  CalendarClock, 
  Pin,
  PinOff,
  Trash2,
  Settings,
  User,
  X,
  Copy,
  Check,
  Play
} from "lucide-react";
import { useChatContext } from "@/context/ChatContext";
import { AgentLogo } from "@/components/AgentLogo";

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

  const pinnedSessions = sessions.filter((s) => s.isPinned);
  const recentSessions = sessions.filter((s) => !s.isPinned);

  const sidebarContent = (
    <aside className="w-[260px] h-full flex-shrink-0 bg-[#171717] flex flex-col transition-all duration-300 select-none">
      {/* Brand Header */}
      <div className="p-3 flex items-center justify-between">
        <button 
          onClick={() => {
            setActiveMode("chat");
            createNewSession();
          }}
          className="flex items-center gap-2 px-3 py-2 w-full hover:bg-white/5 rounded-lg transition-colors group"
        >
          <AgentLogo size="sm" showText={true} />
        </button>

        {/* Mobile close */}
        <button 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="md:hidden p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="px-3 pb-2">
        <button
          onClick={createNewSession}
          className="flex items-center gap-2 px-3 py-2.5 w-full bg-white/10 hover:bg-white/15 rounded-lg transition-colors text-sm font-medium text-gray-200"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Obrolan baru</span>
        </button>
      </div>

      {/* Main Navigation Links (Matching Image 3) */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6 scrollbar-none">
        <div className="space-y-1">
          <button
            onClick={() => setActiveMode("work")}
            className="flex items-center gap-2 px-3 py-2 w-full hover:bg-white/5 rounded-lg transition-colors text-sm text-gray-300 hover:text-gray-100 group text-left"
          >
            <ImageIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
            <span>Gambar</span>
          </button>

          <button
            onClick={() => setActiveMode("work")}
            className="flex items-center gap-2 px-3 py-2 w-full hover:bg-white/5 rounded-lg transition-colors text-sm text-gray-300 hover:text-gray-100 group text-left"
          >
            <Library className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
            <span>Pustaka</span>
          </button>

          <button
            onClick={() => setActiveMode("work")}
            className="flex items-center gap-2 px-3 py-2 w-full hover:bg-white/5 rounded-lg transition-colors text-sm text-gray-300 hover:text-gray-100 group text-left"
          >
            <Briefcase className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
            <span>Proyek</span>
          </button>

          <button
            onClick={() => setIsSchedulerOpen(true)}
            className="flex items-center gap-2 px-3 py-2 w-full hover:bg-white/5 rounded-lg transition-colors text-sm text-gray-300 hover:text-gray-100 group text-left"
          >
            <CalendarClock className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
            <span>Terjadwal</span>
          </button>
        </div>

        {/* Dynamic Chat History: Pinned Section */}
        {pinnedSessions.length > 0 && (
          <div className="space-y-1">
            <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase flex items-center gap-2">
              <Pin className="w-3 h-3 text-blue-400" />
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

        {/* Dynamic Chat History: Recent Section */}
        {recentSessions.length > 0 && (
          <div className="space-y-1">
            <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">
              Terkini
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

      {/* User Footer (Matching Image 3) */}
      <div className="p-3 border-t border-white/5 mt-auto">
        <div className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">Satriaji</p>
            <p className="text-xs text-gray-500 truncate">Pro Plan</p>
          </div>
          <Settings className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full flex-shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile Drawer */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-[260px] h-full shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Scheduler Modal */}
      {isSchedulerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsSchedulerOpen(false)}
          />
          <div className="relative z-10 bg-[#242424] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-gray-100 text-sm">
                  Jadwal Riset Otomatis (Cron)
                </h3>
              </div>
              <button
                onClick={() => setIsSchedulerOpen(false)}
                className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <p className="font-semibold text-gray-200 mb-1">Status Eksekusi:</p>
                <p className="text-emerald-400 flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Aktif — Setiap Hari pk 08:00 WIB (01:00 UTC)
                </p>
              </div>

              <div className="p-3 bg-[#1a1a1a] rounded-xl border border-white/5 space-y-1">
                <span className="text-gray-400 font-mono text-[11px]">Endpoint Cron:</span>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value="/api/cron/research"
                    className="flex-1 bg-transparent text-gray-200 font-mono text-[11px] focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("/api/cron/research");
                      setCopiedCron(true);
                      setTimeout(() => setCopiedCron(false), 2000);
                    }}
                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-gray-200 transition-colors"
                  >
                    {copiedCron ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsSchedulerOpen(false)}
                className="px-4 py-2 bg-[#2f2f2f] hover:bg-[#3a3a3a] text-white text-xs font-semibold rounded-xl transition-colors"
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
      className={`group flex items-center justify-between px-3 py-2 w-full rounded-lg transition-colors text-sm cursor-pointer ${
        isActive
          ? "bg-white/10 text-white font-medium"
          : "text-gray-300 hover:bg-white/5 hover:text-gray-100"
      }`}
    >
      <span className="truncate flex-1 pr-2">{session.title}</span>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          title={session.isPinned ? "Lepaskan sematan" : "Sematkan obrolan"}
          onClick={onTogglePin}
          className={`p-1 rounded hover:bg-white/10 transition-colors ${
            session.isPinned ? "text-blue-400" : "text-gray-400 hover:text-gray-200"
          }`}
        >
          {session.isPinned ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
        </button>
        <button
          title="Hapus obrolan"
          onClick={onDelete}
          className="p-1 rounded text-gray-400 hover:text-red-400 hover:bg-white/10 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
