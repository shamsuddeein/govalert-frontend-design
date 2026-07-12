import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

type Status = "verified" | "warning" | "urgent" | "closed";

const latestJobs: Array<{
  id: string;
  agency: string;
  agencyShort: string;
  title: string;
  deadline: string;
  status: Status;
  detected: string;
}> = [
  {
    id: "8829-GA",
    agency: "NNPC Limited",
    agencyShort: "NNPC",
    title: "Graduate Trainee Program (Engineering, 2024)",
    deadline: "Oct 24, 2024",
    status: "urgent",
    detected: "2h ago",
  },
  {
    id: "4120-GA",
    agency: "Nigeria Customs Service",
    agencyShort: "NCS",
    title: "Superintendent Cadre Recruitment",
    deadline: "Nov 12, 2024",
    status: "verified",
    detected: "6h ago",
  },
  {
    id: "9001-GA",
    agency: "EFCC Academy",
    agencyShort: "EFCC",
    title: "Detective Assistant Cadet Course",
    deadline: "Nov 02, 2024",
    status: "verified",
    detected: "1d ago",
  },
  {
    id: "7712-GA",
    agency: "Central Bank of Nigeria",
    agencyShort: "CBN",
    title: "Economic Policy Analysts (Level 7)",
    deadline: "Pending",
    status: "warning",
    detected: "3h ago",
  },
  {
    id: "6650-GA",
    agency: "Nigerian Air Force",
    agencyShort: "NAF",
    title: "Direct Short Service Commission (DSSC 33)",
    deadline: "Closed",
    status: "closed",
    detected: "2d ago",
  },
  {
    id: "5581-GA",
    agency: "Federal Fire Service",
    agencyShort: "FFS",
    title: "General Duty Officers Batch B",
    deadline: "Nov 20, 2024",
    status: "verified",
    detected: "5h ago",
  },
];

const featuredAgencies: Array<{
  short: string;
  name: string;
  portal: "online" | "review" | "closed";
  active: number;
}> = [
  { short: "NIMC", name: "Identity Management", portal: "online", active: 4 },
  { short: "EFCC", name: "Anti-Corruption", portal: "online", active: 2 },
  { short: "FIRS", name: "Federal Revenue", portal: "review", active: 1 },
  { short: "NAF", name: "Nigerian Air Force", portal: "closed", active: 0 },
  { short: "NPF", name: "Nigeria Police Force", portal: "online", active: 3 },
  { short: "NNPC", name: "National Petroleum Co.", portal: "online", active: 5 },
  { short: "NCS", name: "Customs Service", portal: "online", active: 2 },
  { short: "NPA", name: "Ports Authority", portal: "review", active: 1 },
];

const categories = [
  "Federal Civil Service",
  "Military & Paramilitary",
  "Law Enforcement",
  "Health & Medical",
  "Education",
  "Revenue & Finance",
  "Engineering & Energy",
  "Judiciary",
];

function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, { label: string; cls: string }> = {
    verified: { label: "Verified", cls: "bg-verified/10 text-verified ring-verified/20" },
    warning: { label: "Updating", cls: "bg-warning/15 text-warning ring-warning/25" },
    urgent: { label: "Urgent", cls: "bg-urgent/10 text-urgent ring-urgent/20" },
    closed: { label: "Closed", cls: "bg-closed/10 text-closed ring-closed/20" },
  };
  const s = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ${s.cls}`}
    >
      <span className={`size-1.5 rounded-full bg-current`} />
      {s.label}
    </span>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="grid size-8 place-items-center rounded bg-primary">
        <div className="size-3.5 rounded-full border-2 border-accent" />
      </div>
      <span className="text-lg font-semibold tracking-tight text-primary">GovAlert</span>
    </div>
  );
}

function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <div className="hidden gap-6 md:flex">
            <a href="#recruitments" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Recruitments</a>
            <a href="#agencies" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Agencies</a>
            <a href="#verification" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Verification</a>
            <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">About</a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="hidden text-sm font-medium text-muted-foreground hover:text-primary md:inline-flex">Sign in</button>
          <button className="inline-flex items-center gap-2 rounded-full bg-primary py-2 pl-3 pr-4 text-sm font-medium text-primary-foreground ring-1 ring-primary transition-transform hover:-translate-y-px">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.27 3.13A59.77 59.77 0 0 1 21.49 12 59.77 59.77 0 0 1 3.27 20.88L6 12zm0 0h7.5" />
            </svg>
            Join Telegram
          </button>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="overflow-hidden py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-verified/10 px-3 py-1 text-xs font-medium text-verified ring-1 ring-verified/20">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-verified opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-verified" />
              </span>
              Live verification active
            </span>
            <h1 className="mt-6 max-w-[20ch] text-balance text-5xl font-medium leading-tight text-primary md:text-6xl">
              The source of truth for{" "}
              <span className="font-display italic text-accent">federal opportunities.</span>
            </h1>
            <p className="mt-6 max-w-[52ch] text-pretty text-lg leading-relaxed text-muted-foreground">
              We monitor official gazettes and Nigerian MDA portals in real time. Every listing on
              GovAlert is verified by our intelligence desk before publication — so you skip the
              rumors, the scam sites, and the missed deadlines.
            </p>
            <form
              className="mt-10 flex max-w-md items-center rounded-2xl bg-card p-1.5 shadow-sm ring-1 ring-border"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="text"
                placeholder="Search NNPC, Customs, or NPF…"
                className="w-full border-none bg-transparent px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0"
              />
              <button className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:brightness-110">
                Search
              </button>
            </form>
            <div className="mt-6 flex flex-wrap gap-2">
              {["NNPC", "Customs", "EFCC", "NAF", "CBN", "FIRS"].map((tag) => (
                <button
                  key={tag}
                  className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Verification stream */}
          <div className="relative">
            <div className="rounded-3xl bg-primary p-6 shadow-2xl shadow-primary/20">
              <div className="mb-5 flex items-center justify-between">
                <span className="font-mono-ui text-[10px] font-semibold uppercase tracking-widest text-primary-foreground/50">
                  Verification stream
                </span>
                <span className="font-mono-ui text-[10px] text-primary-foreground/40">
                  Updated 2m ago
                </span>
              </div>
              <div className="space-y-4">
                <StreamRow color="verified" agency="NNPC Graduate Trainee Portal" note="Identity verification confirmed. High traffic detected." />
                <StreamRow color="warning" agency="Nigeria Customs Service" note="Portal maintenance scheduled for 18:00 WAT." />
                <StreamRow color="urgent" agency="EFCC recruitment alert" note="Phishing site detected: efcc-recruit.gov.ng is fake." />
                <StreamRow color="verified" agency="Federal Fire Service" note="Batch B application window now open." />
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-primary-foreground/10 pt-4">
                <span className="font-mono-ui text-[10px] uppercase tracking-widest text-primary-foreground/40">
                  Signed by GovAlert desk
                </span>
                <a href="#verification" className="text-xs font-medium text-secondary hover:underline">
                  How we verify →
                </a>
              </div>
            </div>
            <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[2.5rem] bg-secondary/10 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

function StreamRow({
  color,
  agency,
  note,
}: {
  color: "verified" | "warning" | "urgent";
  agency: string;
  note: string;
}) {
  const dot = {
    verified: "bg-verified",
    warning: "bg-accent",
    urgent: "bg-urgent",
  }[color];
  return (
    <div className="flex items-start gap-3 border-b border-primary-foreground/10 pb-4 last:border-b-0 last:pb-0">
      <div className={`mt-1.5 size-2 shrink-0 rounded-full ${dot}`} />
      <div className="min-w-0">
        <p className="text-sm font-medium text-primary-foreground">{agency}</p>
        <p className="text-xs text-primary-foreground/60">{note}</p>
      </div>
    </div>
  );
}

function Stats() {
  const items = [
    { label: "Verified portals", value: "42" },
    { label: "Active openings", value: "1,284" },
    { label: "Checks today", value: "8,912" },
    { label: "Trust rating", value: "99.8%", accent: true },
  ];
  return (
    <div className="border-y border-border bg-muted/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-8 md:grid-cols-4">
        {items.map((s) => (
          <div key={s.label}>
            <p className="font-mono-ui text-[10px] uppercase tracking-widest text-muted-foreground">
              {s.label}
            </p>
            <p className={`mt-1 text-2xl font-semibold ${s.accent ? "text-verified" : "text-primary"}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LatestJobs() {
  return (
    <section id="recruitments" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-medium text-primary md:text-4xl">Verified openings</h2>
            <p className="mt-2 text-muted-foreground">
              Latest authenticated recruitments from federal MDAs.
            </p>
          </div>
          <a href="#" className="hidden text-sm font-medium text-primary underline decoration-2 underline-offset-4 md:inline">
            View all listings →
          </a>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {latestJobs.map((job) => (
            <article
              key={job.id}
              className="group relative flex flex-col rounded-3xl bg-card p-7 ring-1 ring-border transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/5 hover:ring-primary/20"
            >
              <div className="mb-5 flex items-start justify-between">
                <div className="grid size-12 place-items-center rounded-xl bg-muted ring-1 ring-inset ring-border">
                  <span className="font-mono-ui text-[10px] font-semibold text-muted-foreground">
                    {job.agencyShort}
                  </span>
                </div>
                <StatusBadge status={job.status} />
              </div>
              <h3 className="text-lg font-semibold leading-snug text-primary">{job.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{job.agency}</p>

              <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                <div>
                  <p className="font-mono-ui text-[10px] uppercase tracking-widest text-muted-foreground">
                    Deadline
                  </p>
                  <p className="text-sm font-medium text-foreground">{job.deadline}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono-ui text-[10px] uppercase tracking-widest text-muted-foreground">
                    Detected
                  </p>
                  <p className="font-mono-ui text-xs text-foreground">{job.detected}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section className="border-t border-border bg-muted/40 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-medium text-primary md:text-3xl">Browse by category</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Jump to a domain of federal recruitment we actively track.
            </p>
          </div>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {categories.map((c) => (
            <a
              key={c}
              href="#"
              className="group rounded-2xl bg-card p-5 ring-1 ring-border transition-colors hover:ring-primary/30"
            >
              <p className="text-sm font-medium text-primary group-hover:text-primary">{c}</p>
              <p className="mt-1 font-mono-ui text-[11px] text-muted-foreground">
                {Math.floor(Math.random() * 40) + 6} live openings
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Agencies() {
  const dot = (p: "online" | "review" | "closed") =>
    p === "online" ? "bg-verified" : p === "review" ? "bg-accent" : "bg-closed";
  const label = (p: "online" | "review" | "closed") =>
    p === "online" ? "Portal online" : p === "review" ? "Under review" : "Portal closed";
  return (
    <section id="agencies" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-medium text-primary md:text-4xl">Monitored agencies</h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            We track over 150 ministries, departments, and agencies daily. Here are eight portals
            currently under active surveillance.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-border ring-1 ring-border md:grid-cols-4">
          {featuredAgencies.map((a) => (
            <a
              key={a.short}
              href="#"
              className="group flex flex-col justify-between bg-card p-6 transition-colors hover:bg-muted/60"
            >
              <div>
                <p className="font-mono-ui text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {a.short}
                </p>
                <p className="mt-2 text-sm font-medium text-primary">{a.name}</p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                  <span className={`size-1.5 rounded-full ${dot(a.portal)}`} />
                  {label(a.portal)}
                </span>
                <span className="font-mono-ui text-[10px] text-muted-foreground">
                  {a.active} live
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Continuous portal monitoring",
      body: "Automated crawlers check every registered .gov.ng recruitment endpoint on a rolling 15-minute cycle.",
    },
    {
      n: "02",
      title: "Two-source verification",
      body: "Each detected posting is cross-referenced against an official gazette or the agency's verified handle before publishing.",
    },
    {
      n: "03",
      title: "Signed & timestamped",
      body: "Verified bulletins are cryptographically stamped and pushed to your feed, dashboard, and Telegram — instantly.",
    },
  ];
  return (
    <section id="verification" className="border-y border-border bg-muted/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-mono-ui text-[10px] font-semibold uppercase tracking-widest text-accent">
            How GovAlert works
          </span>
          <h2 className="mt-3 text-3xl font-medium text-primary md:text-4xl">
            Three checks between us and every listing.
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="rounded-3xl bg-card p-8 ring-1 ring-border">
              <span className="font-mono-ui text-xs font-semibold text-accent">{s.n}</span>
              <h3 className="mt-4 text-lg font-semibold text-primary">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TelegramCTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-primary p-12 text-center text-primary-foreground md:p-20">
          <h2 className="text-4xl font-medium leading-tight md:text-5xl">
            Get instant alerts on Telegram.
          </h2>
          <p className="mx-auto mt-6 max-w-[48ch] text-primary-foreground/70">
            Don't miss the deadline. Join 45,000+ Nigerians receiving verified recruitment
            notifications the second they go live.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full bg-secondary py-3 pl-4 pr-6 text-sm font-medium text-primary transition-transform hover:scale-[1.02]"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.27 3.13A59.77 59.77 0 0 1 21.49 12 59.77 59.77 0 0 1 3.27 20.88L6 12zm0 0h7.5" />
              </svg>
              Join the channel
            </a>
            <a
              href="#verification"
              className="rounded-full bg-primary-foreground/10 px-6 py-3 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-primary-foreground/20"
            >
              Learn about our vetting
            </a>
          </div>
          <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-secondary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 size-80 rounded-full bg-accent/15 blur-3xl" />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cols: Array<{ heading: string; links: string[] }> = [
    { heading: "Product", links: ["Search feed", "Agency profiles", "Verification guide", "API access"] },
    { heading: "Company", links: ["About", "Contact", "Careers", "Press"] },
    { heading: "Legal", links: ["Privacy policy", "Terms of service", "Data protection", "Cookies"] },
  ];
  return (
    <footer className="border-t border-border bg-background py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Empowering Nigerian job seekers with verified recruitment intelligence. Data you can
              trust, straight from the source.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
            {cols.map((c) => (
              <div key={c.heading}>
                <h5 className="font-mono-ui text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {c.heading}
                </h5>
                <ul className="mt-4 space-y-2 text-sm text-foreground">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="transition-colors hover:text-primary">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 md:flex-row md:items-center">
          <p className="font-mono-ui text-[10px] uppercase tracking-widest text-muted-foreground">
            © 2024 GovAlert Intelligence · Independent monitoring service · Not affiliated with the FGN
          </p>
          <p className="font-mono-ui text-[10px] uppercase tracking-widest text-verified">
            Systems operational
          </p>
        </div>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-secondary/25">
      <Nav />
      <main>
        <Hero />
        <Stats />
        <LatestJobs />
        <Categories />
        <Agencies />
        <HowItWorks />
        <TelegramCTA />
      </main>
      <Footer />
    </div>
  );
}
