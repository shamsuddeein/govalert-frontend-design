import { createFileRoute } from "@tanstack/react-router";
import { Nav, Footer } from "../components/layout";
import { Calendar } from "lucide-react";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-secondary/25">
      <Nav />
      <main className="flex-1 mx-auto max-w-3xl w-full px-6 py-12">
        <div className="border-b border-border pb-6 mb-8">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Calendar className="size-3.5" />
            Last Updated: July 12, 2026
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Operational guidelines and legal terms governing GovAlert.
          </p>
        </div>

        <article className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-xs text-muted-foreground leading-relaxed">
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">1. Independence Disclaimer</h3>
            <p>
              GovAlert is a private, independent portal monitoring service. We are **not affiliated,
              associated, authorized, endorsed by, or in any way officially connected** with the
              Federal Republic of Nigeria, the Federal Civil Service Commission, or any government
              ministry, department, or agency. All official bulletins and links are posted for
              informational safety purposes only.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">2. Vetting Accuracy</h3>
            <p>
              While our team checks portal servers, DNS paths, and SSL status to audit links,
              GovAlert does not guarantee the availability, security, or accuracy of third-party
              government application sites. Candidates use the links provided entirely at their own
              risk.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">3. Zero Placement Services</h3>
            <p>
              GovAlert is **not a recruiter or job agency**. We do not accept resumes, manage
              applications, or participate in hiring decisions. We do not charge fees for employment
              placements. Any person demanding payment on behalf of GovAlert is committing fraud and
              should be reported to law enforcement.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">4. Acceptable Use</h3>
            <p>
              Users agree not to utilize our scam reporting system to file false allegations, spam
              our server endpoints, or scrape platform data. We reserve the right to ban IP ranges
              violating these usage policies.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">5. Changes to Terms</h3>
            <p>
              We revise these terms periodically. Continued usage of our website and Telegram alert
              feeds constitutes binding acceptance of modified conditions.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
