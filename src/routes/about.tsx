import { createFileRoute, Link } from '@tanstack/react-router';
import { Nav, Footer } from "../components/layout";
import { SeoHead } from "../components/SeoHead";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.recruitmentalert.com.ng"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "About",
        "item": "https://www.recruitmentalert.com.ng/about"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-secondary/25 font-sans">
      <SeoHead
        title="About RecruitmentAlert. Built by Shamsuddeen Yusuf in Kaduna, Nigeria"
        description="Why RecruitmentAlert was built by Shamsuddeen Yusuf, a developer in Kaduna, Nigeria, to protect Nigerian job seekers against recruitment scams."
        canonicalUrl="/about"
        jsonLd={[breadcrumbSchema]}
      />
      <Nav />
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-[760px] px-6 py-12 outline-none">
        
        {/* Header */}
        <div className="mb-10 text-left space-y-3 border-b border-border pb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#0a5c38]/10 dark:bg-[#3fb68e]/15 border border-[#0a5c38]/30 dark:border-[#3fb68e]/30 px-3 py-1 text-xs font-semibold text-[#0a5c38] dark:text-[#3fb68e] font-mono">
            LAUNCHED JULY 2026 &middot; KADUNA, NIGERIA
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary md:text-[34px] leading-tight">
            Why I Built RecruitmentAlert
          </h1>
          <p className="text-[16px] text-muted-foreground leading-relaxed font-sans">
            A personal project by a developer who got tired of seeing friends lose money and hope to fake government job portals.
          </p>
        </div>

        {/* Founder Story Article */}
        <article className="prose dark:prose-invert max-w-none space-y-6 text-[15px] sm:text-[16px] leading-[1.75] text-foreground font-sans">
          
          <p className="font-medium text-lg text-primary leading-snug">
            My name is <strong>Shamsuddeen Yusuf</strong>. I am a backend developer and HND Software Engineering student at Kaduna Polytechnic in Kaduna, Nigeria.
          </p>

          <p>
            In Nigeria, looking for a job is hard enough. But what makes it painful is the industry of recruitment scams that target young graduates. Every week, fake websites pop up claiming that NNPC, Customs, EFCC, or Immigration are recruiting. They copy government logos, invent deadline dates, and demand ₦5,000 or ₦10,000 "application form fee" or "scratch card pins".
          </p>

          <p>
            Many job seekers in Kaduna, Kano, Ibadan, and across the country spend their last savings on these fake portals, only to realize weeks later that no recruitment ever existed. It costs people their time, their money, and their dignity.
          </p>

          <div className="my-8 rounded-[8px] border border-[#0a5c38]/30 bg-[#0a5c38]/5 dark:bg-[#3fb68e]/10 p-6 space-y-2">
            <h2 className="text-base font-bold text-[#0a5c38] dark:text-[#3fb68e]">The Simple Goal</h2>
            <p className="text-sm text-foreground leading-relaxed">
              Legitimate Nigerian government recruitment is 100% free. No federal agency will ever ask you to pay money to submit an application. RecruitmentAlert exists to answer one question instantly: <em>Is this recruitment portal real or fake?</em>
            </p>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-primary pt-2">How It Works</h2>
          <p>
            Instead of relying on WhatsApp rumors or sponsored blog posts, I built an automated monitoring system that directly checks 42 official Nigerian federal MDA subdomains (like <code>nnpcgroup.com</code>, <code>customs.gov.ng</code>, and <code>efcc.gov.ng</code>) in real-time.
          </p>
          <p>
            When an official agency portal updates its public page with a verified hiring notice, shortlisted candidate list, or portal closure, the system verifies the domain SSL certificate and notifies subscribers on Telegram and email.
          </p>

          <h2 className="text-xl font-bold tracking-tight text-primary pt-2">No Corporate BS, Just Real Code</h2>
          <p>
            There is no corporate board behind this, no stock photos, and no fake team members. I built this platform myself in July 2026 using Python, Django, APScheduler, and React.
          </p>
          <p>
            The entire backend code and audit logic are open and transparent. If our system checks a portal, you can verify the exact check timestamp on our public <Link to="/audit-log" className="text-[#0a5c38] dark:text-[#3fb68e] font-semibold underline">Audit Log</Link> page.
          </p>

          {/* Contact & GitHub Info Card */}
          <div className="mt-10 rounded-[8px] border border-border bg-card p-6 space-y-4">
            <h3 className="text-base font-bold text-primary">Direct Contact & Verification</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Developer:</strong> Shamsuddeen Yusuf
              </p>
              <p>
                <strong className="text-foreground">Location:</strong> Kaduna Polytechnic, Kaduna, Nigeria
              </p>
              <p>
                <strong className="text-foreground">GitHub:</strong>{" "}
                <a
                  href="https://github.com/shamsuddeenn"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#0a5c38] dark:text-[#3fb68e] font-semibold underline hover:opacity-80"
                >
                  github.com/shamsuddeenn &rarr;
                </a>
              </p>
              <p>
                <strong className="text-foreground">Email:</strong>{" "}
                <a
                  href="mailto:talktoshamsuddeen@gmail.com"
                  className="text-[#0a5c38] dark:text-[#3fb68e] font-semibold underline hover:opacity-80"
                >
                  talktoshamsuddeen@gmail.com
                </a>
              </p>
            </div>
          </div>

        </article>

        <div className="mt-12 border-t border-border pt-8 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
          <Link to="/portals" className="text-[#0a5c38] dark:text-[#3fb68e] hover:underline">
            &larr; View 42 Monitored Portals
          </Link>
          <Link to="/audit-log" className="text-[#0a5c38] dark:text-[#3fb68e] hover:underline">
            View Live Public Audit Log &rarr;
          </Link>
        </div>

      </main>
      <Footer />
    </div>
  );
}
