import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Nav, Footer } from "../components/layout";
import { latestJobs, StatusBadge, type Job } from "./index";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/jobs/$jobId")({
  component: JobDetailsPage,
  head: ({ params }) => {
    const job = latestJobs.find((j) => j.id === params.jobId);
    return {
      meta: [
        { title: job ? `${job.agencyShort} Recruitment Details | GovAlert` : `Recruitment Details | GovAlert` }
      ],
    };
  }
});

interface AuditLog {
  time: string;
  desc: string;
}

interface VerificationCheck {
  status: "pass" | "fail" | "warn";
  desc: string;
}

interface JobDetails {
  description: string;
  positions: string[];
  requirements: string[];
  trustScore: number;
  portalUrl: string;
  sourceUrl: string;
  lastMonitored: string;
  refCode: string;
  salaryRange?: string;
  eligibility: string;
  published: string;
  checks: VerificationCheck[];
  auditLogs: AuditLog[];
  portalUptime: string;
  portalResponseTime: "Fast" | "Acceptable" | "Slow" | "Offline";
}

const detailedMockData: Record<string, JobDetails> = {
  "8829-GA": {
    description:
      "The NNPC Limited Graduate Trainee Program (Engineering, 2024) is a highly competitive career entry pathway designed to discover and cultivate the next generation of technical talent. Trainees will undergo intensive classroom and on-the-job training across various gas, refinery, and energy assets in Nigeria, preparing them for pivotal engineering roles in the nation's energy sector.",
    positions: [
      "Graduate Trainee - Mechanical Engineering",
      "Graduate Trainee - Chemical & Process Engineering",
      "Graduate Trainee - Petroleum Engineering",
      "Graduate Trainee - Electrical & Instrumentation Engineering",
    ],
    requirements: [
      "Bachelor's degree with a minimum of Second Class Upper (2:1) or HND Upper Credit in relevant engineering fields.",
      "Must have completed the mandatory National Youth Service Corps (NYSC) by October 2024.",
      "Applicants must not be more than 28 years of age at the time of application.",
      "Excellent analytical, problem-solving, and communication skills.",
      "Basic understanding of energy systems, oil & gas operations, and safety management.",
    ],
    trustScore: 98,
    portalUrl: "https://careers.nnpcgroup.com",
    sourceUrl: "https://nnpcgroup.com/careers/2024-graduate-trainee",
    lastMonitored: "14 Jul 2026, 08:43 WAT",
    refCode: "8829-GA",
    salaryRange: "N350,000 - N450,000 monthly (during training)",
    eligibility: "Nigerian Citizens Only",
    published: "2h ago",
    checks: [
      { status: "pass", desc: "Official domain confirmed (nnpcgroup.com/careers)" },
      { status: "pass", desc: "Content matches previous NNPC announcement format" },
      { status: "pass", desc: "No duplicate in 30-day detection window" },
      { status: "pass", desc: "Historical pattern consistent with 2023 Graduate Trainee" },
      { status: "warn", desc: "Manual review: Not required" },
    ],
    auditLogs: [
      { time: "09:13", desc: "Announcement detected on NNPC portal" },
      { time: "09:14", desc: "Domain verified — official source confirmed" },
      { time: "09:14", desc: "Content extracted and fingerprinted" },
      { time: "09:15", desc: "Duplicate check: passed" },
      { time: "09:16", desc: "Historical comparison: consistent format" },
      { time: "09:17", desc: "Confidence: 98% — published to feed" },
    ],
    portalUptime: "99.8%",
    portalResponseTime: "Fast",
  },
};

function getFallbackDetails(job: Job): JobDetails {
  return {
    description: `Recruitment at the ${job.agency} has been opened for the role of ${job.title}. This position operates within the ${job.category} framework and is located in ${job.state} State. Candidates will be integrated into the federal career path and participate in intensive briefing and service delivery programs.`,
    positions: [`${job.title} (Level I)`, `${job.title} (Support)`, `Assistant ${job.title}`],
    requirements: [
      "Relevant educational qualifications (Degree, HND, or O'level depending on specific cadre).",
      "NYSC discharge certificate or exemption letter where applicable.",
      "Age must be within the civil service requirements (typically 18 to 35 years).",
      "Applicants must possess strong analytical, teamwork, and organizational skills.",
      "Must have a clean record of public and professional conduct.",
    ],
    trustScore: job.status === "verified" || job.status === "urgent" ? 95 : job.status === "warning" ? 85 : 90,
    portalUrl: `https://recruitment.${job.agencyShort.toLowerCase()}.gov.ng`,
    sourceUrl: `https://recruitment.${job.agencyShort.toLowerCase()}.gov.ng/apply`,
    lastMonitored: "14 Jul 2026, 08:43 WAT",
    refCode: `${job.agencyShort}/REC/${job.id}`,
    salaryRange: "Standard Federal Civil Service Scale",
    eligibility: "Nigerian Citizens Only",
    published: "2h ago",
    checks: [
      { status: "pass", desc: "Official .gov.ng domain confirmed" },
      { status: "pass", desc: "Content matches previous announcement format" },
      { status: "pass", desc: "No duplicate detected in 30-day window" },
      { status: "warn", desc: "Manual review: Not required" },
    ],
    auditLogs: [
      { time: "09:13", desc: `Announcement detected on ${job.agencyShort} portal` },
      { time: "09:14", desc: "Domain verified — official source confirmed" },
      { time: "09:14", desc: "Content extracted and fingerprinted" },
      { time: "09:15", desc: "Duplicate check: passed" },
      { time: "09:17", desc: `Confidence: ${job.status === "verified" ? "95%" : "85%"} — published to feed` },
    ],
    portalUptime: "99.8%",
    portalResponseTime: "Fast",
  };
}

function Divider() {
  return <div className="my-8 h-px w-full bg-border" />;
}

export default function JobDetailsPage() {
  const { jobId } = Route.useParams();

  const job = useMemo(() => {
    return latestJobs.find((j) => j.id === jobId);
  }, [jobId]);

  const details = useMemo(() => {
    if (!job) return null;
    return detailedMockData[job.id] || getFallbackDetails(job);
  }, [job]);

  const similarJobs = useMemo(() => {
    if (!job) return [];
    return latestJobs.filter((j) => j.category === job.category && j.id !== job.id).slice(0, 3);
  }, [job]);

  if (!job || !details) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Nav />
        <main className="mx-auto max-w-[640px] px-6 py-24 text-center">
          <h1 className="text-[28px] font-bold text-foreground">Listing not found</h1>
          <p className="mt-2 text-[15px] text-muted-foreground">
            The listing you are looking for is unavailable or has been archived.
          </p>
          <div className="mt-8">
            <Link
              to="/jobs"
              className="inline-flex h-[36px] items-center justify-center rounded-[8px] bg-primary px-4 text-[14px] font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Back to Jobs
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="mx-auto max-w-[720px] px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-6 font-mono-ui text-[11px] uppercase tracking-wide text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link> → <Link to="/jobs" className="hover:text-primary">Jobs</Link> → REF: {details.refCode}
        </div>

        {/* Status Badge */}
        <div className="mb-4 inline-flex">
          <StatusBadge status={job.status} />
        </div>

        {/* Heading & Agency */}
        <h1 className="text-[28px] font-bold leading-tight tracking-tight text-foreground">
          {job.title}
        </h1>
        <div className="mt-2">
          <Link to="/agencies" className="text-[16px] font-medium text-[#0a5c38] dark:text-[#3fb68e] hover:underline">
            {job.agency}
          </Link>
        </div>

        {/* Top Metadata Row */}
        <div className="mt-8 grid grid-cols-2 gap-y-6 gap-x-8 text-[13px]">
          <div>
            <div className="font-mono-ui text-[11px] uppercase text-muted-foreground">Deadline</div>
            <div className="mt-1 font-medium">{job.deadline}</div>
          </div>
          <div>
            <div className="font-mono-ui text-[11px] uppercase text-muted-foreground">Official source</div>
            <a href={details.portalUrl} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 font-semibold text-[#0a5c38] dark:text-[#3fb68e] hover:underline">
              {job.agencyShort} Portal <ExternalLink className="size-3" />
            </a>
          </div>
          <div>
            <div className="font-mono-ui text-[11px] uppercase text-muted-foreground">Category</div>
            <div className="mt-1 font-medium">{job.category}</div>
          </div>
          <div>
            <div className="font-mono-ui text-[11px] uppercase text-muted-foreground">Location</div>
            <div className="mt-1 font-medium">{job.state}</div>
          </div>
          <div>
            <div className="font-mono-ui text-[11px] uppercase text-muted-foreground">Positions</div>
            <div className="mt-1 font-medium">Multiple</div>
          </div>
          <div>
            <div className="font-mono-ui text-[11px] uppercase text-muted-foreground">Published</div>
            <div className="mt-1 font-medium">{details.published}</div>
          </div>
        </div>

        <Divider />

        {/* VERIFICATION SECTION */}
        <section>
          <h2 className="text-[17px] font-semibold text-foreground">Verification</h2>
          
          <div className="mt-6">
            <div className="text-[15px] font-medium">Confidence: {details.trustScore}%</div>
            <div className="mt-2 h-2 w-full max-w-[200px] overflow-hidden rounded bg-border">
              <div 
                className="h-full bg-[#0a5c38] dark:bg-[#3fb68e]" 
                style={{ width: `${details.trustScore}%` }}
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="text-[15px] text-muted-foreground">Based on:</div>
            <ul className="mt-3 space-y-2 text-[14px]">
              {details.checks.map((check, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className={`font-mono-ui ${check.status === "pass" ? "text-verified" : "text-warning"}`}>
                    {check.status === "pass" ? "✓" : "!"}
                  </span>
                  <span>{check.desc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex flex-col gap-1">
            <div className="flex gap-2 text-[12px]">
              <span className="text-muted-foreground">Source URL:</span>
              <a href={details.sourceUrl} target="_blank" rel="noreferrer" className="font-mono-ui text-[#0a5c38] dark:text-[#3fb68e] hover:underline break-all">
                {details.sourceUrl}
              </a>
            </div>
            <div className="flex gap-2 text-[11px] text-muted-foreground">
              <span>Last monitored:</span>
              <span className="font-mono-ui">{details.lastMonitored}</span>
            </div>
          </div>
        </section>

        <Divider />

        {/* AUDIT LOG SECTION */}
        <section>
          <h2 className="text-[17px] font-semibold text-foreground">Detection Timeline</h2>
          <div className="mt-6 space-y-3">
            {details.auditLogs.map((log, idx) => {
              const isLast = idx === details.auditLogs.length - 1;
              return (
                <div key={idx} className="flex gap-4">
                  <div className="w-[40px] shrink-0 font-mono-ui text-[11px] text-muted-foreground pt-0.5">
                    {log.time}
                  </div>
                  <div className="relative pb-3 pl-4 border-l-2 border-border/60">
                    <div className={`absolute -left-[5px] top-1.5 h-2 w-2 rounded-full ${isLast ? "bg-[#0a5c38] dark:bg-[#3fb68e]" : "bg-muted-foreground"}`} />
                    <div className="text-[13px]">{log.desc}</div>
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
            {details.description}
          </p>
          
          <h3 className="mt-6 text-[13px] font-semibold text-foreground">Requirements</h3>
          <ul className="mt-3 list-disc pl-5 space-y-2 text-[14px] text-muted-foreground">
            {details.requirements.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
          
          <div className="mt-8">
            <a
              href={details.portalUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-[36px] items-center justify-center rounded-[8px] bg-[#0a5c38] dark:bg-[#3fb68e] px-[16px] text-[14px] font-semibold text-white dark:text-[#0c1015] hover:opacity-90"
            >
              Link to official application page
            </a>
          </div>
        </section>

        <Divider />

        {/* PORTAL STATUS SECTION */}
        <section>
          <h2 className="text-[17px] font-semibold text-foreground">Portal Status</h2>
          <div className="mt-6 rounded-[8px] border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded bg-muted px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-foreground">
                {job.agencyShort}
              </span>
              <span className="flex items-center gap-1.5 text-[13px] font-medium text-[#0a5c38] dark:text-[#3fb68e]">
                <span className="h-2 w-2 rounded-full bg-current" />
                Online
              </span>
            </div>
            
            <div className="mt-5 grid grid-cols-1 gap-y-3 sm:grid-cols-2 text-[13px]">
              <div className="flex gap-2">
                <span className="text-muted-foreground w-28">Last checked:</span>
                <span className="font-mono-ui">↺ 2m ago</span>
              </div>
              <div className="flex gap-2">
                <span className="text-muted-foreground w-28">Response time:</span>
                <span className="flex items-center gap-1 text-[#0a5c38] dark:text-[#3fb68e]">
                  ●●● <span className="text-foreground ml-1">{details.portalResponseTime}</span>
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-muted-foreground w-28">Portal uptime:</span>
                <span>{details.portalUptime}</span>
              </div>
            </div>
            
            <div className="mt-6">
              <Link
                to="/agencies/$agencyShort"
                params={{ agencyShort: job.agencyShort }}
                className="text-[13px] font-semibold text-[#0a5c38] dark:text-[#3fb68e] hover:underline"
              >
                View full agency profile →
              </Link>
            </div>
          </div>
        </section>

        <Divider />

        {/* RELATED RECRUITMENTS */}
        {similarJobs.length > 0 && (
          <section>
            <h2 className="text-[17px] font-semibold text-foreground">Other verified recruitments</h2>
            <div className="mt-6 flex overflow-x-auto pb-4 gap-5 md:grid md:grid-cols-2 md:overflow-visible">
              {similarJobs.map((simJob) => (
                <Link
                  key={simJob.id}
                  to="/jobs/$jobId"
                  params={{ jobId: simJob.id }}
                  className="interactive-card min-w-[280px] rounded-[8px] border border-border bg-card p-[24px] cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-mono-ui text-[11px] text-muted-foreground uppercase">REF: {simJob.agencyShort}/REC/{simJob.id}</div>
                      <StatusBadge status={simJob.status} />
                    </div>
                    <h3 className="text-[17px] font-semibold text-foreground leading-snug">
                      {simJob.title}
                    </h3>
                    <div className="mt-2 text-[13px] font-medium text-[#0a5c38] dark:text-[#3fb68e]">
                      {simJob.agency}
                    </div>
                  </div>
                  
                  <div className="mt-6 border-t border-border pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="font-mono-ui text-[11px] uppercase tracking-wide text-muted-foreground">Deadline</div>
                        <div className="mt-1 text-[13px] font-medium">{simJob.deadline}</div>
                      </div>
                      <div>
                        <div className="font-mono-ui text-[11px] uppercase tracking-wide text-muted-foreground">Verification</div>
                        <div className="mt-1 text-[12px] font-semibold text-[#0a5c38] dark:text-[#3fb68e]">
                          OFFICIAL SOURCE ↗
                        </div>
                      </div>
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
