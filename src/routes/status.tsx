import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Nav, Footer } from "../components/layout";
import { CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { api, ApiSystemStatus, ApiAgency } from "../lib/api";
import { SpeedDots } from "../lib/speedIndicator";

export const Route = createFileRoute("/status")({
  component: StatusPage,
});

function StatusPage() {
  const [status, setStatus] = useState<ApiSystemStatus | null>(null);
  const [agencies, setAgencies] = useState<ApiAgency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statusRes, agenciesRes] = await Promise.all([
        api.getSystemStatus(),
        api.getAgencies(),
      ]);
      if (statusRes) setStatus(statusRes);
      if (agenciesRes && agenciesRes.results) setAgencies(agenciesRes.results);
    } catch (err: any) {
      setError("Failed to fetch system health data from RecruitmentAlert API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Render uptime bar from real last_10_checks boolean array
  const renderUptimeBar = (checks?: boolean[]) => {
    // Pad to 48 slots — use checks for the rightmost N bars, grey for the rest
    const slots = Array.from({ length: 48 }, (_, i) => {
      if (!checks || checks.length === 0) return "grey";
      const offset = i - (48 - checks.length);
      if (offset < 0) return "grey";
      return checks[offset] ? "green" : "red";
    });
    return (
      <div className="flex gap-[2px] w-full">
        {slots.map((color, i) => (
          <div
            key={i}
            className={`h-6 flex-1 rounded-[2px] transition-colors ${
              color === "green"
                ? "bg-[#15803D]"
                : color === "red"
                ? "bg-[#B91C1C]"
                : "bg-border"
            }`}
            title={color === "green" ? "Online" : color === "red" ? "Offline" : "No data"}
          />
        ))}
      </div>
    );
  };

  const timeAgo = (iso: string | null | undefined): string => {
    if (!iso) return "unknown";
    const diff = Date.now() - new Date(iso).getTime();
    const s = Math.floor(diff / 1000);
    if (s < 60) return `${s}s ago`;
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-between font-sans">
        <Nav />
        <main className="flex-1 flex flex-col items-center justify-center py-20 space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#0a5c38] dark:border-[#3fb68e]"></div>
          <p className="text-sm font-medium text-muted-foreground">Loading system status...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !status) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-between font-sans">
        <Nav />
        <main className="flex-1 flex flex-col items-center justify-center py-20 px-6 max-w-md mx-auto text-center space-y-6">
          <div className="rounded-full bg-red-100 dark:bg-red-950/50 p-4 text-red-600 dark:text-red-400">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-primary">Status Offline</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{error}</p>
          </div>
          <button
            onClick={loadData}
            className="w-full px-4 py-2 text-sm font-semibold text-white bg-[#0a5c38] dark:bg-[#3fb68e] rounded-[6px] hover:opacity-90 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Retry Connection
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const systemOperational = status.system_operational;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-secondary/25 font-sans">
      <Nav />
      <main className="flex-1 mx-auto max-w-4xl w-full px-6 py-12 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-primary md:text-3xl">System Status</h1>
            <p className="mt-1 text-sm text-muted-foreground font-sans">
              Real-time monitoring health and latencies of Nigerian government recruitment subdomains.
            </p>
          </div>
          <span className="font-mono text-xs text-muted-foreground shrink-0">
            Scanning interval: {status.monitoring_interval_minutes}m
          </span>
        </div>

        {/* Global Operational Status Banner */}
        <div
          className={`rounded-[8px] border p-5 flex items-center gap-3 ${
            systemOperational
              ? "border-[#15803D]/20 bg-[#15803D]/5"
              : "border-amber-500/20 bg-amber-500/5"
          }`}
        >
          {systemOperational ? (
            <CheckCircle className="size-5 text-[#15803D]" />
          ) : (
            <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400" />
          )}
          <div>
            <p className="text-sm font-semibold text-primary">
              {systemOperational ? "All systems operational" : "Some portals are offline"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {status.agencies_online} portals checked online, {status.agencies_maintenance} under maintenance, {status.agencies_offline} offline.
            </p>
          </div>
        </div>

        {/* Portals List Table */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-primary">Agency portal metrics</h2>
          <div className="rounded-[8px] border border-border bg-card overflow-hidden">
            <div className="divide-y divide-border font-sans">
              {agencies.map((a) => {
                const isOnline = a.status === "online";
                const isMaintenance = a.status === "maintenance";

                return (
                  <div key={a.acronym} className="p-4 sm:p-6 space-y-3 overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 min-w-0">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-primary truncate min-w-0">{a.name}</h3>
                        <p className="text-xs text-muted-foreground font-mono truncate min-w-0">{a.portal_url.replace("https://", "").replace("http://", "")}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs font-mono shrink-0 min-w-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-border/40">
                        <SpeedDots ms={a.response_time_ms} showLabel />
                        <span className="text-muted-foreground text-[11px] sm:text-xs shrink-0">Checked {timeAgo(a.last_checked)}</span>
                        <span
                          className={`inline-flex items-center gap-1 font-semibold truncate max-w-[130px] sm:max-w-none shrink-0 ${
                            isOnline ? "text-[#15803D]" : isMaintenance ? "text-[#B45309]" : "text-[#64748B]"
                          }`}
                          title={isOnline ? "Operational" : isMaintenance ? "Maintenance" : "Offline"}
                        >
                          <span className={`size-1.5 rounded-full shrink-0 ${
                            isOnline ? "bg-[#15803D]" : isMaintenance ? "bg-[#B45309]" : "bg-[#64748B]"
                          }`} />
                          <span className="truncate">{isOnline ? "Operational" : isMaintenance ? "Maintenance" : "Offline"}</span>
                        </span>
                      </div>
                    </div>

                    {/* Uptime History Bar Graph */}
                    <div className="space-y-1">
                      {renderUptimeBar(a.last_10_checks)}
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>Recent checks</span>
                        <span>Uptime {a.uptime_percent != null ? `${a.uptime_percent}%` : "—"}</span>
                        <span>Latest</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Operational Guidelines Disclaimer */}
        <div className="rounded-[8px] border border-border bg-muted/20 p-5 space-y-2 flex items-start gap-4">
          <Clock className="size-5 text-muted-foreground shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-primary font-sans">About this status dashboard</h4>
            <p className="text-xs text-muted-foreground leading-relaxed font-sans">
              This page displays automated health checks conducted by RecruitmentAlert monitoring nodes. Latencies are computed from our monitoring endpoint located in Lagos, Nigeria. A portal marked "Offline" indicates connection timeouts or DNS resolution issues detected during three consecutive scanning cycles.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
