"use client";

import React, { useState, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { Send, Bot, User, Copy, Check, Edit2, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useChatContext, type ChatMessage } from "@/context/ChatContext";

export function ChatMode() {
  const {
    activeSessionId,
    activeSession,
    saveOrUpdateSession,
  } = useChatContext();

  const [selectedModel, setSelectedModel] = useState<string>("gemini-2.5-flash");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [localInput, setLocalInput] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const prevSessionIdRef = useRef<string | null>(activeSessionId);
  const formRef = useRef<HTMLFormElement>(null);

  const {
    messages,
    isLoading,
    setMessages,
    append,
  } = useChat({
    api: "/api/chat",
    body: {
      model: selectedModel,
    }
  });

  // Sync session changes from Sidebar (Load history)
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

  // Sync messages TO local context whenever they change (Fixes retention!)
  useEffect(() => {
    if (messages.length > 0) {
      saveOrUpdateSession(activeSessionId, messages.map(m => ({
        id: m.id,
        role: m.role as "user" | "assistant" | "system",
        content: m.content
      })));
    }
  }, [messages, activeSessionId, saveOrUpdateSession]);

  // Smooth auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleEditSubmit = () => {
    if (!editContent.trim()) return;
    const idx = messages.findIndex(m => m.id === editingId);
    if (idx !== -1) {
      // Truncate messages up to the edited one
      const newMessages = messages.slice(0, idx);
      setMessages(newMessages);
      setEditingId(null);
      // Append the new message, which will trigger API regeneration
      append({ role: "user", content: editContent.trim() });
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#212121] relative">
      {/* Messages Scroll Area - FIXED SCROLLING AND RETENTION CONTAINER */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-4 scrollbar-none pt-4">
        <div className="max-w-3xl mx-auto w-full space-y-6">
          {messages.length === 0 ? (
            <div className="h-full min-h-[360px] flex flex-col items-center justify-center text-center opacity-70">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 shadow-md">
                <Bot className="w-8 h-8 text-gray-300" />
              </div>
              <h2 className="text-xl font-semibold text-gray-200">
                Bagaimana saya bisa membantu?
              </h2>
              <p className="text-gray-400 mt-2 text-sm max-w-sm">
                Tanyakan apa saja, mulai dari analisis kripto hingga bantuan coding.
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
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 text-sm group relative ${
                    m.role === "user"
                      ? "bg-[#2563EB]/20 text-blue-100 border border-[#2563EB]/30"
                      : "bg-white/5 text-gray-200"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <div className="whitespace-pre-wrap leading-relaxed">
                      <ReactMarkdown
                        components={{
                          ul: ({node, ...props}) => <ul className="list-disc ml-4 space-y-1 my-2" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal ml-4 space-y-1 my-2" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                          p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {editingId === m.id ? (
                         <div className="flex flex-col gap-2 min-w-[250px]">
                           <textarea 
                             value={editContent}
                             onChange={(e) => setEditContent(e.target.value)}
                             className="w-full bg-black/30 border border-blue-500/50 rounded-lg p-2 text-gray-100 focus:outline-none resize-none min-h-[80px]"
                           />
                           <div className="flex items-center justify-end gap-2">
                             <button onClick={() => setEditingId(null)} className="px-3 py-1.5 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">Batal</button>
                             <button onClick={handleEditSubmit} className="px-3 py-1.5 text-xs font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">Kirim Ulang</button>
                           </div>
                         </div>
                      ) : (
                        m.content
                      )}
                    </div>
                  )}

                  {/* Assistant Hover Action */}
                  {m.role === "assistant" && (
                    <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
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

                  {/* User Hover Actions (Edit & Copy) */}
                  {m.role === "user" && editingId !== m.id && (
                    <div className="mt-2 pt-2 border-t border-[#2563EB]/20 flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => copyToClipboard(m.content, m.id)}
                        className="flex items-center gap-1 text-[11px] text-blue-300/70 hover:text-blue-300 transition-colors"
                        title="Salin pesan"
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
                      <button
                        onClick={() => {
                          setEditingId(m.id);
                          setEditContent(m.content);
                        }}
                        className="flex items-center gap-1 text-[11px] text-blue-300/70 hover:text-blue-300 transition-colors"
                        title="Edit pesan"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
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

          <div ref={bottomRef} className="h-4" />
        </div>
      </div>

      {/* Input Bar */}
      <div className="w-full p-4 sm:p-6 bg-[#212121] border-t border-white/5 z-10 shrink-0 shadow-[0_-10px_40px_rgba(33,33,33,0.8)]">
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            if (localInput.trim() && !isLoading) {
              append({ role: "user", content: localInput.trim() });
              setLocalInput("");
            }
          }}
          className="max-w-3xl mx-auto flex items-center bg-[#2f2f2f] rounded-2xl border border-white/10 focus-within:border-white/20 transition-colors shadow-lg"
        >
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-[#212121] text-gray-200 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none ml-2"
          >
            <option className="bg-[#171717] text-gray-200" value="gemini-2.5-flash">Gemini 2.5 Flash</option>
            <option className="bg-[#171717] text-gray-200" value="gpt-4o-mini">GPT-4o Mini - GitHub</option>
            <option className="bg-[#171717] text-gray-200" value="Meta-Llama-3.1-70B-Instruct">Llama 3.1 70B - GitHub</option>
          </select>
          <textarea
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (localInput.trim() && !isLoading) {
                  formRef.current?.requestSubmit();
                }
              }
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
            }}
            placeholder="Tanyakan sesuatu... (Shift+Enter untuk baris baru)"
            rows={1}
            className="flex-1 bg-transparent text-gray-100 px-4 py-4 focus:outline-none placeholder-gray-500 text-sm resize-none max-h-[200px] overflow-y-auto"
          />
          <button
            type="submit"
            disabled={isLoading || !localInput.trim()}
            className="mr-2 p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-center text-xs text-gray-500 mt-3 font-medium">
          AI dapat membuat kesalahan. Harap periksa info penting.
        </p>
      </div>
    </div>
  );
}
