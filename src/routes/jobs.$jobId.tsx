import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Nav, Footer } from "../components/layout";
import { latestJobs, StatusBadge, type Job } from "./index";
import { toast } from "sonner";
import {
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Share2,
  ExternalLink,
  Calendar,
  Clock,
  MapPin,
  Building,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Send,
} from "lucide-react";

export const Route = createFileRoute("/jobs/$jobId")({
  component: JobDetailsPage,
});

// Detailed mock metadata mapping for listings
interface JobDetails {
  description: string;
  positions: string[];
  requirements: string[];
  trustScore: number;
  portalUrl: string;
  trustReason: string;
  refCode: string;
  salaryRange?: string;
  eligibility: string;
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
    trustScore: 100,
    portalUrl: "https://careers.nnpcgroup.com",
    trustReason:
      "Official NNPC corporate domain (nnpcgroup.com) with valid Enterprise EV SSL encryption. DNS records match official Federal Ministry of Petroleum records.",
    refCode: "NNPC/GT/2024/002",
    salaryRange: "N350,000 - N450,000 monthly (during training)",
    eligibility: "Nigerian Citizens Only",
  },
  "4120-GA": {
    description:
      "The Nigeria Customs Service (NCS) invites applications from suitably qualified candidates for enlistment into the Superintendent Cadre. Selected candidates will undergo a 6-month intensive training program at the Nigeria Customs Service Command and Staff College in Gwagwalada, Abuja, encompassing paramilitary drills, customs laws, border control, and revenue operations.",
    positions: [
      "Assistant Superintendent of Customs II (General Duty) - CONSOL 08",
      "Assistant Superintendent of Customs II (Information Technology) - CONSOL 08",
      "Assistant Superintendent of Customs II (Accounts & Finance) - CONSOL 08",
    ],
    requirements: [
      "Bachelor's degree or equivalent (Second Class Lower minimum) from an accredited university.",
      "Age must be between 18 and 30 years as of December 31, 2024.",
      "Height must not be less than 1.7 metres for males and 1.64 metres for females.",
      "Chest measurement (for men only) must not be less than 0.87 metres fully expanded.",
      "Must be physically and medically fit with certificate from a government hospital.",
    ],
    trustScore: 96,
    portalUrl: "https://recruitment.customs.gov.ng",
    trustReason:
      "Hosted on official .gov.ng top-level government domain. Secure SSL certificates verified, matching Federal Government of Nigeria hosting architecture.",
    refCode: "NCS/REC/2024/SUP",
    salaryRange: "CONSOL 08 Scale",
    eligibility: "Nigerian Citizens Only",
  },
  "9001-GA": {
    description:
      "The Economic and Financial Crimes Commission (EFCC) Academy invites young, energetic, and patriotic Nigerians to apply for the Detective Assistant Cadet Course. This course prepares candidates for counter-fraud operations, financial intelligence gathering, and assets tracking duties under the EFCC Act.",
    positions: ["Detective Assistant Cadet (DA)", "Detective Inspector Cadet (DI)"],
    requirements: [
      "West African School Certificate (WASC/SSCE) with at least 5 credits including English and Mathematics in not more than 2 sittings.",
      "Age must be between 18 and 22 years at the time of training enlistment.",
      "Candidates must be single and remain so throughout the training period.",
      "Must undergo physical fitness test, medical examination, and drug screen.",
      "Clean criminal record (no record of indictment, arrest, or conviction).",
    ],
    trustScore: 97,
    portalUrl: "https://www.efcc.gov.ng/careers",
    trustReason:
      "Direct link verified from official EFCC portal. Active SSL certificate and official gov.ng DNS structure verified by GovAlert security desk.",
    refCode: "EFCC/CADET/2024/DA",
    salaryRange: "CONPAT 06 Scale",
    eligibility: "Nigerian Citizens Only",
  },
  "7712-GA": {
    description:
      "The Central Bank of Nigeria (CBN) is seeking outstanding candidates for the role of Economic Policy Analyst (Level 7) to join the Research and Monetary Policy Departments. Selected candidates will participate in macroeconomic research, policy formulation, inflation analysis, and fiscal-monetary coordination models.",
    positions: ["Economic Policy Analyst I", "Macroeconomic Modeller", "Monetary Policy Analyst"],
    requirements: [
      "Master's degree in Economics, Econometrics, Finance, or related quantitative discipline.",
      "Minimum of 3 years of post-qualification experience in a research institute, central bank, or development finance institution.",
      "Proficiency in econometric software (Stata, EViews, R, or Python).",
      "Advanced understanding of monetary policy transmission mechanisms and central banking principles.",
    ],
    trustScore: 88,
    portalUrl: "https://www.cbn.gov.ng/recruitment",
    trustReason:
      "Official CBN domain (cbn.gov.ng). Warning indicator active due to slow server response and intermittent access timeouts reported by applicant portals.",
    refCode: "CBN/RSD/2024/EPA",
    salaryRange: "CBN Grade Level 7",
    eligibility: "Nigerian Citizens Only",
  },
  "6650-GA": {
    description:
      "The Nigerian Air Force invites applications from qualified graduates and postgraduates for enlistment into the Direct Short Service Commission (DSSC Course 33). Enlisted candidates will undergo military training at the Military Training Centre, NAF Base Kaduna, before commission into the officer rank of Flying Officer.",
    positions: [
      "NAF DSSC Officer Cadet - Medical Cadre",
      "NAF DSSC Officer Cadet - Engineering Cadre",
      "NAF DSSC Officer Cadet - Legal Services Cadre",
      "NAF DSSC Officer Cadet - Education Cadre",
    ],
    requirements: [
      "Bachelor's degree with a minimum of Second Class Lower or HND Upper Credit in relevant professional courses.",
      "Must possess NYSC discharge certificate or letter of exemption.",
      "Must not be less than 20 years and not more than 30 years of age (35 years for Medical Consultants).",
      "Must be medically, physically, and psychologically fit for military service.",
    ],
    trustScore: 95,
    portalUrl: "https://nafrecruitment.airforce.mil.ng",
    trustReason:
      "Official military domain (.mil.ng) with valid SSL security. Domain belongs exclusively to the Nigerian Armed Forces Command.",
    refCode: "NAF/DSSC/33/2024",
    salaryRange: "Flying Officer Scale",
    eligibility: "Nigerian Citizens Only",
  },
  "5581-GA": {
    description:
      "The Federal Fire Service (FFS) invites applications from suitably qualified candidates for recruitment into full-time careers as General Duty Officers. Selected candidates will participate in active firefighting, rescue operations, fire prevention inspections, and disaster management programs.",
    positions: [
      "Assistant Superintendent of Fire II (ASF II) - CONPASS 08",
      "Inspector of Fire (IF) - CONPASS 06",
      "Fire Assistant II (FA II) - CONPASS 04",
    ],
    requirements: [
      "For ASF II: Bachelor's degree from a recognized institution.",
      "For IF: NCE or National Diploma (ND) from a recognized polytechnic.",
      "For FA II: WAEC/NECO/GCE with 3 credits including Maths and English.",
      "Age must be between 18 and 30 years.",
      "Height must not be less than 1.65 metres for males and 1.60 metres for females.",
    ],
    trustScore: 94,
    portalUrl: "https://fedfire.gov.ng/recruitment",
    trustReason:
      "Hosted on official .gov.ng government domain. Server and SSL verification successfully passed without reports of scam activity.",
    refCode: "FFS/REC/2024/B",
    salaryRange: "CONPASS Scale",
    eligibility: "Nigerian Citizens Only",
  },
};

// Default generic details generator for newly added mock jobs
function getFallbackDetails(job: Job): JobDetails {
  return {
    description: `Suits for recruitment at the ${job.agency} have been opened for the role of ${job.title}. This position operates within the ${job.category} framework and is located in ${job.state} State. Candidates will be integrated into the federal career path and participate in intensive briefing and service delivery programs.`,
    positions: [`${job.title} (Level I)`, `${job.title} (Support)`, `Assistant ${job.title}`],
    requirements: [
      "Relevant educational qualifications (Degree, HND, or O'level depending on specific cadre).",
      "NYSC discharge certificate or exemption letter where applicable.",
      "Age must be within the civil service requirements (typically 18 to 35 years).",
      "Applicants must possess strong analytical, teamwork, and organizational skills.",
      "Must have a clean record of public and professional conduct.",
    ],
    trustScore:
      job.status === "verified" || job.status === "urgent"
        ? 95
        : job.status === "warning"
          ? 85
          : 90,
    portalUrl: `https://recruitment.${job.agencyShort.toLowerCase()}.gov.ng`,
    trustReason: `GovAlert has cross-referenced this portal address. It utilizes the official FGN .gov.ng top level domain and active HTTPS secure certificates.`,
    refCode: `${job.agencyShort}/REC/${job.id}`,
    salaryRange: "Standard Federal Civil Service Scale",
    eligibility: "Nigerian Citizens Only",
  };
}

function JobDetailsPage() {
  const { jobId } = Route.useParams();

  // Find job from list
  const job = useMemo(() => {
    return latestJobs.find((j) => j.id === jobId);
  }, [jobId]);

  // Find details
  const details = useMemo(() => {
    if (!job) return null;
    return detailedMockData[job.id] || getFallbackDetails(job);
  }, [job]);

  // Find similar jobs (same category, excluding current job)
  const similarJobs = useMemo(() => {
    if (!job) return [];
    return latestJobs.filter((j) => j.category === job.category && j.id !== job.id).slice(0, 3);
  }, [job]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Shareable link copied to clipboard!");
    }
  };

  if (!job || !details) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Nav />
        <main className="mx-auto max-w-md px-6 py-24 text-center">
          <AlertTriangle className="mx-auto size-12 text-warning animate-bounce" />
          <h1 className="mt-4 text-xl font-bold">Recruitment Listing Not Found</h1>
          <p className="mt-2 text-muted-foreground">
            The job ID you are requesting does not exist or has been archived by our intelligence
            desk.
          </p>
          <div className="mt-6">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <ArrowLeft className="size-4" /> Back to listings
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Define Trust Score Colors
  const getTrustColorClass = (score: number) => {
    if (score >= 95) return "text-verified border-verified bg-verified/5";
    if (score >= 90) return "text-blue-500 border-blue-500/30 bg-blue-500/5";
    if (score >= 80) return "text-warning border-warning/30 bg-warning/5";
    return "text-closed border-closed bg-closed/5";
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-secondary/25">
      <Nav />
      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Breadcrumb and Back Button */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            Back to Recruitments Feed
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-muted cursor-pointer"
          >
            <Share2 className="size-3.5 text-muted-foreground" />
            Share listing
          </button>
        </div>

        {/* Hero Section */}
        <div className="relative mb-8 overflow-hidden rounded border border-border bg-card p-6">
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <AgencyLogo short={job.agencyShort} size={44} />
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-primary">
                    {job.title}
                  </h1>
                  <p className="text-xs text-muted-foreground">{job.agency}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Building className="size-4 text-muted-foreground" />
                  <span>{job.category}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="size-4 text-muted-foreground" />
                  <span>{job.state} State</span>
                </div>
                {details.salaryRange && (
                  <div className="flex items-center gap-1.5">
                    <FileText className="size-4 text-muted-foreground" />
                    <span>{details.salaryRange}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 md:items-end">
              <StatusBadge status={job.status} />
              <p className="mt-1.5 font-mono-ui text-[9px] uppercase tracking-wider text-muted-foreground">Ref Code: {details.refCode}</p>
            </div>
          </div>
        </div>

        {/* Grid Content */}
        <div className="grid gap-8 lg:grid-cols-[2.1fr_1fr]">
          {/* Main Column */}
          <div className="space-y-6">
            {/* Description */}
            <section className="rounded border border-border bg-card p-6 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-4 flex items-center gap-2">
                <FileText className="size-4" />
                Recruitment Program Overview
              </h2>
              <p className="text-muted-foreground leading-relaxed text-xs whitespace-pre-line">
                {details.description}
              </p>
            </section>

            {/* Available Cadres/Positions */}
            <section className="rounded border border-border bg-card p-6 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-4 flex items-center gap-2">
                <CheckCircle2 className="size-4" />
                Available Positions & Cadres
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {details.positions.map((position, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded border border-border bg-muted/20 p-3 text-xs font-semibold"
                  >
                    <span className="size-1.5 rounded-full bg-primary" />
                    {position}
                  </div>
                ))}
              </div>
            </section>

            {/* Requirements */}
            <section className="rounded border border-border bg-card p-6 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-4 flex items-center gap-2">
                <ShieldCheck className="size-4" />
                Recruitment Requirements
              </h2>
              <ul className="space-y-3 text-muted-foreground text-xs">
                {details.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="size-4 text-verified shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Similar Jobs */}
            {similarJobs.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-sm font-bold tracking-tight text-primary">Similar Verified Openings</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {similarJobs.map((simJob) => (
                    <Link
                      key={simJob.id}
                      to="/jobs/$jobId"
                      params={{ jobId: simJob.id }}
                      className="group flex flex-col justify-between rounded border border-border bg-card p-5 hover:border-primary/45 cursor-pointer transition-colors"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <AgencyLogo short={simJob.agencyShort} size={24} />
                          <StatusBadge status={simJob.status} />
                        </div>
                        <h4 className="mt-2 text-xs font-bold text-primary group-hover:text-primary-hover line-clamp-1">
                          {simJob.title}
                        </h4>
                        <p className="mt-1 text-[10px] text-muted-foreground">{simJob.agency}</p>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-[9px] text-muted-foreground border-t border-border pt-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {simJob.deadline}
                        </span>
                        <span>{simJob.detected}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trust and Verification Panel */}
            <section
              className={`rounded border p-6 shadow-sm relative overflow-hidden ${getTrustColorClass(
                details.trustScore,
              )}`}
            >
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Verification Score
                  </span>
                </div>
                <div className="text-lg font-bold">{details.trustScore}%</div>
              </div>

              {/* Trust Score Visual Bar */}
              <div className="h-1.5 w-full rounded-full bg-border/25 overflow-hidden mb-4">
                <div
                  className="h-full rounded-full bg-current transition-all duration-500"
                  style={{ width: `${details.trustScore}%` }}
                />
              </div>

              <p className="text-xs leading-relaxed mb-6 text-foreground/80">
                {details.trustReason}
              </p>

              <a
                href={details.portalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/95 shadow-sm cursor-pointer"
              >
                Apply on Official Portal
                <ExternalLink className="size-3.5" />
              </a>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-[9px] text-foreground/60 uppercase tracking-wider font-bold">
                <ShieldCheck className="size-3.5 text-verified" />
                Verified FGN Domain Name
              </div>
            </section>

            {/* Quick Information Meta Card */}
            <section className="rounded border border-border bg-card p-6 shadow-sm space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Recruitment Details
              </h3>

              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="size-4" /> Deadline
                </span>
                <span className="text-xs font-bold text-primary">{job.deadline}</span>
              </div>

              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Clock className="size-4" /> Detected
                </span>
                <span className="text-xs text-muted-foreground font-mono-ui">{job.detected}</span>
              </div>

              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Building className="size-4" /> Organization
                </span>
                <span className="text-xs font-bold text-primary">{job.agencyShort}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <ShieldCheck className="size-4" /> Eligibility
                </span>
                <span className="text-xs text-muted-foreground">{details.eligibility}</span>
              </div>
            </section>

            {/* Join telegram CTA inside sidebar */}
            <section className="rounded border border-border bg-card p-6 shadow-sm text-center relative overflow-hidden">
              <Send className="mx-auto size-6 text-primary mb-3" />
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Get Instant Notifications</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Join our Telegram channel to receive alerts the exact minute a new federal portal
                launches.
              </p>
              <a
                href="https://t.me/GovAlert"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded bg-primary py-2 px-3 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-all cursor-pointer"
              >
                Join GovAlert Telegram
              </a>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
