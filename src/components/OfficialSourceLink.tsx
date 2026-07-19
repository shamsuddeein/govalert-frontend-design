import React from "react";
import { ExternalLink, Link2Off } from "lucide-react";

export interface OfficialSourceLinkProps {
  url?: string | null;
  agencyShort?: string;
  className?: string;
  label?: string;
}

export function OfficialSourceLink({
  url,
  agencyShort,
  className = "",
  label = "OFFICIAL SOURCE",
}: OfficialSourceLinkProps) {
  const isValidUrl =
    typeof url === "string" &&
    url.trim() !== "" &&
    url.trim() !== "#" &&
    (url.startsWith("http://") || url.startsWith("https://"));

  if (!isValidUrl) {
    return (
      <span
        title="Official direct portal URL is not provided in source notice"
        className={`inline-flex items-center gap-1 font-sans text-xs font-semibold text-muted-foreground/70 cursor-not-allowed select-none ${className}`}
      >
        <Link2Off className="size-3.5 opacity-60" />
        <span>NO DIRECT LINK</span>
      </span>
    );
  }

  return (
    <a
      href={url.trim()}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-1 font-sans text-xs font-semibold text-[#0a5c38] dark:text-[#3fb68e] hover:underline transition-colors ${className}`}
    >
      <span>{label}</span>
      <ExternalLink className="size-3" />
    </a>
  );
}
