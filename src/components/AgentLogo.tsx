"use client";

import React from "react";

interface AgentLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function AgentLogo({ className = "", size = "md", showText = true }: AgentLogoProps) {
  const iconSizeClass = {
    sm: "w-7 h-7 text-[10px]",
    md: "w-8 h-8 text-xs",
    lg: "w-10 h-10 text-sm",
  }[size];

  const textSizeClass = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* AS Logo Mark */}
      <div
        className={`${iconSizeClass} relative rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 font-bold text-white shadow-lg flex items-center justify-center flex-shrink-0 group-hover:shadow-[0_0_20px_rgba(124,58,237,0.65)] transition-all duration-300`}
      >
        AS
      </div>

      {/* Brand Typography */}
      {showText && (
        <span className={`font-bold tracking-wide text-white ${textSizeClass}`}>
          Agens
        </span>
      )}
    </div>
  );
}
