import { createFileRoute } from "@tanstack/react-router";
import { Nav, Footer } from "../components/layout";
import { ShieldCheck, Calendar } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            How RecruitmentAlert collects, uses, and safeguards user data.
          </p>
        </div>

        <article className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-xs text-muted-foreground leading-relaxed">
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">1. Information We Collect</h3>
            <p>We collect minimal information to deliver our verification services:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Account Details</strong>: Full Name, email address, phone number,
                qualification, and field of study provided when setting up an applicant profile.
              </li>
              <li>
                <strong>Telegram Handle</strong>: Provided voluntarily if you choose to receive
                alerts directly to your Telegram chat.
              </li>
              <li>
                <strong>Technical Data</strong>: IP address, browser type, and access logs to
                prevent malicious scraping or spam reports.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">
              2. How We Use Your Information
            </h3>
            <p>
              Your data is solely used to verify profile configurations and process custom
              notifications. We do not sell, license, or distribute your email addresses or
              telephone numbers to government recruitment agencies or private placement boards.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">3. Anti-Scam Reporting Data</h3>
            <p>
              Any recruitment portal URLs or WhatsApp broadcast contents reported through our Scam
              Desk are aggregated anonymously to flag fraud vectors. We may share audited scam
              domains publicly with security agencies or host networks to secure takedowns.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">4. Cookies and Logs</h3>
            <p>
              We use necessary local storage cookies to remember your visual theme preference (Light
              or Dark Mode) and maintain active dashboard sessions.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">5. Contact Information</h3>
            <p>
              For questions regarding our privacy operations or data erasure requests, please
              contact us at <strong className="text-primary">privacy@recruitmentalert.com.ng</strong>.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
