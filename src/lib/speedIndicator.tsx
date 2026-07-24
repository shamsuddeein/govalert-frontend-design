export type SpeedTier = "fast" | "moderate" | "slow" | "unreachable";

export function speedTier(ms: number | null | undefined): SpeedTier {
  if (ms == null || ms <= 0) return "unreachable";
  if (ms < 2000) return "fast";
  if (ms <= 6000) return "moderate";
  return "slow";
}

export function speedLabel(ms: number | null | undefined): string {
  if (ms == null || ms <= 0) return "Offline";
  const sec = (ms / 1000).toFixed(1);
  if (ms < 2000) return `Fast (${sec}s)`;
  if (ms <= 6000) return `Moderate (${sec}s)`;
  return `Slow (${sec}s)`;
}

interface SpeedDotsProps {
  ms: number | null | undefined;
  showLabel?: boolean;
  className?: string;
}

export function SpeedDots({ ms, className = "" }: SpeedDotsProps) {
  const tier = speedTier(ms);
  const label = speedLabel(ms);

  let style = "bg-[#0a5c38]/10 text-[#0a5c38] dark:bg-[#3fb68e]/15 dark:text-[#3fb68e] border-[#0a5c38]/20";

  if (tier === "unreachable") {
    style = "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30";
  } else if (tier === "slow") {
    style = "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30";
  } else if (tier === "moderate") {
    style = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-[4px] border text-[11px] font-sans font-semibold shrink-0 transition-colors select-none ${style} ${className}`}
      title={label}
    >
      {label}
    </span>
  );
}