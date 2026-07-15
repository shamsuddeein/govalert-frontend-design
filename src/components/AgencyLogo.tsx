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
  const [srcIdx, setSrcIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  const agency = agenciesData.find((x) => x.short.toUpperCase() === short.toUpperCase());
  const domain = agency ? (() => {
    try {
      return new URL(agency.officialWebsite).hostname.replace(/^www\./, "");
    } catch {
      return null;
    }
  })() : null;

  const sources = domain
    ? [
        `https://logo.clearbit.com/${domain}?size=128`,
        `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
        `https://icons.duckduckgo.com/ip3/${domain}.ico`,
      ]
    : [];
  const src = sources[srcIdx] ?? null;

  const boxCls = `relative grid place-items-center overflow-hidden border border-border bg-white dark:bg-[#1a2230] ${rounded} ${className} focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a5c38] dark:focus-visible:ring-[#3fb68e] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background`;
  const style = { width: size, height: size } as const;
  const altText = agency ? `${agency.name} official logo` : `${short} official logo`;

  if (!src) {
    const fallbackBoxCls = `relative inline-flex items-center justify-center overflow-hidden bg-[#0a5c38] text-white font-sans font-bold tracking-wide ${rounded} ${className} focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a5c38] focus-visible:ring-offset-2`;
    return (
      <span
        tabIndex={0}
        role="img"
        aria-label={altText}
        className={fallbackBoxCls}
        style={{ ...style, fontSize: 12 }}
      >
        {short}
      </span>
    );
  }

  return (
    <span className={boxCls} style={style} tabIndex={0} role="img" aria-label={altText}>
      {loading && (
        <span className="absolute inset-0 animate-pulse bg-muted/80 dark:bg-muted/40" />
      )}
      <img
        key={src}
        src={src}
        alt=""
        width={Math.round(size * 0.7)}
        height={Math.round(size * 0.7)}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoading(false)}
        onError={() => {
          if (srcIdx < sources.length - 1) {
            setSrcIdx(srcIdx + 1);
          } else {
            setSrcIdx(sources.length);
            setLoading(false);
          }
        }}
        className={`object-contain transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
      />
    </span>
  );
}