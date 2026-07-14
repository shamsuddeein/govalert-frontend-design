import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 hover:opacity-90">
      <svg
        className="size-[24px] text-[#0a5c38] dark:text-[#3fb68e]"
        viewBox="0 0 30 36"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 2C15 2 27 5 27 13C27 23 15 32 15 32C15 32 3 23 3 13C3 5 15 2 15 2Z" />
        <path d="M10 17L14 21L20 13" />
      </svg>
      <span className="text-lg tracking-tight text-foreground font-sans">
        <span className="font-bold">Gov</span>
        <span className="font-normal">Alert</span>
      </span>
    </Link>
  );
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-primary cursor-pointer focus:outline-none"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <svg
          className="size-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
          />
        </svg>
      ) : (
        <svg
          className="size-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m0 13.5V21M4.22 4.22l1.59 1.59m12.38 12.38l1.59 1.59M3 12h2.25m13.5 0H21M5.81 18.19l-1.59 1.59m12.38-12.38l-1.59 1.59M12 7.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9z"
          />
        </svg>
      )}
    </button>
  );
}

export function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Brand Top Border Indicator (Nigerian Flag Green) */}
      <div className="h-0.75 w-full bg-[#008751]" />

      <nav className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md h-[60px]">
        <div className="mx-auto flex h-full max-w-[1184px] items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Logo />
            <div className="hidden gap-6 md:flex">
              <Link
                to="/"
                className="nav-link-underline text-[14px] font-medium text-muted-foreground transition-colors hover:text-primary py-1"
                activeProps={{ className: "text-primary font-semibold" }}
              >
                Home
              </Link>
              <Link
                to="/jobs"
                className="nav-link-underline text-[14px] font-medium text-muted-foreground transition-colors hover:text-primary py-1"
                activeProps={{ className: "text-primary font-semibold" }}
              >
                Jobs
              </Link>
              <Link
                to="/agencies"
                className="nav-link-underline text-[14px] font-medium text-muted-foreground transition-colors hover:text-primary py-1"
                activeProps={{ className: "text-primary font-semibold" }}
              >
                Agencies
              </Link>
              <Link
                to="/verification"
                className="nav-link-underline text-[14px] font-medium text-muted-foreground transition-colors hover:text-primary py-1"
                activeProps={{ className: "text-primary font-semibold" }}
              >
                Verification
              </Link>
              <Link
                to="/about"
                className="nav-link-underline text-[14px] font-medium text-muted-foreground transition-colors hover:text-primary py-1"
                activeProps={{ className: "text-primary font-semibold" }}
              >
                About
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/login"
              className="hidden text-[14px] font-medium text-muted-foreground hover:text-primary md:inline-flex cursor-pointer transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/dashboard"
              className="hidden text-[14px] font-medium text-muted-foreground hover:text-primary md:inline-flex cursor-pointer transition-colors"
              activeProps={{ className: "text-primary font-semibold" }}
            >
              Dashboard
            </Link>
            <a
              href="https://t.me/GovAlert"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex h-[36px] items-center gap-2 rounded-[8px] bg-[#0a5c38] hover:bg-[#0f7a4a] text-white dark:bg-[#3fb68e] dark:hover:bg-[#3fb68e]/90 dark:text-[#0c1015] px-[16px] text-[14px] font-semibold transition-transform active:scale-[0.98] cursor-pointer"
            >
              <svg className="size-[14px] fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.53-1.39.51-.46-.01-1.33-.26-1.99-.47-.8-.27-1.44-.41-1.39-.87.03-.24.35-.49.97-.75 3.79-1.65 6.32-2.73 7.57-3.26 3.61-1.53 4.36-1.8 4.85-1.8.11 0 .35.03.5.15.13.12.17.27.18.39-.01.08-.01.18-.02.26z" />
              </svg>
              Get Alerts
            </a>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex size-[40px] items-center justify-center rounded-[8px] border border-border md:hidden cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <svg className="size-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="size-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="absolute top-[60px] left-0 w-full bg-background border-b border-border z-40 flex flex-col p-6 space-y-4 md:hidden shadow-lg animate-in slide-in-from-top-4 duration-200">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[15px] font-medium text-foreground hover:text-primary"
            >
              Home
            </Link>
            <Link
              to="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[15px] font-medium text-foreground hover:text-primary"
            >
              Jobs
            </Link>
            <Link
              to="/agencies"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[15px] font-medium text-foreground hover:text-primary"
            >
              Agencies
            </Link>
            <Link
              to="/verification"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[15px] font-medium text-foreground hover:text-primary"
            >
              Verification
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[15px] font-medium text-foreground hover:text-primary"
            >
              About
            </Link>
            <hr className="border-border/60" />
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[15px] font-medium text-foreground hover:text-primary"
            >
              Sign In
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[15px] font-medium text-foreground hover:text-primary"
            >
              Dashboard
            </Link>
            <a
              href="https://t.me/GovAlert"
              target="_blank"
              rel="noreferrer"
              className="flex h-[40px] items-center justify-center gap-2 rounded-[8px] bg-[#0a5c38] text-white dark:bg-[#3fb68e] dark:text-[#0c1015] text-[14px] font-semibold"
            >
              <svg className="size-[14px] fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.53-1.39.51-.46-.01-1.33-.26-1.99-.47-.8-.27-1.44-.41-1.39-.87.03-.24.35-.49.97-.75 3.79-1.65 6.32-2.73 7.57-3.26 3.61-1.53 4.36-1.8 4.85-1.8.11 0 .35.03.5.15.13.12.17.27.18.39-.01.08-.01.18-.02.26z" />
              </svg>
              Join Telegram
            </a>
          </div>
        )}
      </nav>
    </>
  );
}

export function Footer() {
  const cols = [
    {
      heading: "Resources",
      links: [
        { label: "Verification Methodology", to: "/verification" },
        { label: "Monitored Agencies", to: "/agencies" },
        { label: "System Status", to: "/status" },
      ],
    },
    {
      heading: "Platform",
      links: [
        { label: "Official Telegram", to: "https://t.me/GovAlert", external: true },
        { label: "API Docs", to: "/contact" },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Privacy Policy", to: "/privacy" },
        { label: "Terms of Service", to: "/terms" },
      ],
    },
  ];

  return (
    <footer className="border-t-[3px] border-[#0a5c38] dark:border-[#3fb68e] bg-[#f0ede8] dark:bg-[#0a0e13] py-16">
      <div className="mx-auto max-w-[1184px] px-6">
        <div className="grid gap-12 md:grid-cols-[1.4fr_2fr] pb-12">
          <div className="space-y-4">
            <Logo />
            <p className="text-[14px] text-muted-foreground max-w-sm">
              Verified recruitment intelligence. Straight from the source.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
            {cols.map((c) => (
              <div key={c.heading}>
                <h5 className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {c.heading}
                </h5>
                <ul className="mt-4 space-y-2.5 text-[14px] text-foreground">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      {l.external ? (
                        <a
                          href={l.to}
                          target="_blank"
                          rel="noreferrer"
                          className="transition-colors hover:text-primary inline-flex items-center gap-1"
                        >
                          {l.label}
                          <svg className="size-3 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ) : (
                        <Link to={l.to} className="transition-colors hover:text-primary">
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 md:flex-row md:items-center">
          <p className="font-sans text-[11px] text-muted-foreground max-w-xl">
            © 2024 GovAlert. Independent monitoring. Not affiliated with the Federal Government.
          </p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="pulsing-dot absolute inline-flex h-full w-full rounded-full bg-[#0a5c38] dark:bg-[#3fb68e] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0a5c38] dark:bg-[#3fb68e]"></span>
            </span>
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#0a5c38] dark:text-[#3fb68e]">
              SYSTEMS OPERATIONAL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
