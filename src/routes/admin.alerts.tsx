import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  AlertTriangle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  adminApi,
  AdminAlert,
  AdminAlertStats,
} from "../lib/adminApi";
import { cn } from "../lib/utils";

export const Route = createFileRoute("/admin/alerts")({
  component: AdminAlertsComponent,
});

type TabStatus = "PENDING" | "APPROVED" | "REJECTED" | "HELD";

function formatAgeHours(hours: number): string {
  if (!hours || hours <= 0) return "0m";
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours < 24) return `${hours.toFixed(1)}h`;
  return `${(hours / 24).toFixed(1)}d`;
}

function timeAgo(dateString: string): string {
  if (!dateString) return "unknown";
  const date = new Date(dateString);
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

function AdminAlertsComponent() {
  const [activeTab, setActiveTab] = useState<TabStatus>("PENDING");
  const [stats, setStats] = useState<AdminAlertStats | null>(null);
  const [alerts, setAlerts] = useState<AdminAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load stats & queue alerts
  const loadStats = async () => {
    try {
      const res = await adminApi.getAlertStats();
      setStats(res);
    } catch (err) {
      // Silently handle stats error
    }
  };

  const loadAlerts = async (status: TabStatus) => {
    setLoading(true);
    try {
      const res = await adminApi.getAlerts({ status });
      setAlerts(res.results || []);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load alerts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    loadAlerts(activeTab);
  }, [activeTab]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans antialiased">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-bold font-sans tracking-tight text-foreground flex items-center gap-2.5">
            <ShieldAlert className="h-6 w-6 text-amber-500" />
            Alert Review Queue
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-sans">
            Review incoming recruitment events before public dispatch. Approved items are exposed to Telegram and the Public API.
          </p>
        </div>
      </div>

      {/* 1. Stat Cards Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-[8px] p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-sans font-semibold">
            <span>Pending Review</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-sans text-foreground">
            {stats ? stats.pending_count : "—"}
          </div>
          <div className="text-[11px] text-muted-foreground font-sans">Awaiting human decision</div>
        </div>

        <div className="bg-card border border-border rounded-[8px] p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-sans font-semibold">
            <span>Approved Today</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-sans text-emerald-700 dark:text-emerald-400">
            {stats ? stats.approved_today : "—"}
          </div>
          <div className="text-[11px] text-muted-foreground font-sans">Verified & dispatched</div>
        </div>

        <div className="bg-card border border-border rounded-[8px] p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-sans font-semibold">
            <span>Rejected Today</span>
            <XCircle className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold font-sans text-red-600 dark:text-red-400">
            {stats ? stats.rejected_today : "—"}
          </div>
          <div className="text-[11px] text-muted-foreground font-sans">Flagged false / fake</div>
        </div>

        <div className="bg-card border border-border rounded-[8px] p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-sans font-semibold">
            <span>Oldest Pending</span>
            <Sparkles className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">
            {stats ? formatAgeHours(stats.oldest_pending_age_hours) : "—"}
          </div>
          <div className="text-[11px] text-muted-foreground font-sans">Time in queue</div>
        </div>
      </div>

      {/* 2. Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto">
        {(["PENDING", "APPROVED", "REJECTED", "HELD"] as TabStatus[]).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-[6px] font-sans text-xs font-semibold tracking-wider transition-all flex items-center gap-2 cursor-pointer",
                isActive
                  ? "bg-muted text-primary border border-border font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <span>{tab}</span>
              {tab === "PENDING" && stats && stats.pending_count > 0 && (
                <span className="bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-[6px] text-[10px] font-mono font-bold">
                  {stats.pending_count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-xs font-sans">Fetching alerts from review queue...</span>
        </div>
      ) : activeTab === "PENDING" ? (
        /* 3. Pending Queue Full Cards View */
        alerts.length === 0 ? (
          /* 5. Empty State for Pending Queue */
          <div className="bg-card border border-border rounded-[8px] p-12 text-center space-y-3 my-8 shadow-sm">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground font-sans">Queue is clear</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto font-sans">
              No alerts waiting for review right now. New recruitment detections will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {alerts.map((alert) => (
              <PendingAlertCard
                key={alert.id}
                alert={alert}
                onActionSuccess={(action, alertId) => {
                  setAlerts((prev) => prev.filter((a) => a.id !== alertId));
                  loadStats();
                }}
              />
            ))}
          </div>
        )
      ) : (
        /* 4. Compact Table View for Approved/Rejected/Held */
        <CompactAlertsTable alerts={alerts} status={activeTab} />
      )}
    </div>
  );
}

// ─── Pending Alert Review Card Component ────────────────────────────────────────

function PendingAlertCard({
  alert,
  onActionSuccess,
}: {
  alert: AdminAlert;
  onActionSuccess: (action: "approve" | "reject" | "hold", id: number) => void;
}) {
  const [notes, setNotes] = useState(alert.admin_notes || "");
  const [showMoreExcerpt, setShowMoreExcerpt] = useState(false);
  const [actionInFlight, setActionInFlight] = useState<"approve" | "reject" | "hold" | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const aiClass = alert.ai_classification || "UNCERTAIN";
  const confidence = alert.ai_confidence || 0;
  const trustScore = alert.trust_score || 0;

  // Action Handlers
  const handleApprove = async () => {
    setActionInFlight("approve");
    try {
      await adminApi.approveAlert(alert.id, notes.trim());
      toast.success(`Alert #${alert.id} approved & queued for public dispatch.`);
      setIsFadingOut(true);
      setTimeout(() => onActionSuccess("approve", alert.id), 300);
    } catch (err: any) {
      toast.error(err?.message || "Failed to approve alert.");
    } finally {
      setActionInFlight(null);
    }
  };

  const handleHold = async () => {
    setActionInFlight("hold");
    try {
      await adminApi.holdAlert(alert.id, notes.trim());
      toast.info(`Alert #${alert.id} placed on hold.`);
      setIsFadingOut(true);
      setTimeout(() => onActionSuccess("hold", alert.id), 300);
    } catch (err: any) {
      toast.error(err?.message || "Failed to hold alert.");
    } finally {
      setActionInFlight(null);
    }
  };

  const handleReject = async () => {
    if (!notes.trim()) {
      toast.error("Explanation notes are required when rejecting an alert.");
      return;
    }
    setActionInFlight("reject");
    try {
      await adminApi.rejectAlert(alert.id, notes.trim());
      toast.warning(`Alert #${alert.id} rejected.`);
      setIsFadingOut(true);
      setTimeout(() => onActionSuccess("reject", alert.id), 300);
    } catch (err: any) {
      toast.error(err?.message || "Failed to reject alert.");
    } finally {
      setActionInFlight(null);
    }
  };

  const excerptText = alert.content_excerpt || "";
  const shouldTruncate = excerptText.length > 300;
  const displayedExcerpt =
    shouldTruncate && !showMoreExcerpt ? `${excerptText.slice(0, 300)}...` : excerptText;

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-[8px] p-6 space-y-5 shadow-sm transition-all duration-300 font-sans",
        isFadingOut && "opacity-0 scale-95 pointer-events-none"
      )}
    >
      {/* Top Header: Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-[6px] bg-muted text-foreground border border-border">
            {alert.agency_acronym || (alert.agency ? alert.agency.acronym : "AGENCY")}
          </span>
          <span className="text-xs text-muted-foreground font-sans">
            {alert.agency_name || (alert.agency ? alert.agency.name : "")}
          </span>
        </div>

        {/* Standardized AI Badge */}
        <div
          className={cn(
            "font-sans text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-[6px] border flex items-center gap-1.5",
            aiClass === "REAL"
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
              : aiClass === "FAKE"
              ? "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30"
              : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30"
          )}
        >
          <Sparkles className="h-3 w-3" />
          <span>
            AI: {aiClass} ({confidence}%)
          </span>
        </div>
      </div>

      {/* Main Alert Info */}
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-foreground font-sans tracking-tight">{alert.title}</h2>
        {alert.positions && (
          <p className="text-xs text-foreground font-sans bg-muted/60 px-3 py-1.5 rounded-[6px] border border-border inline-block">
            Roles: {alert.positions}
          </p>
        )}
        {alert.source_url && (
          <div className="pt-1">
            <a
              href={alert.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-mono"
            >
              <span>Source: {alert.source_url}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}
      </div>

      {/* Trust Score Progress Bar */}
      <div className="space-y-1.5 bg-muted/30 p-3.5 rounded-[6px] border border-border">
        <div className="flex justify-between items-center text-xs font-sans">
          <span className="text-muted-foreground font-semibold">Trust Score:</span>
          <span
            className={cn(
              "font-mono font-bold",
              trustScore >= 70
                ? "text-emerald-600 dark:text-emerald-400"
                : trustScore >= 50
                ? "text-amber-600 dark:text-amber-400"
                : "text-red-600 dark:text-red-400"
            )}
          >
            {trustScore}/100
          </span>
        </div>
        <div className="w-full bg-border h-2 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-500 rounded-full",
              trustScore >= 70 ? "bg-emerald-500" : trustScore >= 50 ? "bg-amber-500" : "bg-red-500"
            )}
            style={{ width: `${Math.min(Math.max(trustScore, 0), 100)}%` }}
          />
        </div>
      </div>

      {/* Red Flags Section */}
      <div className="space-y-1.5 text-xs font-sans">
        <span className="font-semibold text-muted-foreground">Red Flags:</span>
        {alert.ai_red_flags && alert.ai_red_flags.length > 0 ? (
          <div className="space-y-1">
            {alert.ai_red_flags.map((flag, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-[6px]">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                <span>{flag}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-[6px] inline-block font-sans text-xs font-semibold">
            ✓ No red flags detected
          </div>
        )}
      </div>

      {/* Content Excerpt */}
      {excerptText && (
        <div className="space-y-1.5 bg-muted/40 p-3.5 rounded-[6px] border border-border">
          <span className="block text-xs font-semibold text-muted-foreground font-sans">Content Excerpt:</span>
          <p className="text-xs text-foreground leading-relaxed font-sans italic whitespace-pre-wrap">
            "{displayedExcerpt}"
          </p>
          {shouldTruncate && (
            <button
              onClick={() => setShowMoreExcerpt(!showMoreExcerpt)}
              className="text-xs text-primary hover:underline font-sans font-semibold flex items-center gap-1 pt-1 cursor-pointer"
            >
              <span>{showMoreExcerpt ? "Show less" : "Show more"}</span>
              {showMoreExcerpt ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          )}
        </div>
      )}

      {/* Metadata */}
      <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground font-sans pt-1">
        <div>Detected: <span className="font-mono text-muted-foreground">{timeAgo(alert.created_at)}</span></div>
        <div>
          Portal: {alert.portal_name || (alert.portal ? alert.portal.name : "Portal")}{" "}
          <span className="font-mono text-muted-foreground">({alert.portal_url || (alert.portal ? alert.portal.url : "")})</span>
        </div>
      </div>

      {/* Notes & Actions */}
      <div className="space-y-3 pt-2 border-t border-border">
        <div className="space-y-1 font-sans">
          <label className="block text-xs font-semibold text-muted-foreground">
            Admin Notes (Optional for Hold/Approve; Required for Reject):
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add explanation notes or review rationale..."
            rows={2}
            className="w-full px-3 py-2 bg-background border border-border rounded-[6px] text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors font-sans"
            disabled={actionInFlight !== null}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-1 font-sans">
          {/* Reject */}
          <button
            onClick={handleReject}
            disabled={actionInFlight !== null || !notes.trim()}
            title={!notes.trim() ? "Notes field required before rejecting" : "Reject alert"}
            className="px-4 py-2 border border-red-600/80 text-red-600 dark:text-red-400 hover:bg-red-500/10 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-sans font-semibold rounded-[6px] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {actionInFlight === "reject" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <XCircle className="h-3.5 w-3.5" />
            )}
            <span>Reject</span>
          </button>

          {/* Hold */}
          <button
            onClick={handleHold}
            disabled={actionInFlight !== null}
            className="px-4 py-2 border border-amber-600/80 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-sans font-semibold rounded-[6px] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {actionInFlight === "hold" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Clock className="h-3.5 w-3.5" />
            )}
            <span>Hold</span>
          </button>

          {/* Approve */}
          <button
            onClick={handleApprove}
            disabled={actionInFlight !== null}
            className="px-5 py-2 bg-[#0a5c38] hover:bg-[#0f7a4a] dark:bg-[#3fb68e] dark:hover:bg-[#3fb68e]/90 text-white dark:text-[#0c1015] text-xs font-sans font-semibold rounded-[6px] transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            {actionInFlight === "approve" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5" />
            )}
            <span>Approve ✓</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Compact Table View for Approved/Rejected/Held ─────────────────────────────

function CompactAlertsTable({ alerts, status }: { alerts: AdminAlert[]; status: TabStatus }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (alerts.length === 0) {
    return (
      <div className="bg-card border border-border rounded-[8px] p-12 text-center text-muted-foreground text-xs font-sans">
        No alerts found for status "{status}".
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-[8px] overflow-hidden shadow-sm font-sans">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted border-b border-border text-muted-foreground font-sans font-semibold uppercase tracking-wider">
            <tr>
              <th className="p-3.5">Ref / ID</th>
              <th className="p-3.5">Title</th>
              <th className="p-3.5">Agency</th>
              <th className="p-3.5">AI Class</th>
              <th className="p-3.5">Trust</th>
              <th className="p-3.5">Verified By</th>
              <th className="p-3.5">Verified At</th>
              <th className="p-3.5 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-foreground">
            {alerts.map((alert) => {
              const isExpanded = expandedId === alert.id;
              return (
                <tr key={alert.id} className="hover:bg-muted/40 transition-colors">
                  <td className="p-3.5 font-mono text-muted-foreground">#{alert.id}</td>
                  <td className="p-3.5 font-medium text-foreground max-w-xs truncate font-sans">{alert.title}</td>
                  <td className="p-3.5 font-mono font-bold text-primary">
                    {alert.agency_acronym || (alert.agency ? alert.agency.acronym : "—")}
                  </td>
                  <td className="p-3.5 font-sans">
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-[6px] text-[11px] font-semibold uppercase tracking-wider inline-block",
                        alert.ai_classification === "REAL"
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                          : alert.ai_classification === "FAKE"
                          ? "bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/30"
                          : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                      )}
                    >
                      {alert.ai_classification} ({alert.ai_confidence}%)
                    </span>
                  </td>
                  <td className="p-3.5 font-mono font-bold">{alert.trust_score}/100</td>
                  <td className="p-3.5 font-sans text-muted-foreground">{alert.verified_by || "—"}</td>
                  <td className="p-3.5 font-mono text-muted-foreground">
                    {alert.verified_at ? timeAgo(alert.verified_at) : "—"}
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : alert.id)}
                      className="p-1 text-muted-foreground hover:text-foreground rounded bg-background border border-border cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Expanded Detail View */}
      {expandedId !== null && (
        <div className="p-4 bg-muted/30 border-t border-border text-xs space-y-2 font-sans">
          {(() => {
            const a = alerts.find((item) => item.id === expandedId);
            if (!a) return null;
            return (
              <div className="space-y-2">
                <div className="font-sans text-primary font-bold">Detail View for Alert #{a.id}:</div>
                {a.admin_notes && (
                  <div className="bg-card p-3 rounded-[6px] border border-border">
                    <span className="font-sans font-semibold text-muted-foreground block mb-1">Admin Notes:</span>
                    <p className="whitespace-pre-wrap font-sans text-foreground">{a.admin_notes}</p>
                  </div>
                )}
                <div className="text-muted-foreground font-sans">
                  <span className="font-semibold">Source:</span>{" "}
                  <a href={a.source_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-mono">
                    {a.source_url}
                  </a>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
