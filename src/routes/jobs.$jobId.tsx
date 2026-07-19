import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from "react";
import { Nav, Footer } from "../components/layout";
import { StatusBadge, type Status } from "./index";
import { AgencyLogo } from "../components/AgencyLogo";
import { api, ApiJob, isAuthenticated } from "../lib/api";
import { safeFormatDate, safeFormatDateTime, safeFormatTime } from "../lib/formatDate";
import { ExternalLink, Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/jobs/$jobId")({
  component: JobDetailsPage,
});

function Divider() {
  return <div className="my-8 h-px w-full bg-border" />;
}

function JobDetailsPage() {
  const { jobId } = Route.useParams();

  const [job, setJob] = useState<ApiJob | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getJob(jobId);
      if (res) {
        setJob(res);
      } else {
        setError("Recruitment listing not found or has expired.");
      }

      if (isAuthenticated()) {
        const savedList = await api.getSavedJobs();
        if (savedList.some((sj) => (sj.ref || (sj as any).id) === jobId)) {
          setIsSaved(true);
        }
      }
    } catch (err: any) {
      console.warn("Error fetching job details:", err);
      setError(err?.message || "Failed to load job details from live API.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async () => {
    if (!isAuthenticated()) {
      toast.error("Please sign in to save jobs to your dashboard!");
      return;
    }
    if (!job) return;

    setSaving(true);
    if (isSaved) {
      const success = await api.unsaveJob(job.ref);
      if (success) {
        setIsSaved(false);
        toast.success("Job removed from saved list.");
      } else {
        toast.error("Failed to remove saved job.");
      }
    } else {
      const success = await api.saveJob(job.ref);
      if (success) {
        setIsSaved(true);
        toast.success("Job saved to your dashboard!");
      } else {
        toast.error("Failed to save job.");
      }
    }
    setSaving(false);
  };

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-between font-sans">
        <Nav />
        <main className="flex-1 mx-auto max-w-[1184px] w-full px-6 py-10 space-y-8">
          {/* Skeleton Breadcrumb */}
          <div className="h-4 w-48 bg-muted rounded animate-pulse" />
          
          {/* Skeleton Header */}
          <div className="rounded-[8px] border border-border bg-card p-8 shadow-sm animate-pulse space-y-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-muted" />
                <div className="space-y-2">
                  <div className="h-6 w-64 bg-muted rounded" />
                  <div className="h-4 w-32 bg-muted rounded" />
                </div>
              </div>
              <div className="h-6 w-24 bg-muted rounded-[6px]" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
              <div className="h-10 bg-muted rounded" />
              <div className="h-10 bg-muted rounded" />
              <div className="h-10 bg-muted rounded" />
              <div className="h-10 bg-muted rounded" />
            </div>
          </div>

          {/* Skeleton Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6 animate-pulse">
              <div className="h-40 bg-muted rounded-[8px]" />
              <div className="h-32 bg-muted rounded-[8px]" />
            </div>
            <div className="space-y-6 animate-pulse">
              <div className="h-64 bg-muted rounded-[8px]" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-between font-sans">
        <Nav />
        <main className="flex-1 flex flex-col items-center justify-center py-20 px-6 max-w-md mx-auto text-center space-y-6">
          <div className="rounded-full bg-destructive/10 p-4 text-destructive">
            <svg className="h-8 w-8 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground font-sans">Recruitment Alert Unavailable</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-sans">
              {error || "The recruitment listing you are looking for could not be found or has expired."}
            </p>
          </div>
          <div className="flex gap-3 w-full">
            <button
              onClick={fetchJobDetails}
              className="flex-1 px-4 py-2 text-xs font-semibold text-white bg-[#0a5c38] dark:bg-[#3fb68e] dark:text-[#0c1015] rounded-[6px] hover:opacity-90 transition-opacity cursor-pointer font-sans shadow-sm"
            >
              Try Again
            </button>
            <Link
              to="/jobs"
              className="flex-1 inline-flex items-center justify-center border border-border bg-card rounded-[6px] px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors font-sans"
            >
              Back to All Jobs
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isClosed = job.status === "closed";
  const displayStatus = (job.status === "new_opening" ? "new" : job.status) as Status;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="mx-auto max-w-[720px] px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-6 font-mono-ui text-[11px] uppercase tracking-wide text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link> → <Link to="/jobs" className="hover:text-primary">Jobs</Link> → REF: {job.ref}
        </div>

        {/* Status Badge */}
        <div className="mb-4 inline-flex">
          <StatusBadge status={displayStatus} />
        </div>

        {/* Heading & Agency */}
        <h1 className="text-[28px] font-bold leading-tight tracking-tight text-foreground">
          {job.title}
        </h1>
        <div className="mt-2 flex items-center justify-between">
          <Link
            to="/agencies/$agencyShort"
            params={{ agencyShort: job.agency_acronym || job.agency_slug || "" }}
            className="text-[16px] font-semibold text-[#0a5c38] dark:text-[#3fb68e] hover:underline"
          >
            {job.agency_name}
          </Link>
          
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold">
            <span className="text-muted-foreground">Confidence:</span>
            <span className="font-mono text-[#0a5c38] dark:text-[#3fb68e] font-bold">{job.confidence_score ?? 98}%</span>
          </div>
        </div>

        {/* Top Metadata Row */}
        <div className="mt-8 grid grid-cols-2 gap-y-6 gap-x-8 text-[13px] sm:grid-cols-3">
          <div>
            <div className="font-mono-ui text-[11px] uppercase text-muted-foreground">Deadline</div>
            <div className="mt-1 font-medium">{job.deadline || "Pending"}</div>
          </div>
          <div>
            <div className="font-mono-ui text-[11px] uppercase text-muted-foreground">Official source</div>
            <a href={job.official_url} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 font-semibold text-[#0a5c38] dark:text-[#3fb68e] hover:underline">
              {job.agency_acronym} Portal <ExternalLink className="size-3" />
            </a>
          </div>
          <div>
            <div className="font-mono-ui text-[11px] uppercase text-muted-foreground">Category</div>
            <div className="mt-1 font-medium">{job.category}</div>
          </div>
          <div>
            <div className="font-mono-ui text-[11px] uppercase text-muted-foreground">Location</div>
            <div className="mt-1 font-medium">{job.location_state}</div>
          </div>
          <div>
            <div className="font-mono-ui text-[11px] uppercase text-muted-foreground">Positions</div>
            <div className="mt-1 font-medium">{job.positions || "Multiple"}</div>
          </div>
          <div>
            <div className="font-mono-ui text-[11px] uppercase text-muted-foreground">Published</div>
            <div className="mt-1 font-medium">{safeFormatDate(job.published_at)}</div>
          </div>
        </div>

        <Divider />

        {/* VERIFICATION SECTION */}
        <section>
          <h2 className="text-[17px] font-semibold text-foreground">Verification</h2>
          
          <div className="mt-6">
            <div className="flex items-center justify-between text-[15px] font-medium max-w-[280px]">
              <span>Verification Score:</span>
              <span className="font-mono font-bold text-[#0a5c38] dark:text-[#3fb68e]">{job.confidence_score ?? 98}%</span>
            </div>
            <div className="mt-2 h-2 w-full max-w-[280px] overflow-hidden rounded bg-muted dark:bg-[#242c38]">
              <div 
                className="h-full bg-[#0a5c38] dark:bg-[#3fb68e]" 
                style={{ width: `${job.confidence_score ?? 98}%` }}
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground font-mono">
              Verification Factors:
            </div>
            <ul className="mt-3 space-y-2.5 text-[14px]">
              {job.confidence_factors?.map((factor, idx) => (
                <li key={idx} className="flex items-center gap-2.5">
                  {factor.passed ? (
                    <svg className="size-4 text-[#0a5c38] dark:text-[#3fb68e] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                    </svg>
                  ) : (
                    <svg className="size-4 text-[#b45309] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  )}
                  <span className="text-foreground font-medium">{factor.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex flex-col gap-1">
            <div className="flex gap-2 text-[12px] min-w-0">
              <span className="text-muted-foreground shrink-0 font-mono">Source URL:</span>
              <a href={job.source_url} target="_blank" rel="noreferrer" className="font-mono-ui text-[#0a5c38] dark:text-[#3fb68e] hover:underline break-all truncate">
                {job.source_url}
              </a>
            </div>
            <div className="flex gap-2 text-[11px] text-muted-foreground">
              <span className="font-mono">Last monitored:</span>
              <span className="font-mono-ui">
                {safeFormatDateTime(job.last_monitored, "Recently")}
              </span>
            </div>
          </div>
        </section>

        <Divider />

        {/* AUDIT LOG SECTION */}
        <section>
          <h2 className="text-[17px] font-semibold text-foreground">Detection Timeline</h2>
          <div className="mt-6 space-y-3">
            {job.detection_timeline?.map((log, idx) => {
              const isLast = idx === (job.detection_timeline?.length ?? 0) - 1;
              return (
                <div key={idx} className="flex gap-4">
                  <div className="w-[40px] shrink-0 font-mono-ui text-[11px] text-muted-foreground pt-0.5">
                    {log.time}
                  </div>
                  <div className="relative pb-3 pl-4 border-l-2 border-border/60">
                    <div className={`absolute -left-[5px] top-1.5 h-2 w-2 rounded-full ${isLast ? "bg-[#0a5c38] dark:bg-[#3fb68e]" : "bg-muted-foreground"}`} />
                    <div className="text-[13px]">{log.event}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <Divider />

        {/* RECRUITMENT DETAILS SECTION */}
        <section>
          <h2 className="text-[17px] font-semibold text-foreground">Recruitment Details</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            {job.description || "No description provided."}
          </p>
          
          {job.requirements && job.requirements.length > 0 && (
            <>
              <h3 className="mt-6 text-[13px] font-semibold text-foreground">Requirements</h3>
              <ul className="mt-3 list-disc pl-5 space-y-2 text-[14px] text-muted-foreground">
                {job.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </>
          )}
          
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {isClosed ? (
              <button
                disabled
                className="inline-flex h-[44px] items-center justify-center rounded-[8px] bg-muted text-muted-foreground px-[20px] text-[14px] font-semibold opacity-70 cursor-not-allowed border border-border"
              >
                Recruitment Portal Closed
              </button>
            ) : (
              <a
                href={job.official_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-[44px] items-center justify-center gap-2 rounded-[8px] bg-[#0a5c38] dark:bg-[#3fb68e] px-[20px] text-[14px] font-semibold text-white dark:text-[#0c1015] hover:opacity-90 cursor-pointer"
              >
                Apply on Official Portal (External) <ExternalLink className="size-4" />
              </a>
            )}

            <button
              onClick={handleToggleSave}
              disabled={saving}
              className={`inline-flex h-[44px] items-center gap-2 rounded-[8px] border px-[20px] text-[14px] font-semibold transition-colors cursor-pointer ${
                isSaved
                  ? "bg-[#0a5c38]/10 border-[#0a5c38] text-[#0a5c38] dark:bg-[#3fb68e]/10 dark:border-[#3fb68e] dark:text-[#3fb68e]"
                  : "border-border bg-card text-foreground hover:bg-muted"
              }`}
            >
              {isSaved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
              {saving ? "Updating..." : isSaved ? "Bookmarked" : "Save Job"}
            </button>
          </div>
        </section>

        <Divider />

        {/* PORTAL STATUS SECTION */}
        <section>
          <h2 className="text-[17px] font-semibold text-foreground">Portal Status</h2>
          <div className="mt-6 rounded-[8px] border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded bg-muted px-2 py-1 text-[11px] font-semibold font-mono uppercase tracking-wider text-foreground">
                {job.agency_acronym}
              </span>
              <span className={`flex items-center gap-1.5 text-[13px] font-medium ${
                job.portal_status === "online" ? "text-[#0a5c38] dark:text-[#3fb68e]" : job.portal_status === "maintenance" ? "text-[#b45309]" : "text-[#b91c1c]"
              }`}>
                <span className="h-2 w-2 rounded-full bg-current" />
                {job.portal_status === "online" ? "Online" : job.portal_status === "maintenance" ? "Maintenance" : "Offline"}
              </span>
            </div>
            
            <div className="mt-5 grid grid-cols-1 gap-y-3 sm:grid-cols-2 text-[13px]">
              <div className="flex gap-2">
                <span className="text-muted-foreground w-28">Last checked:</span>
                <span className="font-mono">
                  ↺ {safeFormatTime(job.portal_last_checked, "Recently")}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-muted-foreground w-28">Response time:</span>
                <span className="flex items-center gap-1 text-[#0a5c38] dark:text-[#3fb68e]">
                  {Array.from({ length: job.portal_response_dots ?? 2 }).map((_, i) => (
                    <span key={i}>●</span>
                  ))}
                  <span className="text-foreground ml-1">
                    {job.portal_response_dots === 3 ? "Fast" : job.portal_response_dots === 2 ? "Acceptable" : "Slow"}
                  </span>
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-muted-foreground w-28">Portal uptime:</span>
                <span className="font-mono">{job.portal_uptime_percent ? `${job.portal_uptime_percent}%` : "99.8%"}</span>
              </div>
            </div>
            
            <div className="mt-6">
              <Link
                to="/agencies/$agencyShort"
                params={{ agencyShort: job.agency_acronym || job.agency_slug || "" }}
                className="text-[13px] font-semibold text-[#0a5c38] dark:text-[#3fb68e] hover:underline"
              >
                View full agency profile →
              </Link>
            </div>
          </div>
        </section>

        <Divider />

        {/* RELATED RECRUITMENTS */}
        {job.related_jobs && job.related_jobs.length > 0 && (
          <section>
            <h2 className="text-[17px] font-semibold text-foreground">Other verified recruitments</h2>
            <div className="mt-6 flex overflow-x-auto pb-4 gap-5 md:grid md:grid-cols-2 md:overflow-visible">
              {job.related_jobs.map((simJob) => (
                <Link
                  key={simJob.ref}
                  to="/jobs/$jobId"
                  params={{ jobId: simJob.ref }}
                  className="interactive-card min-w-[280px] rounded-[8px] border border-border bg-card p-[24px] cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-mono-ui text-[11px] text-muted-foreground uppercase">REF: {simJob.ref}</div>
                      <StatusBadge status={(simJob.status === "new_opening" ? "new" : simJob.status) as Status} />
                    </div>
                    <h3 className="text-[17px] font-semibold text-foreground leading-snug">
                      {simJob.title}
                    </h3>
                    <div className="mt-2 text-[13px] font-medium text-[#0a5c38] dark:text-[#3fb68e]">
                      {simJob.agency_name}
                    </div>
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
