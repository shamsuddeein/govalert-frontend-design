import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav, Footer } from "../components/layout";
import { SeoHead } from "../components/SeoHead";

export const Route = createFileRoute("/telegram")({
  component: TelegramPage,
});

export function TelegramPage() {
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
        "name": "Telegram Bot Alerts",
        "item": "https://www.recruitmentalert.com.ng/telegram"
      }
    ]
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Nigerian Government Job Alerts on Telegram — RecruitmentAlert Bot",
    "description": "Instant verified notifications for Nigerian federal recruitment portals directly on Telegram. Monitor NNPC, Customs, EFCC, Immigration, and MDA portal openings.",
    "url": "https://www.recruitmentalert.com.ng/telegram"
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col justify-between">
      <SeoHead
        title="Nigerian Government Job Alerts on Telegram — RecruitmentAlert Bot"
        description="Get instant, verified Nigerian federal government job alerts on Telegram (@govalerts_bot). Real-time notifications for NNPC, Customs, EFCC, Immigration & civil service hiring."
        canonicalUrl="/telegram"
        jsonLd={[breadcrumbSchema, webPageSchema]}
      />
      <Nav />

      <main className="mx-auto max-w-[840px] w-full px-6 py-12 flex-1">
        {/* Breadcrumb */}
        <div className="mb-6 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link> → Telegram Bot Alerts
        </div>

        {/* Hero Section */}
        <div className="rounded-[8px] border border-border bg-card p-8 md:p-12 mb-12 text-left relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#0a5c38] dark:text-[#3fb68e]">
              OFFICIAL TELEGRAM BOT (@govalerts_bot)
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-[36px] leading-tight">
              Instant Nigerian Civil Service Recruitment Alerts on Telegram
            </h1>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              Never miss an official hiring window. Our automated intelligence network monitors 42 Nigerian federal MDA portals 24/7. When an official recruitment opens or a shortlist is released, get verified alerts pushed directly to your Telegram.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <a
                href="https://t.me/govalerts_bot?start=general"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-[44px] items-center justify-center gap-2 rounded-[8px] bg-[#0a5c38] hover:bg-[#0f7a4a] text-white dark:bg-[#3fb68e] dark:hover:bg-[#3fb68e]/90 dark:text-[#0c1015] px-6 text-sm font-semibold cursor-pointer shadow-sm"
              >
                <svg className="size-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.53-1.39.51-.46-.01-1.33-.26-1.99-.47-.8-.27-1.44-.41-1.39-.87.03-.24.35-.49.97-.75 3.79-1.65 6.32-2.73 7.57-3.26 3.61-1.53 4.36-1.8 4.85-1.8.11 0 .35.03.5.15.13.12.17.27.18.39-.01.08-.01.18-.02.26z" />
                </svg>
                <span>Launch @govalerts_bot on Telegram</span>
              </a>
              <span className="text-xs text-muted-foreground font-mono">100% Free · Zero Spam</span>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <section className="mb-12">
          <h2 className="text-xl font-bold tracking-tight text-foreground mb-6">
            Why Job Seekers Rely on Our Telegram Alerts
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-[8px] border border-border bg-card p-6 space-y-3">
              <span className="font-mono text-2xl font-bold text-[#0a5c38] dark:text-[#3fb68e]">⚡ 15m</span>
              <h3 className="font-bold text-base text-foreground">Real-Time Polling</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Crawlers check official federal portal subdomains every 15 minutes. Receive alerts the moment application forms drop.
              </p>
            </div>
            <div className="rounded-[8px] border border-border bg-card p-6 space-y-3">
              <span className="font-mono text-2xl font-bold text-[#0a5c38] dark:text-[#3fb68e]">🔒 100%</span>
              <h3 className="font-bold text-base text-foreground">Scam Prevention</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every push notification includes a direct link to the verified official portal. Phishing domains and fake blogs are strictly filtered out.
              </p>
            </div>
            <div className="rounded-[8px] border border-border bg-card p-6 space-y-3">
              <span className="font-mono text-2xl font-bold text-[#0a5c38] dark:text-[#3fb68e]">🎯 Custom</span>
              <h3 className="font-bold text-base text-foreground">Agency Watchlists</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Track specific agencies (NNPC, Customs, EFCC, NIS, FIRS, NPF) or set custom keywords for targeted alerts.
              </p>
            </div>
          </div>
        </section>

        {/* Instructions */}
        <section className="mb-12 border border-border bg-card rounded-[8px] p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-bold text-foreground">How to Start Receiving Alerts in 3 Simple Steps</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <span className="size-7 rounded-full bg-[#0a5c38]/10 text-[#0a5c38] dark:bg-[#3fb68e]/15 dark:text-[#3fb68e] font-bold text-xs flex items-center justify-center shrink-0">1</span>
              <div>
                <h4 className="font-semibold text-sm text-foreground">Open @govalerts_bot in Telegram</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Click the launch button or search for <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">@govalerts_bot</code> inside your Telegram app.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="size-7 rounded-full bg-[#0a5c38]/10 text-[#0a5c38] dark:bg-[#3fb68e]/15 dark:text-[#3fb68e] font-bold text-xs flex items-center justify-center shrink-0">2</span>
              <div>
                <h4 className="font-semibold text-sm text-foreground">Tap "Start" or Choose Agency Alerts</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Press Start to receive all verified federal job alerts, or type <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">/watch NNPC</code> to subscribe to specific agency recruitments.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="size-7 rounded-full bg-[#0a5c38]/10 text-[#0a5c38] dark:bg-[#3fb68e]/15 dark:text-[#3fb68e] font-bold text-xs flex items-center justify-center shrink-0">3</span>
              <div>
                <h4 className="font-semibold text-sm text-foreground">Receive Instant Push Notifications</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  When a recruitment portal opens, shortlists are released, or deadlines approach, you receive a signed verification push with direct apply links.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Bot Commands */}
        <section className="mb-12 space-y-4">
          <h2 className="text-xl font-bold text-foreground">Popular Telegram Bot Commands</h2>
          <div className="rounded-[8px] border border-border bg-card divide-y divide-border/60 text-xs font-mono">
            <div className="p-4 flex items-center justify-between gap-4">
              <span className="font-bold text-[#0a5c38] dark:text-[#3fb68e]">/latest</span>
              <span className="text-muted-foreground text-right">Fetch the top 5 verified federal recruitments right now</span>
            </div>
            <div className="p-4 flex items-center justify-between gap-4">
              <span className="font-bold text-[#0a5c38] dark:text-[#3fb68e]">/watch [agency]</span>
              <span className="text-muted-foreground text-right">Subscribe to specific MDA (e.g. /watch NNPC, /watch NCS)</span>
            </div>
            <div className="p-4 flex items-center justify-between gap-4">
              <span className="font-bold text-[#0a5c38] dark:text-[#3fb68e]">/status [agency]</span>
              <span className="text-muted-foreground text-right">Check if a government recruitment portal is online right now</span>
            </div>
            <div className="p-4 flex items-center justify-between gap-4">
              <span className="font-bold text-[#0a5c38] dark:text-[#3fb68e]">/myalerts</span>
              <span className="text-muted-foreground text-right">Manage your active keywords and agency watchlists</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
