import React from "react";
import { cn } from "../lib/utils";

interface TrustScoreBadgeProps {
  score?: number | null;
  className?: string;
  showLabel?: boolean;
}

export function TrustScoreBadge({ score = 85, className, showLabel = true }: TrustScoreBadgeProps) {
  const safeScore = Math.max(0, Math.min(100, Math.round(score ?? 85)));

  let colorStyle = "bg-[#0a5c38]/10 text-[#0a5c38] dark:bg-[#3fb68e]/15 dark:text-[#3fb68e] border-[#0a5c38]/30 dark:border-[#3fb68e]/30";
  let dotColor = "bg-[#0a5c38] dark:bg-[#3fb68e]";
  let label = "HIGH TRUST";

  if (safeScore < 50) {
    colorStyle = "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30";
    dotColor = "bg-red-500";
    label = "CAUTION";
  } else if (safeScore < 80) {
    colorStyle = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
    dotColor = "bg-amber-500";
    label = "MODERATE";
  }

  return (
    <div
      title={`Verification Trust Score: ${safeScore}/100 — Domain, gazette, and AI authenticity metrics.`}
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] border text-[11px] font-mono font-bold shrink-0 transition-colors select-none",
        colorStyle,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0 animate-pulse", dotColor)} />
      <span>TRUST: {safeScore}/100</span>
      {showLabel && (
        <span className="text-[9px] font-sans font-bold uppercase tracking-wider px-1 py-0.2 rounded bg-black/5 dark:bg-white/10 ml-0.5">
          {label}
        </span>
      )}
    </div>
  );
}
