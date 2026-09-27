"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Bot, 
  SendHorizontal, 
  Plus, 
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
  ArrowUp,
  Image as ImageIcon,
  Folder,
  X
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
  
  // Attachments State
  const [attachments, setAttachments] = useState<File[]>([]);
  const [folderContext, setFolderContext] = useState<string>("");
  const [folderName, setFolderName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const messages = activeSession?.messages || [];
  const isWorking = messages.length > 0 && messages[messages.length - 1].isProcessing;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processFolder = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const firstPath = files[0].webkitRelativePath;
    const fName = firstPath ? firstPath.split('/')[0] : "Folder Proyek";
    setFolderName(fName);

    let combinedText = `[KONTEKS FOLDER PROYEK: ${fName}]\n\n`;
    let fileCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (
        file.name.includes('.git') || 
        file.webkitRelativePath.includes('node_modules/') ||
        file.webkitRelativePath.includes('.next/') ||
        file.name.endsWith('.png') || file.name.endsWith('.jpg') || file.name.endsWith('.pdf') || file.name.endsWith('.exe')
      ) continue;
      if (file.size > 500 * 1024) continue; 

      try {
        const text = await file.text();
        combinedText += `--- FILE: ${file.webkitRelativePath} ---\n${text}\n\n`;
        fileCount++;
      } catch (err) {
        console.error("Error reading file", file.name, err);
      }
    }
    
    if (fileCount > 0) setFolderContext(combinedText);
    else setFolderName("");
    
    if (folderInputRef.current) folderInputRef.current.value = '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const runAction = async (customPrompt?: string) => {
    const rawTask = customPrompt || taskInput;
    const finalTask = folderContext ? `${folderContext}\n${rawTask.trim()}` : rawTask.trim();
    
    if ((!finalTask && attachments.length === 0) || isWorking) return;
    
    setTaskInput("");
    setFolderContext("");
    setFolderName("");
    setAttachments([]);

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
          <div className="bg-[#2a2a2a] border border-gray-200 dark:border-white/5 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/5 pb-3 mb-3">
               <div className="flex items-center gap-2">
                 <LineChart className="w-5 h-5 text-blue-400" />
                 <span className="font-semibold text-gray-800 dark:text-gray-200">Metrik Pasar</span>
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
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{report.realtimeData.asset}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-mono font-bold text-gray-900 dark:text-gray-100">
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
                  <div key={idx} className="flex items-center justify-between bg-gray-100 dark:bg-white/5 p-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">{sig.symbol}</span>
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
                <div key={s.slideNumber} className="bg-[#1c1c1c] border border-gray-300 dark:border-white/10 rounded-xl overflow-hidden shadow-lg group">
                  <div className="relative aspect-video w-full bg-[#111] border-b border-gray-200 dark:border-white/5 overflow-hidden">
                    <img 
                      src={s.imageUrl} 
                      alt={s.visualPrompt}
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-3 left-3 bg-gray-900/40 dark:bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-gray-300 dark:border-white/10">
                      <span className="text-[10px] font-bold tracking-wider text-gray-700 dark:text-gray-300">
                        {s.badge}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">{s.title}</h4>
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
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[#131314] relative">
      <div className="flex-1 overflow-y-auto scrollbar-none pb-32">
        {messages.length === 0 ? (
          /* Empty State: Hero Layout */
          <div className="max-w-4xl mx-auto w-full p-4 sm:p-8 space-y-10 mt-6 sm:mt-10 animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 font-bold text-white shadow-lg mb-4 mx-auto text-xl">
                AS
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Apa yang harus kita kerjakan?
              </h1>
            </div>

            
          <div className="flex items-center bg-gray-100 dark:bg-[#1e1f20] rounded-full p-2 px-4 shadow-sm border border-gray-200/80 dark:border-[#3c4043]/80 max-w-3xl mx-auto w-full transition-all focus-within:shadow-md focus-within:border-blue-400/50">
            {/* Ikon Plus Kiri */}
            <button 
              type="button" 
              onClick={() => { fileInputRef.current?.click(); }}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-full transition-colors shrink-0"
            >
              <Plus size={24} />
            </button>
            
            {/* Kolom Teks Input */}
            <textarea 
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  runAction();
                }
              }}
              onInput={(e) => {
                const target = e.target;
                target.style.height = "auto";
                target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
              }}
              className="flex-1 bg-transparent text-gray-900 dark:text-white px-3 py-2.5 outline-none placeholder-gray-500 dark:placeholder-gray-400 min-w-0 resize-none max-h-[200px] overflow-y-auto text-sm" 
              placeholder="Kerjakan apa saja..." 
              rows={1}
            />
            
            {/* Wrapper Kanan: Dropdown Model & Tombol Kirim */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Dropdown Model ala Gemini */}
              <div className="relative hidden sm:flex items-center bg-transparent hover:bg-gray-200 dark:hover:bg-[#333538] rounded-lg px-2 py-1.5 transition-colors cursor-pointer">
                <select 
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="bg-transparent text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 outline-none cursor-pointer appearance-none pr-4 max-w-[120px] truncate"
                >
                  <option value="gemini-2.5-flash" className="bg-white dark:bg-[#1e1f20] text-gray-900 dark:text-white">Gemini 2.5</option>
                  <option value="llama-3.3-70b-versatile" className="bg-white dark:bg-[#1e1f20] text-gray-900 dark:text-white">Llama 3.3</option>
                </select>
                {/* Custom Chevron karena appearance-none */}
                <div className="absolute right-1 pointer-events-none text-gray-500 dark:text-gray-400">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>

              {/* Ikon Pesawat Kertas (Kirim) */}
              <button 
                onClick={() => runAction()}
                disabled={isWorking || (!taskInput.trim() && attachments.length === 0)}
                className="p-2 text-gray-400 hover:text-blue-500 dark:hover:text-white rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <SendHorizontal size={20} />
              </button>
            </div>
          </div>


            

            {/* Hidden Inputs */}
            <input type="file" multiple accept="image/*" ref={fileInputRef} className="hidden" onChange={(e) => { if (e.target.files) setAttachments(prev => [...prev, ...Array.from(e.target.files!)]); }} />
            <input type="file" /* @ts-expect-error */ webkitdirectory="" directory="" ref={folderInputRef} className="hidden" onChange={processFolder} />

            {/* Upload previews */}
            {(attachments.length > 0 || folderName) && (
              <div className="flex flex-wrap gap-2 mt-4 px-2 justify-center">
                {attachments.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-gray-200 dark:bg-white/10 px-3 py-1.5 rounded-lg text-sm text-gray-800 dark:text-gray-200">
                    <ImageIcon className="w-4 h-4 text-blue-400" />
                    <span className="truncate max-w-[120px]">{file.name}</span>
                    <button type="button" onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))} className="text-gray-400 hover:text-red-400 ml-1"><X className="w-4 h-4" /></button>
                  </div>
                ))}
                {folderName && (
                  <div className="flex items-center gap-2 bg-gray-200 dark:bg-white/10 px-3 py-1.5 rounded-lg text-sm text-gray-800 dark:text-gray-200">
                    <Folder className="w-4 h-4 text-amber-400" />
                    <span className="truncate max-w-[150px]">{folderName}</span>
                    <button type="button" onClick={() => { setFolderName(""); setFolderContext(""); }} className="text-gray-400 hover:text-red-400 ml-1"><X className="w-4 h-4" /></button>
                  </div>
                )}
              </div>
            )}

            ) : (
          /* Active State: Conversational Thread */
          <div className="max-w-3xl mx-auto w-full p-4 sm:p-6 space-y-6 pt-8">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                
                {msg.role === "user" && (
                   <div className="max-w-[85%] bg-[#203a43] border border-blue-500/30 text-gray-900 dark:text-gray-100 px-5 py-3.5 rounded-3xl rounded-tr-sm shadow-sm">
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
                          <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-[#2a2a2a] max-w-none text-gray-800 dark:text-gray-200 mt-2">
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

      {messages.length > 0 && (
        <div className="w-full p-3 sm:p-4 bg-gray-50 dark:bg-[#131314]/95 backdrop-blur-md border-t border-gray-200 dark:border-white/5 shadow-[0_-10px_40px_rgba(33,33,33,0.9)] sticky bottom-0 z-10 shrink-0">
          
          {/* Upload previews for bottom bar */}
          {(attachments.length > 0 || folderName) && (
            <div className="max-w-3xl mx-auto flex flex-wrap gap-2 mb-2 px-2">
              {attachments.map((file, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-gray-200 dark:bg-white/10 px-3 py-1 rounded-lg text-xs text-gray-800 dark:text-gray-200">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                  <span className="truncate max-w-[100px]">{file.name}</span>
                  <button type="button" onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))} className="text-gray-400 hover:text-red-400 ml-1"><X className="w-3 h-3" /></button>
                </div>
              ))}
              {folderName && (
                <div className="flex items-center gap-2 bg-gray-200 dark:bg-white/10 px-3 py-1 rounded-lg text-xs text-gray-800 dark:text-gray-200">
                  <Folder className="w-3.5 h-3.5 text-amber-400" />
                  <span className="truncate max-w-[100px]">{folderName}</span>
                  <button type="button" onClick={() => { setFolderName(""); setFolderContext(""); }} className="text-gray-400 hover:text-red-400 ml-1"><X className="w-3 h-3" /></button>
                </div>
              )}
            </div>
          )}

          
          
          <div className="flex items-center bg-gray-100 dark:bg-[#1e1f20] rounded-full p-2 px-4 shadow-sm border border-gray-200/80 dark:border-[#3c4043]/80 max-w-3xl mx-auto w-full transition-all focus-within:shadow-md focus-within:border-blue-400/50">
            {/* Ikon Plus Kiri */}
            <button 
              type="button" 
              onClick={() => { fileInputRef.current?.click(); }}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-full transition-colors shrink-0"
            >
              <Plus size={24} />
            </button>
            
            {/* Kolom Teks Input */}
            <textarea 
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  runAction();
                }
              }}
              onInput={(e) => {
                const target = e.target;
                target.style.height = "auto";
                target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
              }}
              className="flex-1 bg-transparent text-gray-900 dark:text-white px-3 py-2.5 outline-none placeholder-gray-500 dark:placeholder-gray-400 min-w-0 resize-none max-h-[200px] overflow-y-auto text-sm" 
              placeholder="Kerjakan apa saja..." 
              rows={1}
            />
            
            {/* Wrapper Kanan: Dropdown Model & Tombol Kirim */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Dropdown Model ala Gemini */}
              <div className="relative hidden sm:flex items-center bg-transparent hover:bg-gray-200 dark:hover:bg-[#333538] rounded-lg px-2 py-1.5 transition-colors cursor-pointer">
                <select 
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="bg-transparent text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 outline-none cursor-pointer appearance-none pr-4 max-w-[120px] truncate"
                >
                  <option value="gemini-2.5-flash" className="bg-white dark:bg-[#1e1f20] text-gray-900 dark:text-white">Gemini 2.5</option>
                  <option value="llama-3.3-70b-versatile" className="bg-white dark:bg-[#1e1f20] text-gray-900 dark:text-white">Llama 3.3</option>
                </select>
                {/* Custom Chevron karena appearance-none */}
                <div className="absolute right-1 pointer-events-none text-gray-500 dark:text-gray-400">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>

              {/* Ikon Pesawat Kertas (Kirim) */}
              <button 
                onClick={() => runAction()}
                disabled={isWorking || (!taskInput.trim() && attachments.length === 0)}
                className="p-2 text-gray-400 hover:text-blue-500 dark:hover:text-white rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <SendHorizontal size={20} />
              </button>
            </div>
          </div>


            {/* Text Input */}
            <textarea 
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  runAction();
                }
              }}
              onInput={(e) => {
                const target = e.target;
                target.style.height = "auto";
                target.style.height = `${Math.min(target.scrollHeight, 150)}px`;
              }}
              placeholder="Tuliskan instruksi analisis Anda..." 
              rows={1}
              className="flex-1 bg-transparent text-gray-900 dark:text-gray-100 px-2 py-2.5 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 text-sm resize-none max-h-[150px] overflow-y-auto"
            />

            {/* Model Selector */}
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="bg-transparent text-gray-500 dark:text-gray-400 border-none px-1 py-1 focus:outline-none focus:ring-0 cursor-pointer text-xs max-w-[100px] truncate hidden sm:block"
            >
              <option className="bg-white dark:bg-[#1e1f20]" value="gemini-2.5-flash">Gemini 2.5</option>
              <option className="bg-white dark:bg-[#1e1f20]" value="llama-3.3-70b-versatile">Llama 3.3</option>
            </select>

            {/* Send Button */}
            <button 
              onClick={() => runAction()}
              disabled={isWorking || (!taskInput.trim() && attachments.length === 0)}
              className="p-2.5 text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
          <p className="text-center text-[11px] text-gray-400 dark:text-gray-500 mt-3 hidden sm:block">
            Agens dapat melakukan kesalahan. Harap periksa informasi penting.
          </p>
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
      className="bg-[#2a2a2a] hover:bg-[#333] border border-gray-200 dark:border-white/5 rounded-2xl p-5 text-left transition-all duration-300 hover:shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="bg-gray-100 dark:bg-white/5 w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{title}</h3>
      <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
    </button>
  );
}
