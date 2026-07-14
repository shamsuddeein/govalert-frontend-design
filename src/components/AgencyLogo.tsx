import { useState } from "react";
import { agenciesData } from "../lib/agenciesData";

function domainFor(short: string): string | null {
  const a = agenciesData.find((x) => x.short.toUpperCase() === short.toUpperCase());
  if (!a) return null;
  try {
    return new URL(a.officialWebsite).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

interface Props {
  short: string;
  size?: number;
  className?: string;
  rounded?: string;
}

/**
 * Renders the real favicon/logo of a government agency via Google's public
 * favicon service. Falls back to a mono acronym chip if the image fails.
 */
export function AgencyLogo({ short, size = 40, className = "", rounded = "rounded-[6px]" }: Props) {
  const [failed, setFailed] = useState(false);
  const domain = domainFor(short);
  const src = domain
    ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
    : null;

  const boxCls = `grid place-items-center overflow-hidden border border-border bg-white dark:bg-[#1a2230] ${rounded} ${className}`;
  const style = { width: size, height: size } as const;

  if (!src || failed) {
    return (
      <span
        className={`${boxCls} font-mono font-bold text-muted-foreground`}
        style={{ ...style, fontSize: Math.max(9, Math.round(size * 0.28)) }}
      >
        {short}
      </span>
    );
  }

  return (
    <span className={boxCls} style={style}>
      <img
        src={src}
        alt={`${short} logo`}
        width={Math.round(size * 0.7)}
        height={Math.round(size * 0.7)}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="object-contain"
      />
    </span>
  );
}