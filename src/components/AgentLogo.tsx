"use client";

import React from "react";
import Image from "next/image";

interface AgentLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function AgentLogo({ className = "", size = "md", showText = true }: AgentLogoProps) {
  const iconSizeClass = {
    sm: "w-7 h-7",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  }[size];

  const textSizeClass = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Logo Image */}
      <div className={`relative flex items-center justify-center flex-shrink-0 transition-all duration-300 ${iconSizeClass}`}>
        <Image
          src="/logo_1.png"
          alt="Agens Logo"
          fill
          className="object-contain dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
          priority
        />
      </div>

      {/* Brand Typography */}
      {showText && (
        <span className={`font-bold tracking-wide text-gray-900 dark:text-white ${textSizeClass}`}>
          Agens
        </span>
      )}
    </div>
  );
}
