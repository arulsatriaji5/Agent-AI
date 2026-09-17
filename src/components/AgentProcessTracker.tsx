"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, CheckCircle2, Loader2, Bot } from "lucide-react";

interface AgentProcessTrackerProps {
  isProcessing: boolean;
  completionTime?: number; // Optional final time if processing is done
}

export function AgentProcessTracker({ isProcessing, completionTime }: AgentProcessTrackerProps) {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isExpanded, setIsExpanded] = useState(isProcessing); // Expand by default while processing
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isProcessing) {
      setSecondsElapsed(0);
      setActiveStep(0);
      setIsExpanded(true);
      
      timer = setInterval(() => {
        setSecondsElapsed((prev) => {
          const next = prev + 1;
          // Progress steps based on time roughly
          if (next === 1) setActiveStep(0);
          if (next === 2) setActiveStep(1);
          if (next === 4) setActiveStep(2);
          if (next === 6) setActiveStep(3);
          return next;
        });
      }, 1000);
    } else {
      if (secondsElapsed > 0) {
        setIsExpanded(false); // Collapse when done
      }
    }
    return () => clearInterval(timer);
  }, [isProcessing]);

  const steps = [
    "Mengurai intensi & prompt pengguna",
    "Mengambil data pasar real-time",
    "Menjalankan sintesis analisis Gemini",
    "Merender aset visual (jika ada)"
  ];

  // If not processing and no completion time, and we haven't started, return null
  if (!isProcessing && secondsElapsed === 0 && !completionTime) return null;

  const displayTime = isProcessing ? secondsElapsed : (completionTime || secondsElapsed);

  return (
    <div className="bg-[#2f2f2f]/80 border border-white/10 rounded-xl overflow-hidden w-full max-w-sm my-2">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/20 p-1.5 rounded-full">
            {isProcessing ? (
               <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
            ) : (
               <Bot className="w-4 h-4 text-emerald-400" />
            )}
          </div>
          <span className="text-sm font-medium text-gray-300">
            {isProcessing ? `Memproses selama ${displayTime}s...` : `Selesai dalam ${displayTime}s`}
          </span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 pt-1 space-y-3">
          {steps.map((step, idx) => {
            const isCompleted = !isProcessing || idx < activeStep;
            const isCurrent = isProcessing && idx === activeStep;
            const isPending = isProcessing && idx > activeStep;

            return (
              <div key={idx} className={`flex items-start gap-3 ${isPending ? 'opacity-40' : 'opacity-100'}`}>
                <div className="mt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-gray-600 rounded-full" />
                  )}
                </div>
                <span className={`text-xs ${isCurrent ? 'text-blue-300 animate-pulse font-medium' : 'text-gray-400'}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
