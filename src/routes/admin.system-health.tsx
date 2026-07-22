import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Activity,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Server,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Play,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { adminApi, AdminSystemHealth } from "../lib/adminApi";
import { cn } from "../lib/utils";

export const Route = createFileRoute("/admin/system-health")({
  component: AdminSystemHealthComponent,
});

function timeAgo(dateStr?: string | null): string {
  if (!dateStr) return "Never";
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getDownDurationText(portal: any): string {
  const secs = portal.down_duration_seconds;
  if (secs !== undefined && secs !== null) {
    if (secs < 3600) {
      const mins = Math.max(Math.round(secs / 60), 1);
      return `${mins} minute${mins === 1 ? "" : "s"}`;
    }
    const hours = secs / 3600;
    if (hours < 24) {
      return `${hours.toFixed(1)} hours`;
    }
    const days = (hours / 24).toFixed(1);
    return `${days} days`;
  }
  if (!portal.last_checked_at) return "> 24 hours";
  const date = new Date(portal.last_checked_at);
  const now = new Date();
  const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  if (diffHours < 1) return `${Math.round(diffHours * 60)} minutes`;
  if (diffHours < 24) return `${diffHours.toFixed(1)} hours`;
  return `${(diffHours / 24).toFixed(1)} days`;
}

function getSeverityBadge(portal: any) {
  const status = (portal.health_status || portal.status || "UNKNOWN").toUpperCase();
  const secs = portal.down_duration_seconds ?? 0;
  const hours = secs / 3600;

  if (status === "CAPTCHA") return { label: "CAPTCHA Detected", class: "bg-amber-500/10 text-amber-600 border-amber-500/30" };
  if (status === "BLOCKED") return { label: "Firewall Blocked", class: "bg-amber-500/10 text-amber-600 border-amber-500/30" };
  if (status === "RATE_LIMITED") return { label: "Rate Limited", class: "bg-amber-500/10 text-amber-600 border-amber-500/30" };
  if (status === "MAINTENANCE") return { label: "Maintenance", class: "bg-blue-500/10 text-blue-600 border-blue-500/30" };

  if (hours >= 24) {
    return { label: "FAILING > 24H", class: "bg-destructive/10 text-destructive border-destructive/30" };
  } else if (hours >= 1) {
    return { label: `Down ${hours.toFixed(1)}h`, class: "bg-amber-500/10 text-amber-600 border-amber-500/30" };
  } else {
    const mins = Math.max(Math.round(secs / 60), 1);
    return { label: `Down ${mins}m`, class: "bg-amber-500/10 text-amber-600 border-amber-500/30" };
  }
}

// STEP 5: Strict Health Status Badge helper
function getHealthBadgeStyle(status?: string) {
  const norm = (status || "UNKNOWN").toUpperCase();
  if (norm === "ONLINE") {
    return {
      dotColor: "bg-[#0a5c38]",
      badgeClass: "bg-[#0a5c38]/10 text-[#0a5c38] dark:text-[#3fb68e] border-[#0a5c38]/30",
      label: "ONLINE",
    };
  }
  if (norm === "OFFLINE") {
    return {
      dotColor: "bg-destructive",
      badgeClass: "bg-destructive/10 text-destructive border-destructive/30",
      label: "OFFLINE",
    };
  }
  if (norm === "MAINTENANCE" || norm === "BLOCKED" || norm === "CAPTCHA" || norm === "RATE_LIMITED") {
    return {
      dotColor: "bg-[color:var(--warning)]",
      badgeClass: "bg-[color:var(--warning)]/10 text-[color:var(--warning)] border-[color:var(--warning)]/30",
      label: norm === "MAINTENANCE" ? "MAINTENANCE" : norm,
    };
  }
  return {
    dotColor: "bg-[color:var(--closed)]",
    badgeClass: "bg-[color:var(--closed)]/10 text-muted-foreground border-[color:var(--closed)]/20",
    label: norm || "UNKNOWN",
  };
}

function AdminSystemHealthComponent() {
  const [healthData, setHealthData] = useState<AdminSystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [triggeringId, setTriggeringId] = useState<number | null>(null);
  const [triggeringAll, setTriggeringAll] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const handleTriggerCheckAll = async () => {
    setTriggeringAll(true);
    try {
      const res = await adminApi.triggerCheckAllPortals();
      toast.success(res.detail || "Mass recheck triggered for all active portals!");
      loadHealth();
    } catch (err: any) {
      toast.error(err?.message || "Failed to trigger mass portal recheck.");
    } finally {
      setTriggeringAll(false);
    }
  };

  const loadHealth = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    setError(null);
    try {
      const data = await adminApi.getSystemHealth();
      setHealthData(data);
      setLastUpdated(new Date());
    } catch (err: any) {
      const msg = err?.message || "Failed to load system health telemetry from server.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 60-Second Auto-Polling
  useEffect(() => {
    loadHealth();
    const interval = setInterval(() => {
      loadHealth();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerCheck = async (portalId: number, portalName: string) => {
    setTriggeringId(portalId);
    try {
      const res = await adminApi.triggerPortalCheck(portalId);
      if (res.has_change) {
        toast.warning(`Scrape result for '${portalName}': Page CHANGE DETECTED ⚡`);
      } else {
        toast.success(`Scrape result for '${portalName}': No change detected.`);
      }
      loadHealth();
    } catch (err: any) {
      toast.error(err?.message || `Failed to run check on '${portalName}'.`);
    } finally {
      setTriggeringId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-3 font-sans">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="text-xs font-sans">Gathering system health telemetry...</span>
      </div>
    );
  }

  if (error || !healthData) {
    return (
      <div className="space-y-6 max-w-xl mx-auto py-16 font-sans">
        <div className="bg-destructive/10 border-2 border-destructive/30 rounded-[8px] p-6 text-center space-y-4 shadow-sm">
          <div className="flex items-center justify-center gap-2 text-destructive font-bold text-sm uppercase tracking-wider">
            <XCircle className="h-5 w-5" />
            <span>Could not load system health telemetry</span>
          </div>
          <p className="text-xs text-muted-foreground font-sans">
            {error || "An unexpected error occurred while communicating with the backend API."}
          </p>
          <button
            onClick={() => loadHealth(true)}
            disabled={refreshing}
            className="px-4 py-2 bg-destructive text-white rounded-[6px] text-xs font-semibold hover:bg-destructive/90 transition-all flex items-center gap-2 mx-auto cursor-pointer"
          >
            <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  const sys = healthData.system_status;
  const portals = healthData.portals_breakdown || [];
  const failedSnaps = healthData.recent_failed_snapshots || [];
  const trend = healthData.daily_trend_7_days || [];

  const attentionPortals = portals.filter((p) => p.needs_attention);

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans antialiased">
      {/* Page Header with Polling Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-bold font-sans tracking-tight text-foreground flex items-center gap-2.5">
            <Activity className="h-6 w-6 text-primary" />
            System Health & Diagnostics
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-sans">
            Real-time infrastructure health, scraper diagnostics, 60s live telemetry, and 7-day reliability trends.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto font-sans">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-card border border-border text-xs font-sans text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-[#0a5c38] animate-pulse" />
            <span>Auto-polling (60s)</span>
            <span className="text-border">|</span>
            <span className="text-muted-foreground font-mono">{lastUpdated.toLocaleTimeString()}</span>
          </div>

          <button
            onClick={() => loadHealth(true)}
            disabled={refreshing}
            className="px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground text-xs font-sans font-semibold rounded-[6px] transition-all flex items-center gap-2 border border-border cursor-pointer"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", refreshing && "animate-spin text-primary")} />
            <span>Refresh Now</span>
          </button>

          <button
            onClick={handleTriggerCheckAll}
            disabled={triggeringAll}
            className="px-3.5 py-1.5 bg-[#0a5c38] hover:bg-[#08482c] dark:bg-[#3fb68e] dark:hover:bg-[#349e7b] text-white dark:text-gray-950 text-xs font-sans font-semibold rounded-[6px] transition-all flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
            title="Trigger manual scrape check across all 41 monitored portals immediately"
          >
            {triggeringAll ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5 fill-current" />
            )}
            <span>Recheck Everything</span>
          </button>
        </div>
      </div>

      {/* 1. Top Stat Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 font-sans">
        {/* Online */}
        <div className="bg-card border border-border rounded-[8px] p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-sans font-semibold">
            <span>Online</span>
            <CheckCircle2 className="h-4 w-4 text-[#0a5c38] dark:text-[#3fb68e]" />
          </div>
          <div className="text-2xl font-bold font-sans text-[#0a5c38] dark:text-[#3fb68e]">
            {sys.agencies_online ?? "—"} <span className="text-sm font-normal text-muted-foreground">/ {sys.total_agencies ?? "—"}</span>
          </div>
          <div className="text-[11px] text-muted-foreground font-sans">Agencies online & monitored</div>
        </div>

        {/* Offline */}
        <div className="bg-card border border-border rounded-[8px] p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-sans font-semibold">
            <span>Offline</span>
            <XCircle className="h-4 w-4 text-destructive" />
          </div>
          <div className="text-2xl font-bold font-sans text-destructive">
            {sys.agencies_offline ?? "—"}
          </div>
          <div className="text-[11px] text-muted-foreground font-sans">Portals failing checks</div>
        </div>

        {/* Maintenance */}
        <div className="bg-card border border-border rounded-[8px] p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-sans font-semibold">
            <span>Maintenance</span>
            <Wrench className="h-4 w-4 text-[color:var(--warning)]" />
          </div>
          <div className="text-2xl font-bold font-sans text-[color:var(--warning)]">
            {sys.agencies_maintenance ?? "—"}
          </div>
          <div className="text-[11px] text-muted-foreground font-sans">Under scheduled work</div>
        </div>

        {/* Checks Today */}
        <div className="bg-card border border-border rounded-[8px] p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-sans font-semibold">
            <span>Checks Today</span>
            <Server className="h-4 w-4 text-[color:var(--new)]" />
          </div>
          <div className="text-2xl font-bold font-sans text-foreground">
            {sys?.total_checks_today || 0}
          </div>
          <div className="text-[11px] text-muted-foreground font-sans">
            {sys?.changes_detected_today || 0} page changes detected
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-card border border-border rounded-[8px] p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-sans font-semibold">
            <span>Success Rate</span>
            <TrendingUp className="h-4 w-4 text-[#0a5c38] dark:text-[#3fb68e]" />
          </div>
          <div className="text-2xl font-bold font-sans text-[#0a5c38] dark:text-[#3fb68e]">
            {sys?.success_rate_today ?? 100}%
          </div>
          <div className="text-[11px] text-muted-foreground font-sans">
            {sys?.failed_checks_today || 0} failed HTTP checks
          </div>
        </div>
      </div>

      {/* 2. Needs Attention Section */}
      <div className="space-y-3 font-sans">
        <h2 className="text-xs font-bold font-sans text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <AlertOctagon className="h-4 w-4 text-[color:var(--warning)]" />
          Infrastructure Operator Alerts
        </h2>

        {attentionPortals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attentionPortals.map((portal) => {
              const badge = getSeverityBadge(portal);
              return (
                <div
                  key={portal.id}
                  className="bg-card border-2 border-destructive/40 rounded-[8px] p-5 shadow-sm space-y-3 relative overflow-hidden font-sans"
                >
                  <div className="flex items-center justify-between border-b border-border pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-[6px] bg-muted text-primary border border-border">
                        {portal.agency_acronym}
                      </span>
                      <span className="font-bold text-foreground text-sm font-sans">{portal.name}</span>
                    </div>
                    <span className={cn("text-[10px] font-sans font-bold px-2 py-0.5 rounded-[6px] uppercase border", badge.class)}>
                      {badge.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                    <div className="bg-muted/40 p-2.5 rounded-[6px] border border-border">
                      <span className="text-muted-foreground block text-[10px] font-semibold">Down Duration:</span>
                      <span className="text-destructive font-bold">
                        {getDownDurationText(portal)}
                      </span>
                    </div>
                    <div className="bg-muted/40 p-2.5 rounded-[6px] border border-border">
                      <span className="text-muted-foreground block text-[10px] font-semibold">Consecutive Failures:</span>
                      <span className="text-destructive font-bold">{portal.consecutive_failures} failures</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 font-sans text-xs">
                    <div className="text-muted-foreground text-[11px]">
                      Last checked: <span className="font-mono">{timeAgo(portal.last_checked_at)}</span>
                    </div>
                    <button
                      onClick={() => handleTriggerCheck(portal.id, portal.name)}
                      disabled={triggeringId === portal.id}
                      className="px-3 py-1.5 bg-[#0a5c38] hover:bg-[#0f7a4a] dark:bg-[#3fb68e] dark:hover:bg-[#3fb68e]/90 disabled:opacity-50 text-white dark:text-[#0c1015] font-semibold rounded-[6px] flex items-center gap-1.5 text-xs transition-all shadow-sm cursor-pointer"
                    >
                      {triggeringId === portal.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Play className="h-3.5 w-3.5 fill-current" />
                      )}
                      <span>Check now</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Calm Green Confirmation State when no portals fail */
          <div className="bg-[#0a5c38]/10 border border-[#0a5c38]/20 rounded-[8px] p-6 flex items-center gap-4 text-[#0a5c38] dark:text-[#3fb68e] shadow-sm font-sans">
            <div className="h-10 w-10 rounded-full bg-[#0a5c38]/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-6 w-6 text-[#0a5c38] dark:text-[#3fb68e]" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-sans text-[#0a5c38] dark:text-[#3fb68e]">All portals healthy.</h3>
              <p className="text-xs text-muted-foreground mt-0.5 font-sans">
                No monitored portals are failing or require administrator intervention at this time.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. 7-Day Reliability & Checks Trend Chart (Recharts) */}
      <div className="bg-card border border-border rounded-[8px] p-6 space-y-4 shadow-sm font-sans">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-3 gap-2">
          <div>
            <h3 className="text-sm font-bold font-sans text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              7-Day System Health & Volume Trend
            </h3>
            <p className="text-xs text-muted-foreground font-sans">Total automated checks (bars) vs success rate percentage (line).</p>
          </div>
          <span className="text-xs font-mono text-muted-foreground">Aggregated from PortalHealthLog</span>
        </div>

        <div className="h-64 w-full pt-2 font-sans">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={trend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--muted-foreground)" tick={{ fontSize: 11, fontFamily: "IBM Plex Sans, sans-serif" }} />
              <YAxis yAxisId="left" stroke="var(--muted-foreground)" tick={{ fontSize: 11, fontFamily: "IBM Plex Sans, sans-serif" }} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} stroke="#0a5c38" tick={{ fontSize: 11, fontFamily: "IBM Plex Sans, sans-serif" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontFamily: "IBM Plex Sans, sans-serif",
                  color: "var(--foreground)",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", fontFamily: "IBM Plex Sans, sans-serif" }} />
              <Bar yAxisId="left" dataKey="total_checks" name="Total Checks" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
              <Line yAxisId="right" type="monotone" dataKey="success_rate" name="Success Rate (%)" stroke="#3fb68e" strokeWidth={3} dot={{ r: 4, fill: "#3fb68e" }} connectNulls={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Recent Failures Table (20 Most Recent Failed Snapshots) */}
      <div className="bg-card border border-border rounded-[8px] overflow-hidden shadow-sm font-sans space-y-4">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-bold font-sans text-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[color:var(--warning)]" />
            Recent Failed Snapshots Log (Last 20 Failures)
          </h3>
          <span className="text-xs font-mono text-muted-foreground">{failedSnaps.length} logged failures</span>
        </div>

        {failedSnaps.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground font-sans text-xs">
            No failed scraper snapshots recorded recently. Infrastructure operating nominally.
          </div>
        ) : (
          <div className="overflow-x-auto font-sans">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted border-b border-border text-muted-foreground font-sans font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Agency</th>
                  <th className="p-3.5">Portal Name</th>
                  <th className="p-3.5">Status Code</th>
                  <th className="p-3.5">Error Detail</th>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Relative Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-foreground">
                {failedSnaps.map((snap) => (
                  <tr key={snap.id} className="hover:bg-muted/40 transition-colors font-sans">
                    <td className="p-3.5 font-mono font-bold text-primary">
                      {snap.agency_acronym || "—"}
                    </td>
                    <td className="p-3.5 font-semibold text-foreground max-w-xs truncate font-sans">{snap.portal_name}</td>
                    <td className="p-3.5 font-sans">
                      <span className="px-2 py-0.5 rounded-[6px] bg-destructive/10 text-destructive border border-destructive/30 font-mono font-bold">
                        {snap.status_code || "FAIL"}
                      </span>
                    </td>
                    <td className="p-3.5 text-foreground italic font-sans max-w-md truncate">
                      {snap.error_detail || "Connection timeout or parsing failure."}
                    </td>
                    <td className="p-3.5 text-muted-foreground font-mono">
                      {new Date(snap.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3.5 text-muted-foreground font-mono">{timeAgo(snap.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Complete Monitored Portals Roster with Corrected Health Mapping */}
      <div className="bg-card border border-border rounded-[8px] overflow-hidden shadow-sm font-sans">
        <div className="p-5 border-b border-border">
          <h3 className="text-sm font-bold font-sans text-foreground flex items-center gap-2">
            <Server className="h-4 w-4 text-primary" />
            Monitored Portals Health Roster ({portals.length} Portals)
          </h3>
        </div>

        <div className="overflow-x-auto font-sans">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted border-b border-border text-muted-foreground font-sans font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Agency</th>
                <th className="p-3.5">Portal Name</th>
                <th className="p-3.5">Consec. Failures</th>
                <th className="p-3.5">Health Status</th>
                <th className="p-3.5">Last Checked</th>
                <th className="p-3.5">Attention Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {portals.map((p) => {
                const badge = getHealthBadgeStyle(p.health_status || p.status);
                return (
                  <tr key={p.id} className="hover:bg-muted/40 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-primary">{p.agency_acronym}</td>
                    <td className="p-3.5 font-semibold text-foreground font-sans">{p.name}</td>
                    <td className="p-3.5 font-mono">
                      {p.consecutive_failures > 0 ? (
                        <span className="text-[color:var(--warning)] font-bold">{p.consecutive_failures}</span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </td>
                    {/* STEP 5: Strict Health Status Badge */}
                    <td className="p-3.5 font-sans">
                      <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[6px] text-[11px] font-semibold uppercase tracking-wider border font-sans", badge.badgeClass)}>
                        <span className={cn("h-2 w-2 rounded-full shrink-0", badge.dotColor)} />
                        <span>{badge.label}</span>
                      </span>
                    </td>
                    <td className="p-3.5 text-muted-foreground font-mono">
                      {p.last_checked_at ? new Date(p.last_checked_at).toLocaleString() : "Never"}
                    </td>
                    <td className="p-3.5 font-sans">
                      {p.needs_attention ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[6px] text-[11px] font-semibold uppercase tracking-wider bg-destructive/10 text-destructive border border-destructive/30 font-sans">
                          <AlertTriangle className="h-3 w-3 shrink-0" />
                          <span>Needs Attention</span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground font-sans">OK</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
