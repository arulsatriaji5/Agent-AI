"use client";

import React, { useState, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { Send, Bot, SendHorizontal, User, Copy, Check, Edit2, X, Plus, Folder, FileText, Image as ImageIcon, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
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
  
  // Attachments State
  const [attachments, setAttachments] = useState<File[]>([]);
  const [folderContext, setFolderContext] = useState<string>("");
  const [folderName, setFolderName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const prevSessionIdRef = useRef<string | null>(activeSessionId);
  const formRef = useRef<HTMLFormElement>(null);

  const {
    messages,
    status,
    setMessages,
    sendMessage: append,
    error,
  } = useChat({
    api: "/api/chat",
    body: {
      model: selectedModel,
    },
    onError: (err) => console.error("Error dari useChat:", err.message),
  });

  const isLoading = status === "submitted" || status === "streaming";

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

  // Sync messages TO local context whenever they change
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
      const newMessages = messages.slice(0, idx);
      setMessages(newMessages);
      setEditingId(null);
      append({ role: "user", content: editContent.trim() });
    }
  };

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
        file.webkitRelativePath.includes('.git/') ||
        file.webkitRelativePath.includes('node_modules/') ||
        file.webkitRelativePath.includes('.next/') ||
        file.name.endsWith('.png') || file.name.endsWith('.jpg') || file.name.endsWith('.pdf') || file.name.endsWith('.exe')
      ) {
        continue;
      }

      if (file.size > 500 * 1024) continue;

      try {
        const text = await file.text();
        combinedText += `--- FILE: ${file.webkitRelativePath} ---\n${text}\n\n`;
        fileCount++;
      } catch (err) {
        console.error("Error reading file", file.name, err);
      }
    }
    
    if (fileCount > 0) {
      setFolderContext(combinedText);
    } else {
      setFolderName("");
    }
    if (folderInputRef.current) folderInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#131314] relative transition-colors duration-300">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-4 scrollbar-none">
        <div className="max-w-3xl mx-auto w-full space-y-6">

          {/* GEMINI-STYLE EMPTY STATE */}
          {messages.length === 0 ? (
            <div className="h-full min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
              <h1 className="text-3xl md:text-5xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-sky-400 dark:from-blue-400 dark:to-sky-200 mb-4 leading-tight animate-fade-in">
                Apa yang bisa saya bantu, Satriaji?
              </h1>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${
                  m.role === "user" ? "justify-end" : "justify-start"
                } animate-fade-in`}
              >
                {m.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="relative w-6 h-6">
                      <Image src="/logo_1.png" alt="Agens" fill className="object-contain" />
                    </div>
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm group relative ${
                    m.role === "user"
                      ? "bg-blue-50 dark:bg-[#2b2d30] text-gray-900 dark:text-gray-100 border border-blue-100 dark:border-transparent"
                      : "bg-transparent text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {!(m.content || (m.parts && m.parts.map((p: any) => p.type === 'text' ? p.text : '').join(''))) ? (
                        <div className="text-red-500 italic text-sm border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 p-3 rounded-xl flex items-center gap-2">
                          <span className="text-lg">??</span>
                          <span>
                            Gagal memproses respons. Model API mungkin sedang kelebihan beban. Silakan coba lagi atau pilih model lain.
                          </span>
                        </div>
                      ) : (
                        <ReactMarkdown
                          components={{
                            ul: ({node, ...props}) => <ul className="list-disc ml-4 space-y-1 my-2" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal ml-4 space-y-1 my-2" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-bold text-gray-900 dark:text-white" {...props} />,
                            p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />
                          }}
                        >
                          {m.content || (m.parts && m.parts.map((p: any) => p.type === 'text' ? p.text : '').join('')) || ''}
                        </ReactMarkdown>
                      )}
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {editingId === m.id ? (
                         <div className="flex flex-col gap-2 min-w-[250px]">
                           <textarea 
                             value={editContent}
                             onChange={(e) => setEditContent(e.target.value)}
                             className="w-full bg-white dark:bg-black/30 border border-blue-300 dark:border-blue-500/50 rounded-lg p-2 text-gray-900 dark:text-gray-100 focus:outline-none resize-none min-h-[80px]"
                           />
                           <div className="flex items-center justify-end gap-2">
                             <button onClick={() => setEditingId(null)} className="px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">Batal</button>
                             <button onClick={handleEditSubmit} className="px-3 py-1.5 text-xs font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">Kirim Ulang</button>
                           </div>
                         </div>
                      ) : (
                        m.content || (m.parts && m.parts.map((p: any) => p.type === 'text' ? p.text : '').join('')) || ''
                      )}
                    </div>
                  )}

                  {/* Assistant Hover Action */}
                  {m.role === "assistant" && (
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-white/5 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => copyToClipboard(m.content || (m.parts && m.parts.map((p: any) => p.type === 'text' ? p.text : '').join('')) || '', m.id)}
                        className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
                        title="Salin jawaban"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-500">Tersalin</span>
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

                  {/* User Hover Actions */}
                  {m.role === "user" && editingId !== m.id && (
                    <div className="mt-2 pt-2 border-t border-blue-100 dark:border-white/10 flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => copyToClipboard(m.content || (m.parts && m.parts.map((p: any) => p.type === 'text' ? p.text : '').join('')) || '', m.id)}
                        className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                        title="Salin pesan"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-500">Tersalin</span>
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
                        className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                        title="Edit pesan"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </div>
                  )}
                </div>

                {m.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0 mt-1 text-white text-[10px] font-bold">
                    S
                  </div>
                )}
              </div>
            ))
          )}

          {/* Loading Bubble */}
          {isLoading && (
            <div className="flex gap-3 justify-start animate-pulse">
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="relative w-6 h-6">
                  <Image src="/logo_1.png" alt="Agens" fill className="object-contain" />
                </div>
              </div>
              <div className="rounded-2xl px-5 py-4 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: "0.2s" }} />
                <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          )}

          <div ref={bottomRef} className="h-4" />
        </div>
      </div>

      {/* GEMINI-STYLE INPUT BAR */}
      <div className="w-full px-3 sm:px-6 pb-4 pt-2 z-10 shrink-0">
        
        {/* Upload previews */}
        {(attachments.length > 0 || folderName) && (
          <div className="max-w-3xl mx-auto flex flex-wrap gap-2 mb-3 px-2">
            {attachments.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-gray-100 dark:bg-white/10 px-3 py-1.5 rounded-full text-sm text-gray-700 dark:text-gray-200">
                <ImageIcon className="w-4 h-4 text-blue-500" />
                <span className="truncate max-w-[120px]">{file.name}</span>
                <button type="button" onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))} className="text-gray-400 hover:text-red-500 ml-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {folderName && (
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/10 px-3 py-1.5 rounded-full text-sm text-gray-700 dark:text-gray-200">
                <Folder className="w-4 h-4 text-amber-500" />
                <span className="truncate max-w-[150px]">{folderName}</span>
                <button type="button" onClick={() => { setFolderName(""); setFolderContext(""); }} className="text-gray-400 hover:text-red-500 ml-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Hidden inputs */}
        <input type="file" multiple accept="image/*" ref={fileInputRef} className="hidden" onChange={(e) => { if (e.target.files) { setAttachments(prev => [...prev, ...Array.from(e.target.files!)]); } }} />
        <input type="file" /* @ts-expect-error */ webkitdirectory="" directory="" ref={folderInputRef} className="hidden" onChange={processFolder} />

        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            const finalPrompt = folderContext ? `${folderContext}\n${localInput.trim()}` : localInput.trim();
            if ((finalPrompt || attachments.length > 0) && !isLoading) {
              append({ 
                role: "user", 
                content: finalPrompt,
                experimental_attachments: attachments.length > 0 ? attachments : undefined
              });
              setLocalInput("");
              setAttachments([]);
              setFolderContext("");
              setFolderName("");
            }
          }}
          className="max-w-3xl mx-auto flex items-end bg-gray-100 dark:bg-[#1e1f20] rounded-[28px] border border-gray-200/80 dark:border-[#3c4043]/80 focus-within:border-blue-400/50 dark:focus-within:border-blue-400/30 transition-all shadow-sm hover:shadow-md p-1.5"
        >
          {/* Plus / Attachment Button */}
          <div className="relative">
            <button 
              type="button" 
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors"
              title="Lampiran"
            >
              <Plus className="w-5 h-5" />
            </button>

            {/* Attach dropdown */}
            {showAttachMenu && (
              <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-[#2b2d30] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl py-1 w-48 z-50">
                <button
                  type="button"
                  onClick={() => { fileInputRef.current?.click(); setShowAttachMenu(false); }}
                  className="flex items-center gap-3 px-4 py-2.5 w-full text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                  <ImageIcon className="w-4 h-4 text-blue-500" />
                  <span>Unggah Gambar</span>
                </button>
                <button
                  type="button"
                  onClick={() => { folderInputRef.current?.click(); setShowAttachMenu(false); }}
                  className="flex items-center gap-3 px-4 py-2.5 w-full text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                  <Folder className="w-4 h-4 text-amber-500" />
                  <span>Unggah Folder</span>
                </button>
              </div>
            )}
          </div>

          {/* Text Input */}
          <textarea
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                formRef.current?.requestSubmit();
              }
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
            }}
            placeholder="Tanyakan sesuatu kepada Agens..."
            rows={1}
            className="flex-1 bg-transparent text-gray-900 dark:text-gray-100 px-2 py-2.5 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 text-sm resize-none max-h-[200px] overflow-y-auto"
          />

          {/* Model Selector */}
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-transparent text-gray-500 dark:text-gray-400 border-none px-1 py-1 focus:outline-none focus:ring-0 cursor-pointer text-xs max-w-[100px] truncate hidden sm:block"
          >
            <option className="bg-white dark:bg-[#1e1f20]" value="gemini-2.5-flash">Gemini 2.5 Flash</option>
            <option className="bg-white dark:bg-[#1e1f20]" value="llama3-70b-8192">Llama 3 70B</option>
            <option className="bg-white dark:bg-[#1e1f20]" value="meta-llama/llama-3.1-8b-instruct:free">Llama 3.1 8B Free</option>
          </select>

          {/* Send Button */}
          <button
            type="submit"
            disabled={isLoading || (!localInput.trim() && attachments.length === 0)}
            className="p-2.5 text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-center text-[11px] text-gray-400 dark:text-gray-500 mt-3 hidden sm:block">
          Agens dapat membuat kesalahan. Harap periksa info penting.
        </p>
      </div>
    </div>
  );
}
