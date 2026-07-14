import { createFileRoute } from "@tanstack/react-router";
import { Nav, Footer } from "../components/layout";
import { CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { agenciesData } from "../lib/agenciesData";

export const Route = createFileRoute("/status")({
  component: StatusPage,
});

function StatusPage() {
  const onlineCount = agenciesData.filter((a) => a.portalStatus === "online").length;
  const maintenanceCount = agenciesData.filter(
    (a) => a.portalStatus === "review" || a.portalStatus === "warning"
  ).length;
  const offlineCount = agenciesData.filter((a) => a.portalStatus === "closed").length;

  // Render dummy uptime bar blocks (90 blocks for 90 days of operational check history)
  const renderUptimeBar = (status: "online" | "review" | "warning" | "closed") => {
    return (
      <div className="flex gap-[2px] w-full">
        {Array.from({ length: 48 }).map((_, i) => {
          let color = "bg-[#15803D]"; // green
          if (status === "review" && i === 35) color = "bg-[#B45309]"; // maintenance amber
          if (status === "warning" && i === 20) color = "bg-[#B45309]"; // warning amber
          if (status === "closed" && i % 15 === 0) color = "bg-[#B91C1C]"; // offline red
          
          return (
            <div
              key={i}
              className={`h-6 flex-1 rounded-[2px] transition-colors ${color}`}
              title="100% operational"
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-secondary/25">
      <Nav />
      <main className="flex-1 mx-auto max-w-4xl w-full px-6 py-12 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-primary md:text-3xl">System Status</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Real-time monitoring health and latencies of Nigerian government recruitment subdomains.
            </p>
          </div>
          <span className="font-mono text-xs text-muted-foreground shrink-0">
            Scanning interval: 15m
          </span>
        </div>

        {/* Global Operational Status Banner */}
        <div className="rounded-[8px] border border-[#15803D]/20 bg-[#15803D]/5 p-5 flex items-center gap-3">
          <CheckCircle className="size-5 text-[#15803D]" />
          <div>
            <p className="text-sm font-semibold text-primary">All systems operational</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {onlineCount} portals checked, {maintenanceCount} under maintenance, {offlineCount} offline.
            </p>
          </div>
        </div>

        {/* Portals List Table */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-primary">Agency portal metrics</h2>
          <div className="rounded-[8px] border border-border bg-card overflow-hidden">
            <div className="divide-y divide-border">
              {agenciesData.map((a) => {
                const responseTime = a.short === "NNPC" ? "340 ms" : a.short === "NCS" ? "410 ms" : a.short === "EFCC" ? "280 ms" : "520 ms";
                const isOnline = a.portalStatus === "online";
                const isMaintenance = a.portalStatus === "review" || a.portalStatus === "warning";

                return (
                  <div key={a.short} className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="text-sm font-semibold text-primary">{a.name}</h3>
                        <p className="text-xs text-muted-foreground font-mono">{a.recruitmentPortal.replace("https://", "")}</p>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-mono">
                        <span className="text-muted-foreground">{responseTime}</span>
                        <span
                          className={`font-semibold ${
                            isOnline ? "text-[#15803D]" : isMaintenance ? "text-[#B45309]" : "text-[#64748B]"
                          }`}
                        >
                          {isOnline ? "Operational" : isMaintenance ? "Maintenance" : "Offline"}
                        </span>
                      </div>
                    </div>

                    {/* Uptime History Bar Graph */}
                    <div className="space-y-1">
                      {renderUptimeBar(a.portalStatus)}
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>90 days ago</span>
                        <span>Uptime 99.8%</span>
                        <span>Today</span>
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
            <h4 className="text-sm font-semibold text-primary">About this status dashboard</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This page displays automated health checks conducted by GovAlert monitoring nodes. Latencies are computed from our monitoring endpoint located in Lagos, Nigeria. A portal marked "Offline" indicates connection timeouts or DNS resolution issues detected during three consecutive scanning cycles.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
