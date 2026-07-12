import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Nav, Footer } from "../components/layout";
import { agenciesData, type Agency } from "../lib/agenciesData";
import { latestJobs, StatusBadge } from "./index";
import {
  ArrowLeft,
  ShieldCheck,
  Clock,
  Briefcase,
  Archive,
  ExternalLink,
  Globe,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  History,
  Building,
} from "lucide-react";

export const Route = createFileRoute("/agencies/$agencyShort")({
  component: AgencyProfilePage,
});

function PortalStatusBadge({ status }: { status: Agency["portalStatus"] }) {
  const styles = {
    online: "bg-verified/10 text-verified border-verified/20",
    review: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    warning: "bg-closed/10 text-closed border-closed/20",
    closed: "bg-muted text-muted-foreground border-border",
  };

  const labels = {
    online: "Online & Functional",
    review: "Under Technical Review",
    warning: "Access Issues Warning",
    closed: "Portal Closed / Offline",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      <span
        className={`size-2 rounded-full ${
          status === "online"
            ? "bg-verified animate-pulse"
            : status === "review"
              ? "bg-amber-500 animate-pulse"
              : status === "warning"
                ? "bg-closed animate-bounce"
                : "bg-muted-foreground"
        }`}
      />
      {labels[status]}
    </span>
  );
}

function AgencyProfilePage() {
  const { agencyShort } = Route.useParams();

  const agency = useMemo(() => {
    return agenciesData.find((a) => a.short.toUpperCase() === agencyShort.toUpperCase());
  }, [agencyShort]);

  // Find active jobs for this agency in latestJobs
  const activeJobs = useMemo(() => {
    if (!agency) return [];
    return latestJobs.filter((j) => j.agencyShort.toUpperCase() === agency.short.toUpperCase());
  }, [agency]);

  const similarAgencies = useMemo(() => {
    if (!agency) return [];
    const sameCat = agenciesData.filter((a) => a.category === agency.category && a.short !== agency.short);
    if (sameCat.length > 0) return sameCat.slice(0, 3);
    return agenciesData.filter((a) => a.short !== agency.short).slice(0, 3);
  }, [agency]);

  if (!agency) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Nav />
        <main className="mx-auto max-w-md px-6 py-24 text-center">
          <AlertTriangle className="mx-auto size-12 text-warning animate-bounce" />
          <h1 className="mt-4 text-xl font-bold">Agency Profile Not Found</h1>
          <p className="mt-2 text-muted-foreground">
            We couldn't find a record for MDA acronym "{agencyShort}".
          </p>
          <div className="mt-6">
            <Link
              to="/agencies"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <ArrowLeft className="size-4" /> Back to MDA directory
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-secondary/25">
      <Nav />
      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Link
            to="/agencies"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            Back to MDA Directory
          </Link>
        </div>

        {/* Hero Header */}
        <div className="relative mb-10 overflow-hidden rounded-3xl border border-border bg-card/40 p-8 backdrop-blur-sm">
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <span className="grid size-16 place-items-center rounded-2xl bg-muted font-mono text-xl font-bold tracking-wider text-muted-foreground">
                {agency.short}
              </span>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">
                  {agency.name}
                </h1>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                  <Building className="size-4 text-muted-foreground" />
                  {agency.category}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 md:items-end">
              <PortalStatusBadge status={agency.portalStatus} />
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Clock className="size-3.5" /> Checked {agency.lastChecked}
              </p>
            </div>
          </div>
          <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-primary/5 blur-3xl" />
        </div>

        {/* Columns Grid */}
        <div className="grid gap-8 lg:grid-cols-[2.1fr_1fr]">
          {/* Main Content */}
          <div className="space-y-8">
            {/* About Section */}
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold tracking-tight mb-4 flex items-center gap-2">
                <Building className="size-5 text-primary" />
                About the MDA
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {agency.description}
              </p>
            </section>

            {/* Active Recruitments */}
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold tracking-tight mb-4 flex items-center gap-2">
                <Briefcase className="size-5 text-primary" />
                Active Recruitments
              </h2>
              {activeJobs.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {activeJobs.map((job) => (
                    <Link
                      key={job.id}
                      to="/jobs/$jobId"
                      params={{ jobId: job.id }}
                      className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 hover:border-primary/30 cursor-pointer transition-all hover:-translate-y-0.5"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono font-bold text-muted-foreground">
                            {job.id}
                          </span>
                          <StatusBadge status={job.status} />
                        </div>
                        <h4 className="mt-2 text-sm font-semibold group-hover:text-primary transition-colors line-clamp-1">
                          {job.title}
                        </h4>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/60 pt-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {job.deadline}
                        </span>
                        <span>{job.detected}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 rounded-xl bg-muted/30 border border-dashed border-border">
                  <Briefcase className="mx-auto size-8 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium">No open recruitments detected</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                    We currently do not track any ongoing recruitment campaigns for this agency.
                  </p>
                </div>
              )}
            </section>

            {/* Recruitment History (Timeline) */}
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold tracking-tight mb-6 flex items-center gap-2">
                <History className="size-5 text-primary" />
                Tracked Recruitment History
              </h2>
              <div className="relative border-l border-border pl-6 ml-4 space-y-8">
                {agency.history.map((hist, idx) => (
                  <div key={idx} className="relative">
                    {/* Circle marker */}
                    <span className="absolute -left-[31px] top-1.5 flex size-5 items-center justify-center rounded-full bg-background border border-primary">
                      <span className="size-2 rounded-full bg-primary" />
                    </span>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                          {hist.year}
                        </span>
                        <h4 className="text-sm font-semibold text-foreground">{hist.title}</h4>
                        <span className="text-[10px] font-mono-ui uppercase tracking-wider text-muted-foreground ml-auto bg-muted px-1.5 py-0.5 rounded">
                          {hist.status}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {hist.cadres.map((cadre, cidx) => (
                          <span
                            key={cidx}
                            className="inline-flex items-center gap-1 rounded bg-card px-2.5 py-1 text-xs text-muted-foreground border border-border"
                          >
                            {cadre}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trust and Score Panel */}
            <section className="rounded-2xl border border-verified/20 bg-verified/5 p-6 shadow-sm text-center">
              <ShieldCheck className="mx-auto size-10 text-verified mb-3" />
              <h3 className="text-base font-bold text-foreground">Official Safety Rating</h3>
              <div className="text-3xl font-extrabold text-primary mt-2">{agency.trustScore}%</div>

              <div className="h-1.5 w-full rounded-full bg-border/20 overflow-hidden mt-3 mb-4">
                <div
                  className="h-full rounded-full bg-verified"
                  style={{ width: `${agency.trustScore}%` }}
                />
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Recruitment portals are checked by GovAlert intelligence officers. Trust score depends on official domain extension, secure connections, and past scam reports.
              </p>
            </section>

            {/* MDA Portal Directory Card */}
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Official Directory Links
              </h3>

              <a
                href={agency.recruitmentPortal}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/30 bg-card hover:-translate-y-px transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <ExternalLink className="size-4 text-muted-foreground group-hover:text-primary" />
                  <span className="text-xs font-semibold">Recruitment Portal</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground group-hover:text-primary">
                  {agency.short.toLowerCase()}.gov.ng
                </span>
              </a>

              <a
                href={agency.officialWebsite}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/30 bg-card hover:-translate-y-px transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <Globe className="size-4 text-muted-foreground group-hover:text-primary" />
                  <span className="text-xs font-semibold">Corporate Website</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground group-hover:text-primary">
                  website →
                </span>
              </a>
            </section>

            {/* Anti-Scam Alert Card */}
            <section className="rounded-2xl border border-closed/20 bg-closed/5 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-closed">
                <AlertTriangle className="size-5 shrink-0" />
                <h4 className="text-sm font-bold">Anti-Scam Alert</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All federal recruitment registration exercises are **completely free of charge**. Never pay any agent, consultant, or third party requesting money for employment letters or placement services.
              </p>
            </section>
          </div>
        </div>

        {/* Similar Agencies */}
        {similarAgencies.length > 0 && (
          <section className="mt-12 space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">Other Monitored Agencies</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similarAgencies.map((sim) => (
                <Link
                  key={sim.short}
                  to="/agencies/$agencyShort"
                  params={{ agencyShort: sim.short }}
                  className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 hover:border-primary/30 cursor-pointer transition-all hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold text-muted-foreground">
                        {sim.short}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground border border-border">
                        {sim.category}
                      </span>
                    </div>
                    <h4 className="mt-2 text-sm font-semibold group-hover:text-primary transition-colors line-clamp-1">
                      {sim.name}
                    </h4>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/60 pt-3">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      Checked {sim.lastChecked}
                    </span>
                    <span className="text-primary font-medium group-hover:underline">
                      Profile →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
