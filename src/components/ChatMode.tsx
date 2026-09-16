"use client";

import React, { useState, useEffect, useRef } from "react";
import { useChat } from "ai/react";
import { Send, Bot, User, Copy, Check } from "lucide-react";
import { useChatContext, type ChatMessage } from "@/context/ChatContext";

export function ChatMode() {
  const {
    activeSessionId,
    activeSession,
    saveOrUpdateSession,
  } = useChatContext();

  const [selectedModel, setSelectedModel] = useState<"gemini-2.5-flash" | "gemini-2.5-pro">(
    "gemini-2.5-flash"
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const prevSessionIdRef = useRef<string | null>(activeSessionId);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat({
    api: "/api/chat",
    body: {
      model: selectedModel,
    },
    onFinish: (message) => {
      // Synchronize full messages after stream completes
      const updatedMessages: ChatMessage[] = [
        ...messages.map((m) => ({
          id: m.id,
          role: m.role as "user" | "assistant" | "system",
          content: m.content,
        })),
        {
          id: message.id,
          role: message.role as "user" | "assistant" | "system",
          content: message.content,
        },
      ];

      saveOrUpdateSession(prevSessionIdRef.current, updatedMessages);
    },
  });

  // Only synchronize messages when switching between different sessions from the sidebar
  useEffect(() => {
    if (activeSessionId !== prevSessionIdRef.current) {
      prevSessionIdRef.current = activeSessionId;
      if (activeSession) {
        setMessages(
          activeSession.messages.map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content,
          }))
        );
      } else {
        setMessages([]);
      }
    }
  }, [activeSessionId, activeSession, setMessages]);

  // Smooth auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#212121] relative">
      {/* Sub-header / Model Selector */}
      <div className="px-4 py-2 bg-[#1c1c1c] border-b border-white/5 flex items-center justify-between text-xs">
        <span className="text-gray-400">Percakapan Langsung Pasar</span>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-[11px]">Model:</span>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value as any)}
            className="bg-[#2a2a2a] text-gray-200 text-xs py-1 px-2 rounded-lg border border-white/10 focus:outline-none focus:border-white/20 cursor-pointer"
          >
            <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
            <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
          </select>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 pb-36 scrollbar-none">
        {messages.length === 0 ? (
          <div className="h-full min-h-[360px] flex flex-col items-center justify-center text-center opacity-70">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 shadow-md">
              <Bot className="w-8 h-8 text-gray-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-200">
              Bagaimana saya bisa membantu?
            </h2>
            <p className="text-gray-400 mt-2 text-sm max-w-sm">
              Tanyakan tentang analisis teknikal, tren kripto, pergerakan chart, atau strategi investasi saham Indo.
            </p>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-4 ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-5 h-5 text-gray-300" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 text-sm ${
                  m.role === "user"
                    ? "bg-[#2563EB]/20 text-blue-100 border border-[#2563EB]/30"
                    : "bg-white/5 text-gray-200"
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>

                {m.role === "assistant" && (
                  <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-end">
                    <button
                      onClick={() => copyToClipboard(m.content, m.id)}
                      className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-white transition-colors"
                      title="Salin jawaban"
                    >
                      {copiedId === m.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {m.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-[#2563EB]/20 flex items-center justify-center flex-shrink-0 border border-[#2563EB]/30 mt-0.5">
                  <User className="w-5 h-5 text-blue-300" />
                </div>
              )}
            </div>
          ))
        )}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex gap-4 justify-start animate-pulse">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-gray-300" />
            </div>
            <div className="bg-white/5 rounded-2xl px-5 py-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
              <div
                className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
              <div
                className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-[#212121] 80% to-transparent z-10">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto relative bg-[#2f2f2f] rounded-2xl border border-white/10 focus-within:border-white/20 transition-colors shadow-lg"
        >
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Tanyakan analisis kripto atau saham..."
            className="w-full bg-transparent text-gray-100 px-5 py-4 pr-14 focus:outline-none placeholder-gray-500 text-sm"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-center text-xs text-gray-500 mt-3">
          AI dapat membuat kesalahan. Harap periksa info penting.
        </p>
      </div>
    </div>
  );
}
