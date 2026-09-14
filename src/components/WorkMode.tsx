"use client";

import { useState } from "react";
import { Bot, LineChart, TrendingUp, Presentation, Play, Download } from "lucide-react";

export function WorkMode() {
  const [model, setModel] = useState("gemini-1.5-flash");
  const [isWorking, setIsWorking] = useState(false);
  const [carouselPreview, setCarouselPreview] = useState<any>(null);

  const runAction = async (type: string) => {
    setIsWorking(true);
    setCarouselPreview(null);
    try {
      // Simulate API call or call real API
      if (type === "crypto") {
        const res = await fetch("/api/cron/research");
        const json = await res.json();
        if (json.success) {
          setCarouselPreview(json.data);
        }
      } else {
        // Mocking for other buttons for now
        await new Promise((r) => setTimeout(r, 2000));
        setCarouselPreview({
          asset: type === "saham" ? "BBCA" : "SIGNAL",
          sentiment: "Bullish",
          summary: "Market is showing strong upward momentum with high volume.",
          image_url: "https://image.pollinations.ai/prompt/futuristic%203D%20finance%20chart%20bullish?width=800&height=450&nologo=true"
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#212121] p-4 sm:p-8 overflow-y-auto scrollbar-none">
      <div className="max-w-4xl mx-auto w-full space-y-10 mt-10">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto shadow-lg border border-white/5">
            <Bot className="w-8 h-8 text-gray-300" />
          </div>
          <h1 className="text-3xl font-bold text-gray-100">Apa yang harus kita kerjakan?</h1>
        </div>

        {/* Input Bar */}
        <div className="bg-[#2f2f2f] rounded-2xl p-2 border border-white/10 flex items-center shadow-lg focus-within:border-white/20 transition-colors">
          <select 
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="bg-transparent text-gray-400 text-sm pl-3 pr-8 py-2 focus:outline-none cursor-pointer appearance-none border-r border-white/10"
          >
            <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
            <option value="gemini-2.0">Gemini 2.0</option>
          </select>
          <input 
            placeholder="Kerjakan apa saja..." 
            className="flex-1 bg-transparent text-gray-100 px-4 py-3 focus:outline-none placeholder-gray-500"
          />
          <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors">
            <Play className="w-5 h-5" />
          </button>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionCard 
            icon={<LineChart className="w-5 h-5 text-cyan-400" />}
            title="Riset Crypto Harian"
            desc="Hook + 3-5 Berita + Gambar"
            onClick={() => runAction("crypto")}
            disabled={isWorking}
          />
          <ActionCard 
            icon={<Presentation className="w-5 h-5 text-purple-400" />}
            title="Riset Saham IHSG/Indo"
            desc="BBCA, BBRI, dll."
            onClick={() => runAction("saham")}
            disabled={isWorking}
          />
          <ActionCard 
            icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
            title="Scan Sinyal Bullish"
            desc="Volume & Price Breakout"
            onClick={() => runAction("signal")}
            disabled={isWorking}
          />
        </div>

        {/* Feed Hasil Riset */}
        {isWorking && (
          <div className="flex flex-col items-center justify-center py-12 opacity-70 animate-pulse">
            <Bot className="w-10 h-10 text-gray-400 mb-4 animate-bounce" />
            <p className="text-gray-400">Agent sedang bekerja menyusun laporan...</p>
          </div>
        )}

        {carouselPreview && !isWorking && (
          <div className="mt-12 bg-[#2a2a2a] border border-white/5 rounded-2xl p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-gray-100">Carousel Studio Preview</h3>
                <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                  carouselPreview.sentiment === 'Bullish' ? 'bg-emerald-500/20 text-emerald-400' : 
                  carouselPreview.sentiment === 'Bearish' ? 'bg-rose-500/20 text-rose-400' : 
                  'bg-amber-500/20 text-amber-400'
                }`}>
                  {carouselPreview.sentiment}
                </span>
              </div>
              <button className="flex items-center gap-2 text-sm font-medium bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                Download Semua Slide
              </button>
            </div>

            {/* Slide Previews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cover Slide */}
              <div className="bg-[#1e1e1e] rounded-xl overflow-hidden border border-white/5 shadow-inner">
                <img src={carouselPreview.image_url} alt="Cover" className="w-full aspect-video object-cover" />
                <div className="p-4">
                  <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider mb-2">Slide 1 (Cover)</p>
                  <h4 className="font-bold text-gray-100 text-lg leading-tight">Berita Hangat: {carouselPreview.asset} Sedang Bergejolak!</h4>
                </div>
              </div>

              {/* Detail Slide */}
              <div className="bg-[#1e1e1e] rounded-xl overflow-hidden border border-white/5 shadow-inner">
                <div className="w-full aspect-video bg-[#2f2f2f] flex flex-col items-center justify-center p-6 text-center">
                  <h4 className="text-xl font-bold text-white mb-2">{carouselPreview.asset} Update</h4>
                  <p className="text-gray-400 text-sm">{carouselPreview.summary}</p>
                </div>
                <div className="p-4">
                  <p className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-2">Slide 2 (Detail)</p>
                  <p className="text-sm text-gray-300 line-clamp-2">{carouselPreview.summary}</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function ActionCard({ icon, title, desc, onClick, disabled }: any) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className="flex flex-col items-start text-left p-5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
    >
      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-bold text-gray-200 mb-1">{title}</h3>
      <p className="text-xs text-gray-500">{desc}</p>
    </button>
  );
}
