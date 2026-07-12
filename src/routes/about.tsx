import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav, Footer } from "../components/layout";
import { ShieldCheck, Target, Heart, ShieldAlert, Award, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-secondary/25">
      <Nav />
      <main className="flex-1 mx-auto max-w-5xl w-full px-6 py-12">
        {/* Header Hero */}
        <div className="text-left mb-16 relative overflow-hidden rounded-3xl border border-border bg-card/40 p-8 md:p-12 backdrop-blur-sm">
          <div className="relative z-10 max-w-3xl">
            <span className="font-mono-ui text-[10px] font-semibold uppercase tracking-widest text-accent bg-accent/10 px-2.5 py-1 rounded-full">
              About GovAlert
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-primary md:text-5xl">
              Vetting Nigeria's Public Sector Opportunities
            </h1>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              GovAlert is an independent verification platform monitoring and vetting public sector recruitment across all federal ministries, departments, and agencies. We exist to close the information gap and neutralize recruitment scams targeting job seekers.
            </p>
          </div>
          <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-primary/5 blur-3xl" />
        </div>

        {/* Mission & Vision */}
        <div className="grid gap-8 md:grid-cols-2 mb-16">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary mb-4">
              <Target className="size-5" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight">Our Mission</h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              To provide immediate, reliable, and cryptographically verified notifications regarding ongoing civil service recruitments, eliminating third-party scams and secure access to official application endpoints.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary mb-4">
              <Award className="size-5" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight">Our Vision</h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              To become the ultimate verification and trust authority for West African employment intelligence, setting a benchmark for absolute transparency and user safety.
            </p>
          </div>
        </div>

        {/* Core Vetting Process */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold tracking-tight mb-8">Independent Verification System</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="p-5 border border-border rounded-xl bg-card">
              <span className="font-mono text-2xl font-bold text-accent">01</span>
              <h4 className="font-semibold text-sm mt-3">Digital DNS & SSL Vetting</h4>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                We verify domain name servers and enterprise EV SSL encryption schemas to ensure the registration link is a legitimate .gov.ng site, not a phishing clone.
              </p>
            </div>

            <div className="p-5 border border-border rounded-xl bg-card">
              <span className="font-mono text-2xl font-bold text-accent">02</span>
              <h4 className="font-semibold text-sm mt-3">Gazette Cross-Referencing</h4>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Our intelligence officers cross-reference recruitment announcements with federal gazettes, official agency directives, or verified public authorities.
              </p>
            </div>

            <div className="p-5 border border-border rounded-xl bg-card">
              <span className="font-mono text-2xl font-bold text-accent">03</span>
              <h4 className="font-semibold text-sm mt-3">Signed & Timestamped Pushes</h4>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Once vetted, the alert is logged, timestamped, and immediately transmitted to dashboard subscribers and Telegram channels.
              </p>
            </div>
          </div>
        </section>

        {/* Anti-Scam Commitment */}
        <div className="rounded-2xl border border-closed/20 bg-closed/5 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-closed">
              <ShieldAlert className="size-5" />
              <h4 className="font-bold text-sm">Anti-Scam Commitment</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              GovAlert is entirely independent. We have zero affiliations with the Federal Government, nor do we run, process, or sell employment spots. We provide pure public intelligence.
            </p>
          </div>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/95 shrink-0 self-start md:self-auto cursor-pointer"
          >
            Start Vetting Searches
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
