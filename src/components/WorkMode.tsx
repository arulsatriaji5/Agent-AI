"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Bot, 
  LineChart, 
  TrendingUp, 
  Presentation, 
  Play, 
  Download, 
  Check, 
  Copy, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Layers,
  Paperclip,
  ArrowUp
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useChatContext, ChatMessage } from "@/context/ChatContext";
import { AgentProcessTracker } from "./AgentProcessTracker";
import { AgentLogo } from "./AgentLogo";

interface CarouselSlide {
  slideNumber: number;
  type: string;
  badge: string;
  title: string;
  summary: string;
  keyPoints: string[];
  visualPrompt: string;
  imageUrl: string;
}

interface BullishSignal {
  symbol: string;
  assetType: "Crypto" | "Saham";
  price: number;
  change24h: number;
  reason: string;
}

interface AutonomousReport {
  output_type: "CAROUSEL" | "ANALYSIS" | "SCANNER";
  sentiment: "Bullish" | "Bearish" | "Neutral";
  sentimentScore: number;
  marketSummary: string;
  coverHook: string;
  timestamp: string;
  slides: CarouselSlide[];
  signals?: BullishSignal[];
  realtimeData?: {
    asset: string;
    price: number;
    changePercent: number;
    high: number;
    low: number;
    sentiment: "Bullish" | "Bearish" | "Neutral";
    analysisText: string;
    newsSummary: Array<{headline: string; url: string}>;
  };
}

export function WorkMode() {
  const { activeSession, saveOrUpdateSession, activeSessionId } = useChatContext();
  const [model, setModel] = useState<string>("gemini-2.5-flash");
  const [taskInput, setTaskInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const messages = activeSession?.messages || [];
  const isWorking = messages.length > 0 && messages[messages.length - 1].isProcessing;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const runAction = async (customPrompt?: string) => {
    const finalTask = (customPrompt || taskInput).trim();
    if (!finalTask || isWorking) return;
    
    setTaskInput("");

    // Create a new array of messages including the user's prompt
    const newMessages: ChatMessage[] = [
      ...messages,
      { id: Date.now().toString(), role: "user", content: finalTask }
    ];

    // Create the loading assistant message
    const tempAssistantId = (Date.now() + 1).toString();
    const loadingMessage: ChatMessage = {
      id: tempAssistantId,
      role: "assistant",
      content: "",
      isProcessing: true
    };

    saveOrUpdateSession(activeSessionId, [...newMessages, loadingMessage], messages.length === 0 ? finalTask : activeSession?.title);

    try {
      const startTime = Date.now();
      const res = await fetch("/api/work/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: finalTask,
          messages: newMessages,
          model,
        }),
      });

      const json = await res.json();
      const endTime = Date.now();
      const completionSeconds = Math.round((endTime - startTime) / 1000);

      let finalReport: AutonomousReport;
      if (json.success && json.data) {
        finalReport = json.data;
      } else {
        throw new Error(json.error || "Gagal memproses tugas");
      }

      // Update the assistant message with the result
      saveOrUpdateSession(activeSessionId, [
        ...newMessages,
        {
          id: tempAssistantId,
          role: "assistant",
          content: finalReport.marketSummary || "Berikut adalah hasil analisis berdasarkan instruksi Anda.",
          report: finalReport,
          isProcessing: false,
          completionTime: completionSeconds
        }
      ], activeSession?.title);

    } catch (e) {
      console.error(e);
      // Fallback
      saveOrUpdateSession(activeSessionId, [
        ...newMessages,
        {
          id: tempAssistantId,
          role: "assistant",
          content: "Mohon maaf, terjadi kesalahan jaringan atau API. Silakan coba lagi nanti.",
          isProcessing: false,
        }
      ], activeSession?.title);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      runAction();
    }
  };

  const renderReport = (report: AutonomousReport) => {
    if (!report) return null;

    return (
      <div className="mt-4 space-y-4">
        {/* ANALYSIS or SCANNER Data embed */}
        {(report.output_type === "ANALYSIS" || report.output_type === "SCANNER") && (
          <div className="bg-[#2a2a2a] border border-white/5 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
               <div className="flex items-center gap-2">
                 <LineChart className="w-5 h-5 text-blue-400" />
                 <span className="font-semibold text-gray-200">Metrik Pasar</span>
               </div>
               <span className={`px-2 py-1 text-xs font-bold rounded-md ${
                  report.sentiment === "Bullish" ? "bg-emerald-500/20 text-emerald-400" : 
                  report.sentiment === "Bearish" ? "bg-rose-500/20 text-rose-400" : 
                  "bg-amber-500/20 text-amber-400"
                }`}>
                  {report.sentiment}
                </span>
            </div>
            
            {report.realtimeData && (
              <div className="mb-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Aset Terdeteksi</p>
                    <p className="text-xl font-bold text-white">{report.realtimeData.asset}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-mono font-bold text-gray-100">
                       {report.realtimeData.price.toLocaleString("id-ID")}
                    </p>
                    <p className={`text-sm font-medium ${report.realtimeData.changePercent >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {report.realtimeData.changePercent >= 0 ? "+" : ""}{report.realtimeData.changePercent.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            )}

            {report.signals && report.signals.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Sinyal Terdeteksi</p>
                {report.signals.map((sig, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white/5 p-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span className="font-semibold text-sm text-gray-200">{sig.symbol}</span>
                    </div>
                    <span className="text-emerald-400 text-sm font-mono font-medium">
                       +{sig.change24h}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CAROUSEL Slides embed */}
        {report.output_type === "CAROUSEL" && report.slides && report.slides.length > 0 && (
           <div className="grid gap-4 mt-4">
              {report.slides.map((s) => (
                <div key={s.slideNumber} className="bg-[#1c1c1c] border border-white/10 rounded-xl overflow-hidden shadow-lg group">
                  <div className="relative aspect-video w-full bg-[#111] border-b border-white/5 overflow-hidden">
                    <img 
                      src={s.imageUrl} 
                      alt={s.visualPrompt}
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                      <span className="text-[10px] font-bold tracking-wider text-gray-300">
                        {s.badge}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-base font-bold text-gray-100 mb-2">{s.title}</h4>
                    <p className="text-sm text-gray-400 mb-3">{s.summary}</p>
                    <div className="flex flex-wrap gap-2">
                      {s.keyPoints.map((pt, i) => (
                         <span key={i} className="text-xs font-medium bg-blue-500/10 text-blue-300 px-2 py-1 rounded-md border border-blue-500/20">
                           {pt}
                         </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
           </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#212121] relative">
      <div className="flex-1 overflow-y-auto scrollbar-none pb-32">
        {messages.length === 0 ? (
          /* Empty State: Hero Layout */
          <div className="max-w-4xl mx-auto w-full p-4 sm:p-8 space-y-10 mt-6 sm:mt-10 animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto shadow-lg border border-white/5">
                <Bot className="w-8 h-8 text-gray-300" />
              </div>
              <h1 className="text-3xl font-bold text-gray-100">
                Apa yang harus kita kerjakan?
              </h1>
            </div>

            <div className="bg-[#2f2f2f] rounded-2xl p-2 border border-white/10 flex items-center shadow-lg focus-within:border-white/20 transition-colors">
              <select 
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="bg-[#212121] text-gray-200 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none ml-2"
              >
                <option className="bg-[#171717] text-gray-200" value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                <option className="bg-[#171717] text-gray-200" value="gpt-4o-mini">GPT-4o Mini - GitHub</option>
                <option className="bg-[#171717] text-gray-200" value="Meta-Llama-3.1-70B-Instruct">Llama 3.1 70B - GitHub</option>
              </select>

              <input 
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Kerjakan apa saja..." 
                className="flex-1 bg-transparent text-gray-100 px-4 py-3 focus:outline-none placeholder-gray-500 text-sm"
              />

              <button 
                onClick={() => runAction()}
                disabled={isWorking || !taskInput.trim()}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors disabled:opacity-40"
              >
                <Play className="w-5 h-5 fill-white" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ActionCard 
                icon={<LineChart className="w-5 h-5 text-cyan-400" />}
                title="Riset Crypto Harian"
                desc="Hook + 3-5 Berita + Gambar"
                onClick={() => runAction("Riset Crypto Harian: Bitcoin, Ethereum, Solana, arus ETF, dan sentimen on-chain terkini.")}
                disabled={isWorking}
              />
              <ActionCard 
                icon={<Presentation className="w-5 h-5 text-purple-400" />}
                title="Riset Saham IHSG/Indo"
                desc="BBCA, BBRI, dll."
                onClick={() => runAction("Riset Saham Indonesia: Katalis perbankan BBCA, BBRI, BMRI, dan arah pergerakan IHSG.")}
                disabled={isWorking}
              />
              <ActionCard 
                icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
                title="Scan Sinyal Bullish"
                desc="Volume & Price Breakout"
                onClick={() => runAction("Scan Sinyal Bullish: Cari aset kripto dan saham yang mengalami lonjakan volume dan breakout teknikal.")}
                disabled={isWorking}
              />
            </div>
          </div>
        ) : (
          /* Active State: Conversational Thread */
          <div className="max-w-3xl mx-auto w-full p-4 sm:p-6 space-y-6 pt-8">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                
                {msg.role === "user" && (
                   <div className="max-w-[85%] bg-[#203a43] border border-blue-500/30 text-gray-100 px-5 py-3.5 rounded-3xl rounded-tr-sm shadow-sm">
                     <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                   </div>
                )}

                {msg.role === "assistant" && (
                   <div className="w-full flex gap-4 max-w-[95%]">
                     <div className="mt-1 flex-shrink-0">
                       <AgentLogo size="sm" />
                     </div>
                     <div className="flex-1 overflow-hidden">
                        {/* Process Tracker */}
                        {(msg.isProcessing || msg.completionTime) && (
                          <AgentProcessTracker 
                             isProcessing={msg.isProcessing || false} 
                             completionTime={msg.completionTime} 
                          />
                        )}

                        {/* Narration Text */}
                        {msg.content && !msg.isProcessing && (
                          <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-[#2a2a2a] max-w-none text-gray-200 mt-2">
                             <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        )}

                        {/* Embedded Media/Data */}
                        {msg.report && renderReport(msg.report)}
                     </div>
                   </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Fixed Bottom Input Bar (Only visible in thread mode, but we can make it unified if we want. For now, empty state has it centered, active state has it sticky bottom) */}
      {messages.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#212121] via-[#212121] to-transparent pt-12">
          <div className="max-w-3xl mx-auto">
            <div className="bg-[#2f2f2f] rounded-2xl p-2 border border-white/10 flex items-center shadow-2xl focus-within:border-white/20 transition-colors">
              <button 
                className="p-2.5 text-gray-400 hover:text-gray-200 hover:bg-white/5 rounded-xl transition-colors shrink-0"
                title="Lampirkan File"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <div className="h-6 w-px bg-white/10 mx-1 shrink-0" />

              <select 
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="bg-[#212121] text-gray-200 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none mr-2"
              >
                <option className="bg-[#171717] text-gray-200" value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                <option className="bg-[#171717] text-gray-200" value="gpt-4o-mini">GPT-4o Mini - GitHub</option>
                <option className="bg-[#171717] text-gray-200" value="Meta-Llama-3.1-70B-Instruct">Llama 3.1 70B - GitHub</option>
              </select>

              <input 
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Balas pesan..." 
                className="flex-1 bg-transparent text-gray-100 px-3 py-2.5 focus:outline-none placeholder-gray-500 text-[15px]"
                disabled={isWorking}
              />

              <button 
                onClick={() => runAction()}
                disabled={isWorking || !taskInput.trim()}
                className={`p-2.5 rounded-xl text-white transition-all duration-200 ml-1 ${
                  isWorking || !taskInput.trim() 
                    ? "bg-white/5 opacity-40" 
                    : "bg-white text-black hover:bg-gray-200 scale-105 shadow-md"
                }`}
                title="Kirim"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
            <p className="text-center text-xs text-gray-500 mt-3 font-medium">
              Agent AI dapat melakukan kesalahan. Harap periksa informasi penting.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionCard({ icon, title, desc, onClick, disabled }: any) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className="bg-[#2a2a2a] hover:bg-[#333] border border-white/5 rounded-2xl p-5 text-left transition-all duration-300 hover:shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="bg-white/5 w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-100 mb-1">{title}</h3>
      <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
    </button>
  );
}
