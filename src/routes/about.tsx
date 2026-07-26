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
        title="About RecruitmentAlert: Independent Nigerian Government Recruitment Verification"
        description="Why RecruitmentAlert was built: an independent monitoring system checking 42 official Nigerian federal portals to protect job seekers from recruitment scams."
        canonicalUrl="/about"
        jsonLd={[breadcrumbSchema]}
      />
      <Nav />
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-[760px] px-6 py-12 outline-none">

        <div className="mb-10 text-left space-y-3 border-b border-border pb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-primary md:text-[34px] leading-tight">
            Why I Built RecruitmentAlert
          </h1>
          <p className="text-[16px] text-muted-foreground leading-relaxed font-sans">
            A developer who got tired of watching people lose money to fake government job portals built a system to check them automatically.
          </p>
        </div>

        <article className="prose dark:prose-invert max-w-none space-y-6 text-[15px] sm:text-[16px] leading-[1.75] text-foreground font-sans">

          <p>
            My name is Shamsuddeen Yusuf. I am a backend developer and HND Software Engineering student at Kaduna Polytechnic in Kaduna, Nigeria.
          </p>

          <p>
            In Nigeria, looking for a government job is hard. What makes it worse is the industry of fake recruitment that targets graduates who cannot afford to get it wrong. Every week, sites appear claiming NNPC, Customs, EFCC, or Immigration are recruiting. They copy government logos, invent deadlines, and charge ₦5,000 or ₦10,000 for an "application form fee" or "scratch card pins." People who cannot spare that money pay it, wait weeks for a result, and eventually realize no recruitment ever existed.
          </p>

          <p>
            Legitimate Nigerian federal government recruitment is 100% free. No agency will ever ask you to pay to submit an application. But that fact is easy to say and hard to verify when you are looking at a convincing-looking website with a government logo on it. That is the gap this tool addresses.
          </p>

          <p>
            I built an automated monitoring system that directly checks 42 official Nigerian federal MDA portals (including <code>nnpcgroup.com</code>, <code>customs.gov.ng</code>, and <code>efcc.gov.ng</code>) and records what it finds. When an official portal updates with a hiring notice, shortlist, or closure, the system verifies the domain, records a timestamped check, and notifies subscribers through Telegram and email. Every check is logged and the timestamps are public on the <Link to="/audit-log" className="text-[#0a5c38] dark:text-[#3fb68e] font-semibold underline">Audit Log</Link> page so anyone can verify what was checked and when.
          </p>

          <p>
            I built this in July 2026 using Python, Django, APScheduler, and React. There is no company behind it, no investors, and no team. If something breaks I fix it. If you find an error in a listing, email me and I will look into it.
          </p>

          {/* Contact & GitHub Info Card */}
          <div className="mt-10 rounded-[8px] border border-border bg-card p-6 space-y-4">
            <h3 className="text-base font-bold text-primary">Contact</h3>
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
                  href="https://github.com/shamsuddeein"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#0a5c38] dark:text-[#3fb68e] font-semibold underline hover:opacity-80"
                >
                  github.com/shamsuddeein &rarr;
                </a>
              </p>
              <p>
                <strong className="text-foreground">Email:</strong>{" "}
                <a
                  href="mailto:talktoshamsuddeein@gmail.com"
                  className="text-[#0a5c38] dark:text-[#3fb68e] font-semibold underline hover:opacity-80"
                >
                  talktoshamsuddeein@gmail.com
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
