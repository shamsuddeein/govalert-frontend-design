// Shared speed indicator: converts response-time ms into a 3-dot glyph
// per the design system (banned: raw ms shown to end users).
// Fast <400ms  = ●●●   OK 400-700ms = ●●○   Slow >700ms = ●○○

export type SpeedTier = "fast" | "ok" | "slow" | "unknown";

export function speedTier(ms: number | null | undefined): SpeedTier {
  if (ms == null) return "unknown";
  if (ms < 400) return "fast";
  if (ms <= 700) return "ok";
  return "slow";
}

export function speedLabel(tier: SpeedTier): string {
  switch (tier) {
    case "fast": return "Fast";
    case "ok": return "OK";
    case "slow": return "Slow";
    default: return "No data";
  }
}

interface SpeedDotsProps {
  ms: number | null | undefined;
  showLabel?: boolean;
  className?: string;
}

export function SpeedDots({ ms, showLabel = false, className = "" }: SpeedDotsProps) {
  const tier = speedTier(ms);
  const filled = tier === "fast" ? 3 : tier === "ok" ? 2 : tier === "slow" ? 1 : 0;
  const color =
    tier === "slow"
      ? "text-[color:var(--status-urgent,#b45309)]"
      : tier === "unknown"
        ? "text-muted-foreground"
        : "text-[#0a5c38] dark:text-[#3fb68e]";

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono text-[12px] ${color} ${className}`}
      aria-label={`Response speed: ${speedLabel(tier)}`}
      title={`Response speed: ${speedLabel(tier)}`}
    >
      <span aria-hidden className="tracking-[2px]">
        {[0, 1, 2].map((i) => (
          <span key={i} className={i < filled ? "" : "opacity-25"}>
            ●
          </span>
        ))}
      </span>
      {showLabel && <span className="text-foreground">{speedLabel(tier)}</span>}
    </span>
  );
}