import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav, Footer } from "../components/layout";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-secondary/25 font-sans">
      <Nav />
      <main className="flex-1 mx-auto max-w-[1184px] w-full px-6 py-12">
        {/* Header Hero */}
        <div className="text-left mb-16 relative overflow-hidden rounded-[8px] border border-border bg-card p-8 md:p-12">
          {/* Faint SVG Grid/Topographic Opacity Pattern */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0V0zm20 20h20v20H20V20z' fill='%230a5c38' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }} />

          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#0a5c38] dark:text-[#3fb68e]">
              ABOUT GOVALERT
            </span>
            <h1 className="text-4xl font-display font-normal text-foreground md:text-[40px]">
              Vetting Nigeria's Public Sector Opportunities
            </h1>
            <p className="text-[15px] text-muted-foreground leading-relaxed max-w-2xl">
              GovAlert is an independent verification platform monitoring public sector recruitment across federal ministries, departments, and agencies. We neutralize recruitment scams targeting job seekers.
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid gap-8 md:grid-cols-2 mb-16">
          <div className="rounded-[8px] border border-border bg-card p-8 shadow-sm border-l-4 border-l-[#0a5c38] dark:border-l-[#3fb68e] space-y-4">
            {/* Small icon, stroke only, no fill */}
            <svg className="size-6 text-[#0a5c38] dark:text-[#3fb68e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#0a5c38] dark:text-[#3fb68e]">
              OUR MISSION
            </span>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              To provide immediate, reliable, and verified notifications regarding ongoing civil service recruitments, eliminating third-party scams and secure access to official application endpoints.
            </p>
          </div>

          <div className="rounded-[8px] border border-border bg-card p-8 shadow-sm border-l-4 border-l-[#c8960c] space-y-4">
            <svg className="size-6 text-[#c8960c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#c8960c]">
              OUR VISION
            </span>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              To become the ultimate verification and trust authority for West African employment intelligence, setting a benchmark for absolute transparency and user safety.
            </p>
          </div>
        </div>

        {/* Core Vetting Process */}
        <section className="mb-16">
          <div className="mb-10">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0a5c38] dark:text-[#3fb68e]">
              METHODOLOGY
            </span>
            <h2 className="text-xl font-bold tracking-tight text-primary mt-1">
              Independent Verification System
            </h2>
          </div>

          {/* No boxes, no cards. Just type and negative space. */}
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="space-y-3">
              <span className="font-display text-[48px] font-normal text-[#0a5c38] dark:text-[#3fb68e] opacity-30 block leading-none">01</span>
              <h4 className="font-bold text-[16px] text-foreground">Digital DNS & SSL Vetting</h4>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                We verify domain name servers and enterprise EV SSL encryption schemas to ensure the registration link is a legitimate .gov.ng site, not a phishing clone.
              </p>
            </div>

            <div className="space-y-3">
              <span className="font-display text-[48px] font-normal text-[#0a5c38] dark:text-[#3fb68e] opacity-30 block leading-none">02</span>
              <h4 className="font-bold text-[16px] text-foreground">Gazette Cross-Referencing</h4>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                Our intelligence officers cross-reference recruitment announcements with federal gazettes, official agency directives, or verified public authorities.
              </p>
            </div>

            <div className="space-y-3">
              <span className="font-display text-[48px] font-normal text-[#0a5c38] dark:text-[#3fb68e] opacity-30 block leading-none">03</span>
              <h4 className="font-bold text-[16px] text-foreground">Signed & Timestamped Pushes</h4>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                Once vetted, the alert is logged, timestamped, and immediately transmitted to dashboard subscribers and Telegram channels.
              </p>
            </div>
          </div>
        </section>

        {/* Anti-Scam Commitment */}
        <div className="rounded-[8px] border border-border bg-muted/20 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-left">
            <div className="flex items-center gap-2 text-[#0a5c38] dark:text-[#3fb68e]">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h4 className="font-bold text-sm">Anti-Scam Commitment</h4>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              GovAlert is entirely independent. We have zero affiliations with the Federal Government, nor do we run, process, or sell employment spots. We provide pure public intelligence.
            </p>
          </div>
          <Link
            to="/jobs"
            className="inline-flex h-[40px] items-center justify-center rounded-[8px] bg-[#0a5c38] hover:bg-[#0f7a4a] text-white dark:bg-[#3fb68e] dark:hover:bg-[#3fb68e]/90 dark:text-[#0c1015] px-5 text-xs font-semibold shrink-0 self-start md:self-auto cursor-pointer"
          >
            Start Vetting Searches &rarr;
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
