import React from "react";

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
      {/* Modern Minimalist Robot / Spark AI Icon */}
      <div
        className={`${iconSizeClass} relative rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#3B82F6] p-[1px] shadow-[0_0_15px_rgba(37,99,235,0.45)] flex items-center justify-center flex-shrink-0 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.65)] transition-all duration-300`}
      >
        <div className="w-full h-full rounded-[11px] bg-gradient-to-br from-[#1d4ed8] via-[#2563EB] to-[#3b82f6] flex items-center justify-center p-1.5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-white drop-shadow-sm"
          >
            {/* Top Spark AI Antenna */}
            <path
              d="M12 2V5M12 2C12.8 3.5 13.5 4.2 15 5C13.5 5.8 12.8 6.5 12 8C11.2 6.5 10.5 5.8 9 5C10.5 4.2 11.2 3.5 12 2Z"
              fill="#FFFFFF"
            />
            {/* Robot Head Outer Geometric Shield */}
            <rect
              x="4"
              y="7"
              width="16"
              height="13"
              rx="4"
              stroke="#FFFFFF"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            {/* Minimalist Robot Visor / Luminous Eyes */}
            <circle cx="9" cy="13.5" r="1.5" fill="#FFFFFF" />
            <circle cx="15" cy="13.5" r="1.5" fill="#FFFFFF" />
            {/* High-tech Connection Line / Chin accent */}
            <path
              d="M8.5 17H15.5"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Subtle Side Cyber Ears / Bolts */}
            <rect x="2" y="11" width="1.5" height="5" rx="0.75" fill="#FFFFFF" />
            <rect x="20.5" y="11" width="1.5" height="5" rx="0.75" fill="#FFFFFF" />
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex items-center gap-1.5">
          <span className={`font-bold tracking-tight text-white ${textSizeClass}`}>
            Agent
          </span>
          <span
            className={`font-black tracking-tight px-1.5 py-0.5 rounded-md bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white text-xs uppercase shadow-[0_0_10px_rgba(37,99,235,0.4)] ${
              size === "lg" ? "text-sm" : ""
            }`}
          >
            AI
          </span>
        </div>
      )}
    </div>
  );
}
