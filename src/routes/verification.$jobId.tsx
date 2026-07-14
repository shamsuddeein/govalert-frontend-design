import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Nav, Footer } from "../components/layout";
import { latestJobs, StatusBadge } from "./index";
import { Download, Share2, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/verification/$jobId")({
  component: VerificationReportPage,
  head: ({ params }) => {
    return {
      meta: [
        { title: `Verification Report: ${params.jobId} | GovAlert` }
      ],
    };
  }
});

function Divider() {
  return <div className="my-8 h-px w-full bg-border" />;
}

export default function VerificationReportPage() {
  const { jobId } = Route.useParams();

  const job = useMemo(() => {
    return latestJobs.find((j) => j.id === jobId);
  }, [jobId]);

  if (!job) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Nav />
        <main className="mx-auto max-w-[640px] px-6 py-24 text-center">
          <h1 className="text-[28px] font-bold text-foreground">Report not found</h1>
          <p className="mt-2 text-[15px] text-muted-foreground">
            The verification report you are looking for is unavailable.
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

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Report link copied to clipboard");
    }
  };

  const handleDownload = () => {
    toast.success("Report PDF generation started");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="mx-auto max-w-[720px] px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-6 font-mono-ui text-[11px] uppercase tracking-wide text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link> → <Link to="/jobs" className="hover:text-primary">Jobs</Link> → <Link to="/jobs/$jobId" params={{ jobId: job.id }} className="hover:text-primary">REF: {job.id}</Link> → Verification Report
        </div>

        <h1 className="text-[28px] font-bold leading-tight tracking-tight text-foreground">
          Verification Report
        </h1>
        <div className="mt-1 font-mono-ui text-[13px] text-muted-foreground">
          REF: {job.id}
        </div>

        {/* Report Metadata */}
        <div className="mt-8 rounded-[8px] border border-border bg-card p-6">
          <div className="grid gap-y-4 sm:grid-cols-3 text-[14px]">
            <div>
              <span className="block text-muted-foreground text-[12px]">Generated</span>
              <span className="font-mono-ui mt-1 block">14 Jul 2026, 09:17 WAT</span>
            </div>
            <div>
              <span className="block text-muted-foreground text-[12px]">Status</span>
              <div className="mt-1">
                <StatusBadge status={job.status} />
              </div>
            </div>
            <div>
              <span className="block text-muted-foreground text-[12px]">Report ID</span>
              <span className="font-mono-ui mt-1 block text-foreground">VR-2026-0714-{job.id.split('-')[0]}</span>
            </div>
          </div>
        </div>

        <Divider />

        {/* Audit Timeline */}
        <section>
          <h2 className="text-[17px] font-semibold text-foreground">Audit Timeline</h2>
          <div className="mt-6 space-y-3">
            {[
              { time: "09:13", desc: "Announcement detected on portal" },
              { time: "09:14", desc: "Domain verified: official source confirmed" },
              { time: "09:14", desc: "Content extracted and fingerprinted" },
              { time: "09:15", desc: "Duplicate check passed (no match in 30-day window)" },
              { time: "09:16", desc: "Historical comparison: matches previous format" },
              { time: "09:17", desc: "Confidence score calculated: 98%" },
              { time: "09:17", desc: "Published to GovAlert feed and Telegram channel" }
            ].map((log, idx, arr) => {
              const isLast = idx === arr.length - 1;
              return (
                <div key={idx} className="flex gap-4">
                  <div className="w-[40px] shrink-0 font-mono-ui text-[11px] text-muted-foreground pt-0.5">
                    {log.time}
                  </div>
                  <div className="relative pb-3 pl-4 border-l-2 border-border/60">
                    <div className={"absolute -left-[5px] top-1.5 h-2 w-2 rounded-full " + (isLast ? "bg-[#0a5c38] dark:bg-[#3fb68e]" : "bg-muted-foreground")} />
                    <div className="text-[13px]">{log.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <Divider />

        {/* Confidence Breakdown */}
        <section>
          <h2 className="text-[17px] font-semibold text-foreground">Confidence Breakdown</h2>
          
          <div className="mt-6">
            <div className="text-[15px] font-medium">Confidence: 98%</div>
            <div className="mt-2 h-2 w-full max-w-[200px] overflow-hidden rounded bg-border">
              <div 
                className="h-full bg-[#0a5c38] dark:bg-[#3fb68e]" 
                style={{ width: "98%" }}
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="text-[15px] text-muted-foreground">Based on:</div>
            <ul className="mt-3 space-y-2 text-[14px]">
              <li className="flex gap-2">
                <span className="font-mono-ui text-verified">✓</span>
                <span>Official .gov.ng domain confirmed</span>
              </li>
              <li className="flex gap-2">
                <span className="font-mono-ui text-verified">✓</span>
                <span>Content matches previous announcement format</span>
              </li>
              <li className="flex gap-2">
                <span className="font-mono-ui text-verified">✓</span>
                <span>No duplicate detected in 30-day window</span>
              </li>
              <li className="flex gap-2">
                <span className="font-mono-ui text-verified">✓</span>
                <span>Historical recruitment pattern consistent</span>
              </li>
              <li className="flex gap-2">
                <span className="font-mono-ui text-warning">!</span>
                <span>Manual review: Not required</span>
              </li>
            </ul>
          </div>
        </section>

        <Divider />

        {/* DNS Verification */}
        <section>
          <h2 className="text-[17px] font-semibold text-foreground">DNS & SSL Verification</h2>
          <div className="mt-6 grid gap-y-4 grid-cols-1 sm:grid-cols-2 text-[14px]">
            <div className="flex gap-2">
              <span className="text-muted-foreground w-28 shrink-0">Domain:</span>
              <span className="font-mono-ui font-medium text-foreground">{job.agencyShort.toLowerCase()}.gov.ng</span>
            </div>
            <div className="flex gap-2">
              <span className="text-muted-foreground w-28 shrink-0">Registrar:</span>
              <span className="font-medium text-foreground">NiRA (verified .ng registry)</span>
            </div>
            <div className="flex gap-2">
              <span className="text-muted-foreground w-28 shrink-0">SSL certificate:</span>
              <span className="font-medium text-[#0a5c38] dark:text-[#3fb68e]">Valid, expires Dec 2026</span>
            </div>
            <div className="flex gap-2">
              <span className="text-muted-foreground w-28 shrink-0">Hosting:</span>
              <span className="font-medium text-foreground">Matches known {job.agencyShort} infra</span>
            </div>
          </div>
        </section>

        <Divider />

        {/* Content Fingerprint */}
        <section>
          <h2 className="text-[17px] font-semibold text-foreground">Content Fingerprint</h2>
          <div className="mt-6 space-y-4 text-[14px]">
            <div className="flex gap-2 sm:items-center flex-col sm:flex-row">
              <span className="text-muted-foreground w-40 shrink-0">Page hash at detection:</span>
              <span className="font-mono-ui text-[12px] bg-muted px-2 py-0.5 rounded border border-border break-all">a8f5f167f44f4964e6c998dee827110c</span>
            </div>
            <div className="flex gap-2 sm:items-center flex-col sm:flex-row">
              <span className="text-muted-foreground w-40 shrink-0">Previous known hash:</span>
              <span className="font-mono-ui text-[12px] bg-muted px-2 py-0.5 rounded border border-border break-all">4a9e4001d2938f32c3f15b497f1bb657</span>
            </div>
            <div className="flex gap-2 sm:items-center flex-col sm:flex-row">
              <span className="text-muted-foreground w-40 shrink-0">Difference:</span>
              <span className="font-medium text-foreground">New content detected</span>
            </div>
          </div>
        </section>

        <Divider />

        {/* Conclusion */}
        <section className="rounded-[8px] bg-muted/30 border border-border p-6">
          <h2 className="text-[17px] font-semibold text-foreground">Conclusion</h2>
          <p className="mt-3 text-[14px] leading-relaxed text-foreground">
            This recruitment was detected, verified, and published without manual intervention. 
            The automated pipeline confirmed all four verification stages securely.
          </p>
        </section>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={handleDownload}
            className="inline-flex h-[36px] items-center justify-center gap-2 rounded-[8px] border border-[#0a5c38] dark:border-[#3fb68e] bg-transparent px-[16px] text-[14px] font-semibold text-[#0a5c38] dark:text-[#3fb68e] hover:bg-[#0a5c38]/5 dark:hover:bg-[#3fb68e]/10 cursor-pointer"
          >
            <Download className="size-4" /> Download report
          </button>
          <button
            onClick={handleShare}
            className="inline-flex h-[36px] items-center justify-center gap-2 rounded-[8px] border border-[#0a5c38] dark:border-[#3fb68e] bg-transparent px-[16px] text-[14px] font-semibold text-[#0a5c38] dark:text-[#3fb68e] hover:bg-[#0a5c38]/5 dark:hover:bg-[#3fb68e]/10 cursor-pointer"
          >
            <Share2 className="size-4" /> Share report
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
