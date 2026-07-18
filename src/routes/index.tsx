import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Nav, Footer } from "../components/layout";
import { AgencyLogo } from "../components/AgencyLogo";
import { agenciesData } from "../lib/agenciesData";
import { api, ApiAgency, ApiJob, ApiSystemStatus, ApiLiveFeedItem } from "../lib/api";

export const Route = createFileRoute("/")({
  component: Index,
});

export type Status = "verified" | "urgent" | "new" | "updating" | "closed" | "no-change" | "warning";

export interface Job {
  id: string;
  agency: string;
  agencyShort: string;
  title: string;
  deadline: string;
  status: Status;
  detected: string;
  category: string;
  state: string;
  createdAt: string;
  positions?: string;
}

export const latestJobs: Job[] = [
  {
    id: "8829-GA",
    agency: "NNPC Limited",
    agencyShort: "NNPC",
    title: "Graduate Trainee Program (Engineering Intake)",
    deadline: new Date(Date.now() + 12 * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    status: "urgent",
    detected: "2h ago",
    category: "Engineering & Energy",
    state: "Rivers",
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    positions: "Multiple Openings",
  },
  {
    id: "4120-GA",
    agency: "Nigeria Customs Service",
    agencyShort: "NCS",
    title: "Superintendent Cadre Recruitment",
    deadline: new Date(Date.now() + 21 * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    status: "verified",
    detected: "6h ago",
    category: "Revenue & Finance",
    state: "Cross River",
    createdAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    positions: "Cadre Officers",
  },
  {
    id: "9001-GA",
    agency: "EFCC Academy",
    agencyShort: "EFCC",
    title: "Detective Assistant Cadet Course",
    deadline: new Date(Date.now() + 15 * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    status: "verified",
    detected: "1d ago",
    category: "Law Enforcement",
    state: "Abuja",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    positions: "Cadet Intake",
  },
  {
    id: "7712-GA",
    agency: "Central Bank of Nigeria",
    agencyShort: "CBN",
    title: "Economic Policy Analysts (Level 7)",
    deadline: "Pending",
    status: "warning",
    detected: "3h ago",
    category: "Revenue & Finance",
    state: "Lagos",
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    positions: "Analyst Openings",
  },
  {
    id: "6650-GA",
    agency: "Nigerian Air Force",
    agencyShort: "NAF",
    title: "Direct Short Service Commission (DSSC 33)",
    deadline: "Closed",
    status: "closed",
    detected: "2d ago",
    category: "Military & Paramilitary",
    state: "Kaduna",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    positions: "DSSC Officers",
  },
  {
    id: "5581-GA",
    agency: "Federal Fire Service",
    agencyShort: "FFS",
    title: "General Duty Officers Batch B",
    deadline: new Date(Date.now() + 28 * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    status: "verified",
    detected: "5h ago",
    category: "Military & Paramilitary",
    state: "Abuja",
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    positions: "General Duty",
  },
];

export function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, { label: string; cls: string; icon: React.ReactNode }> = {
    verified: {
      label: "Verified",
      cls: "bg-[#0a5c38] text-white dark:bg-[#3fb68e] dark:text-[#0c1015]",
      icon: (
        <svg className="size-[10px] fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
        </svg>
      ),
    },
    urgent: {
      label: "Urgent",
      cls: "bg-[#b45309] text-white",
      icon: (
        <svg className="size-[10px] fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      ),
    },
    new: {
      label: "New Opening",
      cls: "bg-[#0e6b8a] text-white",
      icon: (
        <svg className="size-[10px] fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      ),
    },
    updating: {
      label: "Updating",
      cls: "bg-[#3b4bbf] text-white",
      icon: (
        <svg className="size-[10px] fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      ),
    },
    warning: {
      label: "Warning",
      cls: "bg-[#b45309] text-white",
      icon: (
        <svg className="size-[10px] fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      ),
    },
    closed: {
      label: "Closed",
      cls: "bg-muted text-muted-foreground border border-border",
      icon: (
        <svg className="size-[10px] fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    "no-change": {
      label: "No Changes",
      cls: "bg-muted text-muted-foreground border border-border",
      icon: (
        <svg className="size-[10px] fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
        </svg>
      ),
    },
  };
  const s = map[status] || map.verified;
  return (
    <span
      className={`inline-flex items-center gap-[4px] rounded-[6px] px-[10px] py-[4px] text-[11px] font-semibold font-sans uppercase tracking-[0.06em] ${s.cls}`}
    >
      {s.icon}
      {s.label}
    </span>
  );
}

function Hero({
  searchQuery,
  setSearchQuery,
  onTagClick,
  liveFeed,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onTagClick: (tag: string) => void;
  liveFeed: ApiLiveFeedItem[];
}) {
  const [inputValue, setInputValue] = useState(searchQuery);
  const [showLiveFeed, setShowLiveFeed] = useState(false);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(inputValue);
    document.getElementById("recruitments")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBrowseJobs = () => {
    document.getElementById("recruitments")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-12 bg-background">
      <div className="mx-auto max-w-[1184px] px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:items-center">
          
          {/* Left Side Info */}
          <div className="space-y-6 text-left">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
              <span className="relative flex h-2 w-2">
                <span className="pulsing-dot absolute inline-flex h-full w-full rounded-full bg-[#0a5c38] dark:bg-[#3fb68e] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0a5c38] dark:bg-[#3fb68e]"></span>
              </span>
              <span>FEDERAL RECRUITMENT MONITOR &middot; LIVE</span>
            </div>

            <h1 className="text-[36px] md:text-[44px] font-semibold tracking-tight text-foreground leading-[1.15] max-w-[560px]">
              Nigeria's verified<br />
              recruitment <span className="text-[#0a5c38] dark:text-[#3fb68e]">intelligence.</span>
            </h1>

            <p className="text-[15px] leading-relaxed text-muted-foreground max-w-[440px]">
              Automated surveillance and verification across 41 federal MDA recruitment portals.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={handleBrowseJobs}
                className="h-[44px] rounded-[8px] bg-[#0a5c38] hover:bg-[#0f7a4a] text-white dark:bg-[#3fb68e] dark:hover:bg-[#3fb68e]/90 dark:text-[#0c1015] px-6 text-sm font-semibold transition-transform active:scale-[0.98] cursor-pointer"
              >
                Browse Jobs
              </button>
              <a
                href="https://t.me/GovAlert"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-[44px] items-center gap-2 rounded-[8px] border border-border bg-card text-[#0a5c38] dark:text-[#3fb68e] hover:bg-muted px-6 text-sm font-semibold transition-transform active:scale-[0.98] cursor-pointer"
              >
                <svg className="size-[14px] fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.53-1.39.51-.46-.01-1.33-.26-1.99-.47-.8-.27-1.44-.41-1.39-.87.03-.24.35-.49.97-.75 3.79-1.65 6.32-2.73 7.57-3.26 3.61-1.53 4.36-1.8 4.85-1.8.11 0 .35.03.5.15.13.12.17.27.18.39-.01.08-.01.18-.02.26z" />
                </svg>
                Get Alerts
              </a>
            </div>

            {/* Search console with attached button */}
            <div className="pt-4 max-w-[560px]">
              <form
                className="flex items-center rounded-[8px] border border-border bg-card p-0.5 focus-within:ring-2 focus-within:ring-[#0a5c38] dark:focus-within:ring-[#3fb68e] focus-within:ring-offset-2 transition-shadow"
                onSubmit={handleSubmit}
              >
                <div className="relative flex-1">
                  <svg
                    className="pointer-events-none absolute left-[12px] top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" />
                  </svg>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Search NNPC, Customs, EFCC, Police..."
                    className="w-full border-none bg-transparent py-3 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="h-[40px] px-5 rounded-[6px] bg-[#0a5c38] hover:bg-[#0f7a4a] text-white dark:bg-[#3fb68e] dark:hover:bg-[#3fb68e]/90 dark:text-[#0c1015] text-xs font-semibold cursor-pointer transition-colors"
                >
                  Search
                </button>
              </form>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground pt-1">
              <span>Quick tags:</span>
              {["NNPC", "Customs", "EFCC", "NAF", "CBN", "FIRS"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => onTagClick(tag)}
                  className={`rounded-[6px] border px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                    searchQuery.toLowerCase() === tag.toLowerCase()
                      ? "border-[#0a5c38] bg-muted text-[#0a5c38] dark:border-[#3fb68e] dark:text-[#3fb68e]"
                      : "border-border bg-card text-muted-foreground hover:border-[#0a5c38] hover:text-[#0a5c38] dark:hover:border-[#3fb68e] dark:hover:text-[#3fb68e]"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Mobile collapsible trigger for Live Feed */}
            <div className="lg:hidden pt-2">
              <button
                onClick={() => setShowLiveFeed(!showLiveFeed)}
                className="text-xs font-semibold text-[#0a5c38] dark:text-[#3fb68e] underline cursor-pointer"
              >
                {showLiveFeed ? "Hide live feed ▲" : "Show live feed ▼"}
              </button>
            </div>
          </div>

          {/* Right Side Live Feed Terminal */}
          <div className={`${showLiveFeed ? "block" : "hidden"} lg:block w-full max-w-full lg:max-w-[380px] justify-self-end bg-card border border-border rounded-[8px] p-5 text-left`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[11px] text-[#0a5c38] dark:text-[#3fb68e] tracking-wider font-bold">
                  LIVE FEED
                </span>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="pulsing-dot absolute inline-flex h-full w-full rounded-full bg-[#0a5c38] dark:bg-[#3fb68e] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#0a5c38] dark:bg-[#3fb68e]"></span>
                </span>
              </div>
              <span className="font-mono text-[11px] text-muted-foreground">Updated 1m ago</span>
            </div>

            <div className="border-t border-border/60 my-3" />

            <div className="space-y-4">
              {(liveFeed && liveFeed.length > 0
                ? liveFeed.slice(0, 4)
                : [
                    { agency_name: "NNPC Limited", event_type: "verified" as const, time_ago: "2m ago", agency_acronym: "NNPC" },
                    { agency_name: "Nigeria Customs Service", event_type: "verified" as const, time_ago: "6m ago", agency_acronym: "NCS" },
                    { agency_name: "Central Bank of Nigeria", event_type: "updating" as const, time_ago: "3h ago", agency_acronym: "CBN" },
                    { agency_name: "Nigeria Police Force", event_type: "urgent" as const, time_ago: "4d ago", agency_acronym: "NPF" },
                  ]
              ).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="font-sans text-[13px] font-semibold text-foreground">{item.agency_name} ({item.agency_acronym})</p>
                    <StatusBadge status={item.event_type === "urgent" ? "warning" : item.event_type === "new_opening" ? "new" : item.event_type === "verified" ? "verified" : "no-change"} />
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground self-start pt-1">{item.time_ago}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-border/60 mt-4 pt-3 flex items-center justify-between">
              <span className="font-mono text-[10px] text-muted-foreground">
                41 portals monitored &middot; 15m cycle
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function Stats({ status }: { status: ApiSystemStatus | null }) {
  const onlineCount = status?.agencies_online ?? 0;
  const maintenanceCount = status?.agencies_maintenance ?? 0;
  const offlineCount = status?.agencies_offline ?? 0;

  return (
    <div className="border-y border-border bg-card py-2.5">
      <div className="mx-auto max-w-[1184px] px-6 flex flex-wrap items-center justify-between gap-4 text-xs font-sans text-muted-foreground font-medium">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#0a5c38]" />
            <span>{onlineCount} Online</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#b45309]" />
            <span>{maintenanceCount} Maintenance</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#b91c1c]" />
            <span>{offlineCount} Down</span>
          </div>
        </div>
        <div className="font-mono text-[11px] text-muted-foreground flex flex-wrap items-center gap-x-4">
          <span>{status?.active_campaigns ?? 0} campaigns</span>
          <span>&middot;</span>
          <span>{status?.monitoring_interval_minutes ?? 15}m cycle</span>
          <span>&middot;</span>
          <span>Last audit {status?.last_audit_at ? new Date(status.last_audit_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now'}</span>
        </div>
      </div>
    </div>
  );
}

function LatestJobs({
  jobs,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}: {
  jobs: typeof latestJobs;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (c: string | null) => void;
}) {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const hasFilters = searchQuery !== "" || selectedCategory !== null;

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
  };

  return (
    <section id="recruitments" className="py-12 bg-background">
      <div className="mx-auto max-w-[1184px] px-6">
        <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-primary">Latest Verified Recruitments</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {hasFilters ? (
                <span>
                  Showing {jobs.length} results for{" "}
                  {selectedCategory && (
                    <span className="font-semibold text-primary">{selectedCategory}</span>
                  )}
                  {selectedCategory && searchQuery && " and "}
                  {searchQuery && (
                    <span className="font-semibold text-primary">"{searchQuery}"</span>
                  )}
                </span>
              ) : (
                "Authenticated public sector employment announcements."
              )}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {hasFilters && (
              <button
                onClick={handleClearFilters}
                className="text-xs font-medium text-muted-foreground underline decoration-1 underline-offset-4 hover:text-primary cursor-pointer"
              >
                Clear filters
              </button>
            )}
            
            {/* View Mode Switcher */}
            <div className="inline-flex rounded-[6px] border border-border p-0.5 bg-muted/20">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1 text-xs font-semibold rounded-[4px] cursor-pointer transition-colors ${
                  viewMode === "grid" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-primary"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1 text-xs font-semibold rounded-[4px] cursor-pointer transition-colors ${
                  viewMode === "table" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-primary"
                }`}
              >
                Table
              </button>
            </div>

            <Link
              to="/jobs"
              className="text-xs font-medium text-primary underline decoration-1 underline-offset-4 cursor-pointer"
            >
              View all listings &rarr;
            </Link>
          </div>
        </div>

        {jobs.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
              {jobs.map((job) => {
                const agencyDataObj = agenciesData.find((a) => a.short === job.agencyShort);
                const portalUrl = agencyDataObj ? agencyDataObj.recruitmentPortal : "#";
                const isClosed = job.status === "closed";

                return (
                  <div
                    key={job.id}
                    className={`group flex flex-col justify-between rounded-[8px] border border-border bg-card p-6 shadow-sm interactive-card ${
                      isClosed ? "opacity-65 bg-muted/5" : ""
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <AgencyLogo short={job.agencyShort} size={32} />
                          <span className="font-mono text-[11px] text-muted-foreground truncate">REF: {job.id}</span>
                        </div>
                        <StatusBadge status={job.status} />
                      </div>

                      <div>
                        <h3 className="text-[18px] font-semibold leading-snug text-foreground">
                          {job.title}
                        </h3>
                        <p className="mt-1 text-[13px] font-medium text-[#0a5c38] dark:text-[#3fb68e] hover:underline">
                          <Link to="/agencies/$agencyShort" params={{ agencyShort: job.agencyShort || job.agency || "NNPC" }}>
                            {job.agency}
                          </Link>
                        </p>
                      </div>

                      <div className="border-t border-border pt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[13px]">
                        <div>
                          <span className="block text-muted-foreground text-[12px]">Deadline</span>
                          <span className="font-medium text-foreground">{job.deadline}</span>
                        </div>
                        <div>
                          <span className="block text-muted-foreground text-[12px]">Positions</span>
                          <span className="font-medium text-foreground">{job.positions || "Multiple"}</span>
                        </div>
                        <div>
                          <span className="block text-muted-foreground text-[12px]">Published</span>
                          <span className="font-medium text-foreground">{job.detected}</span>
                        </div>
                        <div>
                          <span className="block text-muted-foreground text-[12px]">Verification</span>
                          <a
                            href={portalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium text-[#0a5c38] dark:text-[#3fb68e] hover:underline inline-flex items-center gap-1 text-[12px]"
                          >
                            OFFICIAL SOURCE
                            <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-3 flex justify-end">
                      <Link
                        to="/jobs/$jobId"
                        params={{ jobId: job.id }}
                        className="text-[13px] text-[#0a5c38] dark:text-[#3fb68e] hover:underline font-semibold"
                      >
                        View details &rarr;
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-[8px] border border-border bg-card shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/10 text-xs font-semibold text-muted-foreground uppercase">
                    <th className="p-4">Position</th>
                    <th className="p-4">Agency</th>
                    <th className="p-4">Published</th>
                    <th className="p-4">Deadline</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs">
                  {jobs.map((job) => {
                    const agencyDataObj = agenciesData.find((a) => a.short === job.agencyShort);
                    const portalUrl = agencyDataObj ? agencyDataObj.recruitmentPortal : "#";
                    const isClosed = job.status === "closed";

                    return (
                      <tr
                        key={job.id}
                        className={`hover:bg-muted/5 transition-colors ${
                          isClosed ? "opacity-65 bg-muted/5" : ""
                        }`}
                      >
                        <td className="p-4 font-bold text-primary">
                          <Link to="/jobs/$jobId" params={{ jobId: job.id }} className="hover:underline">
                            {job.title}
                          </Link>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <AgencyLogo short={job.agencyShort} size={24} />
                            <span className="text-muted-foreground font-semibold">{job.agencyShort}</span>
                          </div>
                        </td>
                        <td className="p-4 text-foreground/80">{job.detected}</td>
                        <td className="p-4 text-foreground/80">{job.deadline}</td>
                        <td className="p-4">
                          <StatusBadge status={job.status} />
                        </td>
                        <td className="p-4 text-right space-x-3">
                          <a
                            href={portalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary underline hover:text-accent font-semibold"
                          >
                            Source
                          </a>
                          <Link
                            to="/jobs/$jobId"
                            params={{ jobId: job.id }}
                            className="text-muted-foreground hover:text-primary font-semibold"
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="rounded-[8px] border border-dashed border-border bg-card py-10 text-center">
            <h3 className="text-sm font-bold text-primary">No openings found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search terms or category filter.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-3 inline-flex items-center gap-2 rounded-[6px] bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/95 cursor-pointer transition-colors"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function RecentlyUpdatedRecruitments({ liveFeed }: { liveFeed: ApiLiveFeedItem[] }) {
  return (
    <section className="py-10 bg-background border-t border-border">
      <div className="mx-auto max-w-[1184px] px-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-tight text-primary">Recently Updated Recruitments</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Live stream of scanning activities across monitored domains.
          </p>
        </div>

        <div className="rounded-[8px] border border-border bg-card divide-y divide-border/60 shadow-sm">
          {liveFeed.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No scan activities to display.
            </div>
          ) : (
            liveFeed.map((e, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 text-sm">
                <div className="space-y-1">
                  <p className="font-semibold text-primary">
                    {e.agency_name} ({e.agency_acronym})
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">
                      {e.event_type === "new_opening" && "New opening detected"}
                      {e.event_type === "verified" && "Manually verified"}
                      {e.event_type === "urgent" && "Critical outage / incident"}
                      {e.event_type === "no_changes" && "Checked: no changes"}
                    </span>
                    <span className="text-muted-foreground text-xs">&middot;</span>
                    <StatusBadge status={e.event_type === "urgent" ? "warning" : e.event_type === "new_opening" ? "new" : e.event_type === "verified" ? "verified" : "no-change"} />
                  </div>
                </div>
                <span className="font-mono text-xs text-muted-foreground">{e.time_ago}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function VettedArc({ score }: { score: number }) {
  const radius = 10;
  const stroke = 2.5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center gap-1.5">
      <svg className="size-5 transform -rotate-90">
        <circle
          className="text-border"
          strokeWidth={stroke}
          stroke="currentColor"
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          className="text-[#0a5c38] dark:text-[#3fb68e]"
          strokeWidth={stroke}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <span className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">
        Vetted {score}%
      </span>
    </div>
  );
}

function PortalHealth({ agencies }: { agencies: ApiAgency[] }) {
  return (
    <section id="health" className="py-16 bg-background border-t border-border">
      <div className="mx-auto max-w-[1184px] px-6">
        <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-primary">Portal Health</h2>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Real-time monitoring reachability and active openings.
            </p>
          </div>
          <Link
            to="/status"
            className="text-xs font-semibold text-primary underline decoration-1 underline-offset-4 cursor-pointer focus-visible:ring-1 focus-visible:ring-ring"
          >
            System Status Page &rarr;
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {agencies.length === 0 ? (
            Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="rounded-[8px] border border-border bg-card p-6 shadow-sm space-y-4 animate-pulse">
                <div className="h-6 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-10 bg-muted rounded w-full" />
              </div>
            ))
          ) : (
            agencies.slice(0, 8).map((a) => {
              const activeCount = a.jobs_available;

              const isOnline = a.status === "online";
              const isMaintenance = a.status === "maintenance";

              // Determine response time dots
              const resMs = a.response_time_ms ?? 500;
              let dots = null;
              if (resMs < 400) {
                dots = (
                  <span className="flex items-center gap-0.5 text-[#0a5c38] dark:text-[#3fb68e]">
                    <span>●</span><span>●</span><span>●</span>
                  </span>
                );
              } else if (resMs <= 700) {
                dots = (
                  <span className="flex items-center gap-0.5 text-[#0a5c38] dark:text-[#3fb68e]">
                    <span>●</span><span>●</span><span className="opacity-30">○</span>
                  </span>
                );
              } else {
                dots = (
                  <span className="flex items-center gap-0.5 text-[#b45309]">
                    <span>●</span><span className="opacity-30">○</span><span className="opacity-30">○</span>
                  </span>
                );
              }

              const lastCheckedText = a.last_checked
                ? new Date(a.last_checked).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : "Recently";

              const vettedScore = a.vetted_score ?? 90;

              return (
                <div
                  key={a.acronym}
                  className="rounded-[8px] border border-border bg-card p-6 shadow-sm flex flex-col justify-between space-y-4 interactive-card"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border/40 pb-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <AgencyLogo short={a.acronym} size={36} />
                        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground truncate">
                          {a.acronym}
                        </span>
                      </div>
                      <VettedArc score={vettedScore} />
                    </div>
                    
                    <div>
                      <h3 className="text-[16px] font-bold text-foreground truncate">{a.name}</h3>
                      
                      {/* Status Row */}
                      <div className="flex items-center gap-1.5 mt-1.5 text-[13px] font-medium">
                        <span className={`size-2 rounded-full ${
                          isOnline ? "bg-[#0a5c38]" : isMaintenance ? "bg-[#b45309]" : "bg-[#b91c1c]"
                        }`} />
                        <span className="text-foreground">
                          {isOnline ? "Online" : isMaintenance ? "Maintenance" : "Offline"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs border-t border-border/40 pt-3">
                      <div>
                        <span className="block text-muted-foreground">Jobs available</span>
                        <span className="font-semibold text-foreground">
                          {activeCount} {activeCount === 1 ? "opening" : "openings"}
                        </span>
                      </div>
                      <div>
                        <span className="block text-muted-foreground">Last checked</span>
                        <span className="font-mono text-foreground font-semibold">&thinsp;&#8635; {lastCheckedText}</span>
                      </div>
                      <div>
                        <span className="block text-muted-foreground">Response time</span>
                        <div className="font-sans text-[12px]">{dots}</div>
                      </div>
                      <div>
                        <span className="block text-muted-foreground">Verification</span>
                        <div className="mt-1 h-1.5 w-[80px] bg-muted dark:bg-[#242c38] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#0a5c38] dark:bg-[#3fb68e]"
                            style={{ width: `${vettedScore}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                    {a.portal_url ? (
                      <a
                        href={a.portal_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary underline hover:text-accent font-semibold"
                      >
                        Official website
                      </a>
                    ) : (
                      <span className="text-muted-foreground">No portal URL</span>
                    )}
                    <Link
                      to="/agencies/$agencyShort"
                      params={{ agencyShort: a.slug || a.acronym }}
                      className="text-muted-foreground hover:text-primary font-semibold"
                    >
                      View profile &rarr;
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

function AgencyDirectory({
  onAgencyFilter,
  agencies,
}: {
  onAgencyFilter: (agencyShort: string) => void;
  agencies: ApiAgency[];
}) {
  const topAgencies = [
    { short: "NNPC", name: "NNPC Limited" },
    { short: "NCS", name: "Customs Service" },
    { short: "EFCC", name: "EFCC Academy" },
    { short: "NAF", name: "Air Force" },
    { short: "CBN", name: "Central Bank" },
    { short: "FIRS", name: "FIRS Revenue" },
    { short: "NIMC", name: "Identity NIMC" },
    { short: "NPF", name: "Police Force" },
  ];

  return (
    <section className="border-t border-border bg-muted/20 py-10">
      <div className="mx-auto max-w-[1184px] px-6">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-primary">Agency Directory</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Filter verified bulletins by federal agency portal.
            </p>
          </div>
        </div>
        <div className="grid gap-2 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
          {topAgencies.map((a) => {
            const agencyObj = agencies.find((ad) => ad.acronym.toUpperCase() === a.short.toUpperCase());
            const website = agencyObj?.portal_url;

            return (
              <button
                key={a.short}
                onClick={() => onAgencyFilter(a.short)}
                className="group flex flex-col items-center justify-center text-center rounded-[8px] border border-border bg-card p-3 transition-colors cursor-pointer hover:border-[#0a5c38] dark:hover:border-[#3fb68e] focus:outline-none relative"
              >
                <AgencyLogo 
                  short={a.short} 
                  size={36} 
                  className="group-hover:border-[#0a5c38]/40 transition-colors" 
                />
                <p className="mt-1.5 text-[10px] font-bold text-primary truncate w-full">
                  {a.short}
                </p>
                {website && (
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1 text-[9px] font-semibold text-[#0a5c38] dark:text-[#3fb68e] hover:underline"
                  >
                    Visit Site &rarr;
                  </a>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function VerificationMethodology() {
  const steps = [
    { n: "1", label: "Stage 1", title: "Portal monitored", body: "Automated cron checking active government subdomains." },
    { n: "2", label: "Stage 2", title: "Content extracted", body: "File system checksum / DOM tree diff comparison triggered." },
    { n: "3", label: "Stage 3", title: "Official source verified", body: "DNS and federal gazette indices compared for authenticity." },
    { n: "4", label: "Stage 4", title: "Published", body: "Signed audit record dispatched to feeds and subscriber panels." },
  ];

  return (
    <section id="verification" className="border-t border-border bg-muted/20 py-16">
      <div className="mx-auto max-w-[1184px] px-6">
        <div className="mb-12">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0a5c38] dark:text-[#3fb68e]">
            AUDIT PIPELINE
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-primary">
            How verification works
          </h2>
        </div>

        {/* Desktop Stepper */}
        <div className="hidden md:flex items-start justify-between relative">
          {/* Horizontal Line behind */}
          <div className="absolute top-4.5 left-0 right-0 h-[2px] border-t-2 border-dashed border-[#e2ddd6] dark:border-[#242c38] -z-10" />

          {steps.map((s) => (
            <div key={s.n} className="flex-1 px-4 text-center flex flex-col items-center">
              {/* Circle */}
              <div className="size-9 rounded-full border-2 border-[#0a5c38] dark:border-[#3fb68e] bg-card flex items-center justify-center font-sans text-sm font-semibold text-[#0a5c38] dark:text-[#3fb68e] shadow-sm mb-4">
                {s.n}
              </div>
              <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#0a5c38] dark:text-[#3fb68e] mb-1">
                {s.label}
              </span>
              <h3 className="text-[14px] font-bold text-foreground mb-1.5">{s.title}</h3>
              <p className="text-[12px] text-muted-foreground leading-relaxed max-w-[200px]">
                {s.body}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile Vertical Stepper */}
        <div className="md:hidden space-y-8 relative pl-6">
          {/* Vertical dashed line */}
          <div className="absolute left-[17px] top-4 bottom-4 w-[2px] border-l-2 border-dashed border-[#e2ddd6] dark:border-[#242c38] -z-10" />

          {steps.map((s) => (
            <div key={s.n} className="flex gap-4">
              <div className="absolute left-0 size-9 rounded-full border-2 border-[#0a5c38] dark:border-[#3fb68e] bg-card flex items-center justify-center font-sans text-sm font-semibold text-[#0a5c38] dark:text-[#3fb68e]">
                {s.n}
              </div>
              <div className="pl-6 space-y-1">
                <span className="block font-sans text-[11px] font-bold uppercase tracking-wider text-[#0a5c38] dark:text-[#3fb68e]">
                  {s.label}
                </span>
                <h3 className="text-[15px] font-bold text-foreground">{s.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/verification"
            className="inline-flex h-[40px] items-center justify-center rounded-[6px] border border-border bg-card px-5 text-xs font-semibold text-primary hover:bg-muted transition-colors cursor-pointer"
          >
            Read full methodology &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}

function TelegramCTA() {
  return (
    <section className="py-16 bg-background border-t border-border">
      <div className="mx-auto max-w-2xl px-6 text-center space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-primary">
          Stay updated
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
          Receive verified recruitment alerts through our official Telegram channel. No spam. Only verified government opportunities.
        </p>
        <div className="pt-2">
          <a
            href="https://t.me/GovAlert"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-[44px] items-center justify-center rounded-[8px] bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-colors cursor-pointer"
          >
            Join Telegram
          </a>
        </div>
      </div>
    </section>
  );
}

function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [jobs, setJobs] = useState<ApiJob[]>([]);
  const [agencies, setAgencies] = useState<ApiAgency[]>([]);
  const [status, setStatus] = useState<ApiSystemStatus | null>(null);
  const [liveFeed, setLiveFeed] = useState<ApiLiveFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [jobsRes, agenciesRes, statusRes, liveFeedRes] = await Promise.all([
        api.getJobs({ page_size: 20 }),
        api.getAgencies({ page_size: 100 }),
        api.getSystemStatus(),
        api.getLiveFeed(),
      ]);

      if (jobsRes && jobsRes.results && jobsRes.results.length > 0) {
        const mappedJobs = jobsRes.results.map((j) => ({
          id: j.ref,
          agency: j.agency_name,
          agencyShort: j.agency_acronym,
          title: j.title,
          deadline: j.deadline || "Pending",
          status: (j.status === "new_opening" ? "new" : j.status) as Status,
          detected: new Date(j.published_at).toLocaleDateString(),
          category: j.category,
          state: j.location_state,
          createdAt: j.published_at,
          positions: j.positions || "Multiple Positions",
        }));
        setJobs(mappedJobs);
      } else {
        setJobs(latestJobs);
      }

      if (agenciesRes && agenciesRes.results) setAgencies(agenciesRes.results);
      if (statusRes) setStatus(statusRes);
      if (liveFeedRes && liveFeedRes.length > 0) setLiveFeed(liveFeedRes);
    } catch (err: any) {
      // Silently fall back to static data — don't crash the homepage
      console.warn("API unavailable, using static data:", err);
      setJobs(latestJobs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Poll live feed every 60 seconds
    const stopPolling = api.pollEndpoint(
      api.getLiveFeed,
      (data) => { if (data && data.length > 0) setLiveFeed(data); },
      60000
    );
    return stopPolling;
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      searchQuery === "" ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.agency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.agencyShort.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === null || job.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    document.getElementById("recruitments")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAgencyClick = (agencyShort: string) => {
    setSearchQuery(agencyShort);
    document.getElementById("recruitments")?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-between font-sans">
        <Nav />
        <main className="flex-1 flex flex-col items-center justify-center py-20 space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#0a5c38] dark:border-[#3fb68e]"></div>
          <p className="text-sm font-medium text-muted-foreground">Loading GovAlert data from live API...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-secondary/25 font-sans">
      <Nav />
      <main>
        <Hero
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onTagClick={handleTagClick}
          liveFeed={liveFeed}
        />
        <Stats status={status} />
        <LatestJobs
          jobs={filteredJobs}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <RecentlyUpdatedRecruitments liveFeed={liveFeed} />
        <PortalHealth agencies={agencies} />
        <AgencyDirectory onAgencyFilter={handleAgencyClick} agencies={agencies} />
        <VerificationMethodology />
        <TelegramCTA />
      </main>
      <Footer />
    </div>
  );
}
