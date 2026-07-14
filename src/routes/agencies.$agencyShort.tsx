import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Nav, Footer } from "../components/layout";
import { agenciesData } from "../lib/agenciesData";
import { latestJobs, StatusBadge } from "./index";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/agencies/$agencyShort")({
  component: AgencyProfilePage,
  head: ({ params }) => {
    const agency = agenciesData.find((x) => x.short.toUpperCase() === params.agencyShort.toUpperCase());
    return {
      meta: [
        { title: agency ? `${agency.short} Portal Status | GovAlert` : `Agency Profile | GovAlert` }
      ],
    };
  }
});

function Divider() {
  return <div className="my-8 h-px w-full bg-border" />;
}

export default function AgencyProfilePage() {
  const { agencyShort } = Route.useParams();

  const agency = useMemo(() => {
    return agenciesData.find((a) => a.short.toUpperCase() === agencyShort.toUpperCase());
  }, [agencyShort]);

  const activeJobs = useMemo(() => {
    if (!agency) return [];
    return latestJobs.filter((j) => j.agencyShort.toUpperCase() === agency.short.toUpperCase());
  }, [agency]);

  if (!agency) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Nav />
        <main className="mx-auto max-w-[640px] px-6 py-24 text-center">
          <h1 className="text-[28px] font-bold text-foreground">Agency not found</h1>
          <p className="mt-2 text-[15px] text-muted-foreground">
            We couldn't find a record for MDA acronym "{agencyShort}".
          </p>
          <div className="mt-8">
            <Link
              to="/agencies"
              className="inline-flex h-[36px] items-center justify-center rounded-[8px] bg-[#0a5c38] dark:bg-[#3fb68e] px-4 text-[14px] font-semibold text-white dark:text-[#0c1015] hover:opacity-90"
            >
              Back to MDA Directory
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isOnline = agency.portalStatus === "online";
  const portalUrlDisplay = agency.recruitmentPortal.replace(/^https?:\/\//, "");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="mx-auto max-w-[720px] px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-6 font-mono-ui text-[11px] uppercase tracking-wide text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link> → <Link to="/agencies" className="hover:text-primary">Agencies</Link> → {agency.short}
        </div>

        {/* Agency Header */}
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center justify-center rounded bg-muted border border-border px-3 py-1 text-[18px] font-bold text-foreground font-sans">
            {agency.short}
          </span>
          <span className="flex items-center gap-1.5 text-[14px] font-medium text-[#0a5c38] dark:text-[#3fb68e]">
            <span className={`h-2 w-2 rounded-full ${isOnline ? "bg-current" : "bg-warning"}`} />
            {isOnline ? "Online" : "Maintenance"}
          </span>
        </div>

        <h1 className="mt-4 text-[28px] font-bold leading-tight tracking-tight text-foreground">
          {agency.name}
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground max-w-[600px] line-clamp-2">
          {agency.description}
        </p>

        {/* Status Row */}
        <div className="mt-8 grid grid-cols-2 gap-y-4 gap-x-8 text-[14px] md:grid-cols-3">
          <div className="flex gap-2">
            <span className="text-muted-foreground w-24 shrink-0">Portal:</span>
            <span className="font-medium text-foreground">{isOnline ? "Online" : "Offline"}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-muted-foreground w-24 shrink-0">Monitoring:</span>
            <span className="font-medium text-foreground">Every 5 minutes</span>
          </div>
          <div className="flex gap-2">
            <span className="text-muted-foreground w-24 shrink-0">Uptime:</span>
            <span className="font-medium text-foreground">99.8%</span>
          </div>
          <div className="flex gap-2">
            <span className="text-muted-foreground w-24 shrink-0">Avg response:</span>
            <span className="font-medium text-[#0a5c38] dark:text-[#3fb68e]">●●● <span className="text-foreground ml-1">Fast</span></span>
          </div>
          <div className="flex gap-2">
            <span className="text-muted-foreground w-24 shrink-0">Detected:</span>
            <span className="font-medium text-foreground">14 recruitments</span>
          </div>
          <div className="flex gap-2">
            <span className="text-muted-foreground w-24 shrink-0">Last update:</span>
            <span className="font-medium text-foreground">Today, 08:43</span>
          </div>
        </div>

        {/* Official Portal Link */}
        <div className="mt-6">
          <a
            href={agency.recruitmentPortal}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#0a5c38] dark:text-[#3fb68e] hover:underline"
          >
            <ExternalLink className="size-4" /> {portalUrlDisplay}
          </a>
        </div>

        <Divider />

        {/* ACTIVE RECRUITMENTS */}
        <section>
          <h2 className="text-[17px] font-semibold text-foreground">Active Recruitments</h2>
          {activeJobs.length > 0 ? (
            <div className="mt-6 space-y-4">
              {activeJobs.map((job) => (
                <Link
                  key={job.id}
                  to="/jobs/$jobId"
                  params={{ jobId: job.id }}
                  className="interactive-card flex flex-col justify-between rounded-[8px] border border-border bg-card p-[24px] cursor-pointer md:flex-row md:items-center"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4 md:mb-2 md:justify-start md:gap-4">
                      <div className="font-mono-ui text-[11px] text-muted-foreground uppercase">REF: {job.agencyShort}/REC/{job.id}</div>
                      <StatusBadge status={job.status} />
                    </div>
                    <h3 className="text-[17px] font-semibold text-foreground leading-snug">
                      {job.title}
                    </h3>
                  </div>
                  <div className="mt-4 shrink-0 border-t border-border pt-4 md:mt-0 md:border-0 md:pt-0 md:pl-6 md:text-right">
                    <div className="font-mono-ui text-[11px] uppercase tracking-wide text-muted-foreground">Deadline</div>
                    <div className="mt-1 text-[13px] font-medium">{job.deadline}</div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-6 flex flex-col items-center justify-center rounded-[8px] border border-border bg-card p-12 text-center">
              <svg className="size-[48px] text-muted-foreground mb-4" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 className="text-[17px] font-semibold text-foreground">No active recruitment detected</h3>
              <div className="mt-2 text-[14px] text-muted-foreground">Last checked: <span className="font-mono-ui">14 Jul 2026, 08:43 WAT</span></div>
              <p className="mt-4 text-[14px] text-muted-foreground">This portal is being monitored. We will alert you when a recruitment appears.</p>
              <a
                href="https://t.me/GovAlert"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex h-[36px] items-center justify-center rounded-[8px] border border-[#0a5c38] dark:border-[#3fb68e] bg-transparent px-[16px] text-[14px] font-semibold text-[#0a5c38] dark:text-[#3fb68e] hover:bg-[#0a5c38]/5 dark:hover:bg-[#3fb68e]/10"
              >
                Subscribe to alerts for this agency
              </a>
            </div>
          )}
        </section>

        <Divider />

        {/* RECRUITMENT HISTORY */}
        <section>
          <h2 className="text-[17px] font-semibold text-foreground">Recruitment History</h2>
          <div className="mt-6 space-y-3">
            {[
              { date: "14 Jul 2026", desc: "Graduate Trainee (Engineering) detected" },
              { date: "12 Jul 2026", desc: "Portal checked, no changes" },
              { date: "10 Jul 2026", desc: "Application window opened" },
              { date: "08 Jul 2026", desc: "Vacancy announced" }
            ].map((hist, idx, arr) => {
              const isLast = idx === arr.length - 1;
              return (
                <div key={idx} className="flex gap-4">
                  <div className="w-[85px] shrink-0 font-mono-ui text-[11px] text-muted-foreground pt-0.5">
                    {hist.date}
                  </div>
                  <div className="relative pb-4 pl-4 border-l border-border/60">
                    <div className={`absolute -left-[4.5px] top-1.5 h-2 w-2 rounded-full ${idx === 0 ? "bg-[#0a5c38] dark:bg-[#3fb68e]" : "bg-muted-foreground/50"}`} />
                    <div className="text-[14px] text-foreground">{hist.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <Divider />

        {/* PORTAL HEALTH */}
        <section>
          <h2 className="text-[17px] font-semibold text-foreground">Portal Health</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <div className="text-[14px] text-muted-foreground">Response time (30 days)</div>
              <div className="mt-1 font-mono-ui text-[14px] font-medium text-[#0a5c38] dark:text-[#3fb68e]">~240ms</div>
            </div>
            <div>
              <div className="text-[14px] text-muted-foreground">Uptime</div>
              <div className="mt-1 font-mono-ui text-[14px] font-medium text-foreground">99.8%</div>
            </div>
            <div>
              <div className="text-[14px] text-muted-foreground">Last 10 checks</div>
              <div className="mt-1 flex items-center gap-1 font-mono-ui text-[#0a5c38] dark:text-[#3fb68e]">
                ●●●●●●●●●<span className="text-destructive">○</span>
              </div>
            </div>
            <div>
              <div className="text-[14px] text-muted-foreground">Last offline</div>
              <div className="mt-1 font-mono-ui text-[13px] text-foreground">13 Jul 2026, 03:12 WAT <span className="text-muted-foreground">(recovered in 18 mins)</span></div>
            </div>
          </div>
        </section>

        <Divider />

        {/* VERIFICATION TRACK RECORD */}
        <section>
          <h2 className="text-[17px] font-semibold text-foreground">Verification Track Record</h2>
          <div className="mt-6 grid grid-cols-1 gap-y-4 sm:grid-cols-2 text-[14px]">
            <div className="flex gap-2">
              <span className="text-muted-foreground w-48 shrink-0">Average confidence score:</span>
              <span className="font-semibold text-foreground">96%</span>
            </div>
            <div className="flex gap-2">
              <span className="text-muted-foreground w-48 shrink-0">Total announcements verified:</span>
              <span className="font-semibold text-foreground">14</span>
            </div>
            <div className="flex gap-2">
              <span className="text-muted-foreground w-48 shrink-0">False positives detected:</span>
              <span className="font-semibold text-foreground">0</span>
            </div>
            <div className="flex gap-2">
              <span className="text-muted-foreground w-48 shrink-0">Scam domains blocked:</span>
              <span className="font-semibold text-foreground">3</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
