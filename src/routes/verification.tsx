import { createFileRoute } from "@tanstack/react-router";
import { Nav, Footer } from "../components/layout";
import { ShieldCheck, Server, Search, CheckCircle, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/verification")({
  component: VerificationPage,
});

function VerificationPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-secondary/25">
      <Nav />
      <main className="flex-1 mx-auto max-w-4xl w-full px-6 py-12 space-y-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#15803D]/20 bg-[#15803D]/10 px-2.5 py-1 text-xs font-semibold text-[#15803D] uppercase tracking-wider">
            <ShieldCheck className="size-4" /> Verification desk
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-primary md:text-[40px] leading-tight">
            Verification methodology
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-[70ch]">
            How GovAlert checks, tracks, and verifies Nigerian government recruitment portals to protect applicants from fraud and fake announcements.
          </p>
        </div>

        {/* Section 1: How Monitoring Works */}
        <section className="space-y-4 border-t border-border pt-8">
          <div className="flex items-center gap-2.5">
            <Server className="size-5 text-primary" />
            <h2 className="text-xl font-semibold text-primary">How monitoring works</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            GovAlert deploys lightweight, automated monitoring crawlers that target the subdomain trees of official federal and state MDAs (Ministries, Departments, and Agencies) under the <strong className="text-foreground">.gov.ng</strong> registry.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 mt-4">
            <div className="rounded-[8px] border border-border bg-card p-5 space-y-2">
              <h3 className="text-sm font-semibold text-primary">Checksum comparison</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We compare SHA-256 hash profiles of portal HTML, assets, and document trees to detect any changes or new announcements.
              </p>
            </div>
            <div className="rounded-[8px] border border-border bg-card p-5 space-y-2">
              <h3 className="text-sm font-semibold text-primary">DNS & SSL tracking</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We log domain registrar records, NS configuration shifts, and SSL credentials to flag malicious clones or phishing redirects instantly.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Update Frequency */}
        <section className="space-y-4 border-t border-border pt-8">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="size-5 text-primary" />
            <h2 className="text-xl font-semibold text-primary">Update frequency</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Crawlers scan primary and high-priority subdomains on a strict <strong className="text-foreground">15-minute interval</strong>. Secondary landing nodes are audited twice daily. If a potential new portal is detected, the scan frequency for that host temporarily shifts to a 2-minute cycle to extract assets.
          </p>
        </section>

        {/* Section 3: Multi-Stage Verification Process */}
        <section className="space-y-4 border-t border-border pt-8">
          <div className="flex items-center gap-2.5">
            <Search className="size-5 text-primary" />
            <h2 className="text-xl font-semibold text-primary">Verification process</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every recruitment record goes through a rigorous four-stage authentication pipeline before public release:
          </p>
          <div className="space-y-3">
            <div className="flex gap-4 items-start p-4 rounded-[8px] border border-border bg-card">
              <span className="font-mono text-sm font-bold text-muted-foreground">01</span>
              <div>
                <h4 className="text-sm font-semibold text-primary">Portal scanned & detected</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Automated bots identify portal updates and scrape new links.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start p-4 rounded-[8px] border border-border bg-card">
              <span className="font-mono text-sm font-bold text-muted-foreground">02</span>
              <div>
                <h4 className="text-sm font-semibold text-primary">Content comparison</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Our software parses the scraped vacancy specifications against past campaigns to isolate new openings.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start p-4 rounded-[8px] border border-border bg-card">
              <span className="font-mono text-sm font-bold text-muted-foreground">03</span>
              <div>
                <h4 className="text-sm font-semibold text-primary">Official source verified</h4>
                <p className="text-xs text-muted-foreground mt-0.5">DNS authenticity is checked and cross-referenced with federal announcements, official gazettes, or verified media statements.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start p-4 rounded-[8px] border border-border bg-card">
              <span className="font-mono text-sm font-bold text-muted-foreground">04</span>
              <div>
                <h4 className="text-sm font-semibold text-primary">Signed & published</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Once our verification desk clears the entry, the job card is logged on our system and broadcast to subscribers.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Duplicate & False Positive Policies */}
        <section className="grid gap-6 md:grid-cols-2 border-t border-border pt-8">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-primary">Duplicate detection</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We employ deduplication algorithms based on agency, job title, and application portal URLs. Cloned advertisements pointing to the same endpoint are merged to prevent dashboard clutter.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-primary">False-positive policy</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              If an official site is compromised or points to a non-governmental external link, the platform immediately flags the listing as "Offline / Security Warning" and halts redirects until the agency resolves the configuration error.
            </p>
          </div>
        </section>

        {/* Section 5: Official Sources & Registry */}
        <section className="space-y-4 border-t border-border pt-8">
          <h2 className="text-lg font-semibold text-primary">Official sources we monitor</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            GovAlert monitors endpoints across verified federal registries, including:
          </p>
          <ul className="grid gap-2 grid-cols-2 text-xs text-muted-foreground list-disc pl-5">
            <li>Federal Civil Service Commission (FCSC)</li>
            <li>Nigeria Customs Service (NCS)</li>
            <li>Economic and Financial Crimes Commission (EFCC)</li>
            <li>Nigerian Army, Navy, and Air Force (NAF)</li>
            <li>Nigeria Police Force (NPF)</li>
            <li>Federal Inland Revenue Service (FIRS)</li>
            <li>Central Bank of Nigeria (CBN)</li>
            <li>National Identity Management Commission (NIMC)</li>
          </ul>
        </section>

        {/* Section 6: Disclaimer */}
        <section className="rounded-[8px] border border-border bg-muted/20 p-5 space-y-2 flex items-start gap-4">
          <AlertTriangle className="size-5 text-muted-foreground shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-primary">Disclaimer</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              GovAlert is an independent verification platform. We are not affiliated, associated, authorized, endorsed by, or in any way officially connected with the Federal Government of Nigeria or any of its departments or agencies. All official agency portal links are provided solely as resource links. GovAlert does not process applications or influence recruitments.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
