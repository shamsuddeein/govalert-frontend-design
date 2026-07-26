import { createFileRoute, Link } from '@tanstack/react-router';
import { Nav, Footer } from "../components/layout";
import { SeoHead } from "../components/SeoHead";

export const Route = createFileRoute("/shamsuddeen")({
  component: ShamsuddeenProfilePage,
});

function ShamsuddeenProfilePage() {
  const profileSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Shamsuddeen Yusuf",
    "jobTitle": "Full Stack Developer",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kaduna",
      "addressCountry": "Nigeria"
    },
    "almaMater": "Kaduna Polytechnic",
    "url": "https://www.recruitmentalert.com.ng/shamsuddeen",
    "sameAs": [
      "https://github.com/shamsuddeenn",
      "https://x.com/shamsuddeein",
      "https://linkedin.com/in/shamsuddeiin",
      "https://instagram.com/shddeen"
    ]
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-secondary/25 font-sans">
      <SeoHead
        title="Shamsuddeen Yusuf — Full Stack Developer, Kaduna Nigeria"
        description="Shamsuddeen Yusuf is a full stack developer from Kaduna, Nigeria who builds backend systems, APIs, and web applications. Open to remote freelance and contract work."
        canonicalUrl="/shamsuddeen"
        jsonLd={[profileSchema]}
      />
      <Nav />
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-[760px] px-6 py-12 outline-none">

        <div className="mb-10 text-left space-y-3 border-b border-border pb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-primary md:text-[34px] leading-tight">
            Shamsuddeen Yusuf
          </h1>
          <p className="text-[16px] text-muted-foreground leading-relaxed font-sans">
            Full stack developer based in Kaduna, Nigeria.
          </p>
        </div>

        <article className="prose dark:prose-invert max-w-none space-y-6 text-[15px] sm:text-[16px] leading-[1.75] text-foreground font-sans">

          <p>
            Shamsuddeen Yusuf is a full stack developer based in Kaduna, Nigeria. He is currently completing an HND in Software Engineering at Kaduna Polytechnic. He builds backend systems, REST APIs, Django applications, Telegram bots, and full stack web products. He holds a leadership position in NACOS, the student computing association at Kaduna Polytechnic.
          </p>

          <p>
            He built RecruitmentAlert, an independent platform that monitors 42 Nigerian federal government recruitment portals in real time and alerts job seekers when official recruitment opens. He is co-founder and backend lead of Likita, a telemedicine platform. He is lead developer of Cetoh, a digital marketplace. He built GovAlert, the Telegram bot system that powers recruitment alerts for thousands of Nigerian job seekers.
          </p>

          <p>
            His stack is Python, Django, Django REST Framework, APScheduler, Celery, PostgreSQL, React, TanStack Router, and Telegram Bot API.
          </p>

          <p>
            He is available for remote freelance work and contract projects. Fixed price or milestone based. No location restriction.
          </p>

          <div className="mt-10 border-t border-border pt-8 space-y-3 text-sm text-muted-foreground">
            <p>
              <span className="text-foreground font-semibold">GitHub:</span>{" "}
              <a
                href="https://github.com/shamsuddeenn"
                target="_blank"
                rel="noreferrer"
                className="text-[#0a5c38] dark:text-[#3fb68e] font-medium hover:underline"
              >
                github.com/shamsuddeenn
              </a>
            </p>
            <p>
              <span className="text-foreground font-semibold">Twitter:</span>{" "}
              <a
                href="https://x.com/shamsuddeein"
                target="_blank"
                rel="noreferrer"
                className="text-[#0a5c38] dark:text-[#3fb68e] font-medium hover:underline"
              >
                x.com/shamsuddeein
              </a>
            </p>
            <p>
              <span className="text-foreground font-semibold">LinkedIn:</span>{" "}
              <a
                href="https://linkedin.com/in/shamsuddeiin"
                target="_blank"
                rel="noreferrer"
                className="text-[#0a5c38] dark:text-[#3fb68e] font-medium hover:underline"
              >
                linkedin.com/in/shamsuddeiin
              </a>
            </p>
            <p>
              <span className="text-foreground font-semibold">Instagram:</span>{" "}
              <a
                href="https://instagram.com/shddeen"
                target="_blank"
                rel="noreferrer"
                className="text-[#0a5c38] dark:text-[#3fb68e] font-medium hover:underline"
              >
                instagram.com/shddeen
              </a>
            </p>
            <p>
              <span className="text-foreground font-semibold">Email:</span>{" "}
              <a
                href="mailto:talktoshamsuddeen@gmail.com"
                className="text-[#0a5c38] dark:text-[#3fb68e] font-medium hover:underline"
              >
                talktoshamsuddeen@gmail.com
              </a>
            </p>
          </div>

        </article>

        <div className="mt-12 border-t border-border pt-8 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
          <Link to="/about" className="text-[#0a5c38] dark:text-[#3fb68e] hover:underline">
            &larr; About RecruitmentAlert
          </Link>
          <Link to="/portals" className="text-[#0a5c38] dark:text-[#3fb68e] hover:underline">
            View 42 Monitored Portals &rarr;
          </Link>
        </div>

      </main>
      <Footer />
    </div>
  );
}
