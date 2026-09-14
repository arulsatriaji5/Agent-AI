"use client";

import { useChat } from "ai/react";
import { Send, Bot, User } from "lucide-react";
import { useEffect, useRef } from "react";

export function ChatMode() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat"
  });
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-[#212121] relative">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 pb-32 scrollbar-none">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-gray-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-200">Bagaimana saya bisa membantu?</h2>
            <p className="text-gray-400 mt-2 text-sm max-w-sm">Tanyakan tentang analisis teknikal, tren kripto, pergerakan chart, atau strategi investasi.</p>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-gray-300" />
                </div>
              )}
              <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3 ${
                m.role === 'user' 
                  ? 'bg-blue-600/20 text-blue-100 border border-blue-500/20' 
                  : 'bg-white/5 text-gray-200'
              }`}>
                <div className="prose prose-invert prose-sm max-w-none">
                  {m.content}
                </div>
              </div>
              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0 border border-blue-500/20">
                  <User className="w-5 h-5 text-blue-300" />
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-4 justify-start animate-pulse">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-gray-300" />
            </div>
            <div className="bg-white/5 rounded-2xl px-5 py-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-[#212121] 80% to-transparent">
        <form 
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto relative bg-[#2f2f2f] rounded-2xl border border-white/10 focus-within:border-white/20 transition-colors shadow-lg"
        >
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Tanyakan analisis kripto atau saham..."
            className="w-full bg-transparent text-gray-100 px-5 py-4 pr-14 focus:outline-none placeholder-gray-500"
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
