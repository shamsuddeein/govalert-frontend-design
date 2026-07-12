import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 hover:opacity-90">
      <div className="grid size-8 place-items-center rounded bg-primary">
        <div className="size-3.5 rounded-full border-2 border-accent" />
      </div>
      <span className="text-lg font-semibold tracking-tight text-primary">GovAlert</span>
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
      className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-primary cursor-pointer"
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
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <div className="hidden gap-6 md:flex">
            <Link
              to="/jobs"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              activeProps={{ className: "text-primary font-semibold" }}
            >
              All Jobs
            </Link>
            <Link
              to="/search"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              activeProps={{ className: "text-primary font-semibold" }}
            >
              Search
            </Link>
            <a
              href="/#recruitments"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Recruitments
            </a>
            <Link
              to="/agencies"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              activeProps={{ className: "text-primary font-semibold" }}
            >
              Agencies
            </Link>
            <a
              href="/#verification"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Verification
            </a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/dashboard"
            className="hidden text-sm font-medium text-muted-foreground hover:text-primary md:inline-flex cursor-pointer"
            activeProps={{ className: "text-primary font-semibold" }}
          >
            Dashboard
          </Link>
          <button className="inline-flex items-center gap-2 rounded-full bg-primary py-2 pl-3 pr-4 text-sm font-medium text-primary-foreground ring-1 ring-primary transition-transform hover:-translate-y-px cursor-pointer">
            <svg
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.75}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.27 3.13A59.77 59.77 0 0 1 21.49 12 59.77 59.77 0 0 1 3.27 20.88L6 12zm0 0h7.5"
              />
            </svg>
            Join Telegram
          </button>
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  const cols = [
    {
      heading: "Product",
      links: [
        { label: "Search feed", to: "/search" },
        { label: "Agency profiles", to: "/agencies" },
        { label: "Verification guide", to: "/faq" },
        { label: "API access", to: "/contact" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About", to: "/about" },
        { label: "Contact", to: "/contact" },
        { label: "Careers", to: "/contact" },
        { label: "Press", to: "/contact" },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Privacy policy", to: "/privacy" },
        { label: "Terms of service", to: "/terms" },
        { label: "Data protection", to: "/privacy" },
        { label: "Cookies", to: "/privacy" },
      ],
    },
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
                    <li key={l.label}>
                      <Link to={l.to} className="transition-colors hover:text-primary">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 md:flex-row md:items-center">
          <p className="font-mono-ui text-[10px] uppercase tracking-widest text-muted-foreground">
            © 2024 GovAlert Intelligence · Independent monitoring service · Not affiliated with the
            FGN
          </p>
          <p className="font-mono-ui text-[10px] uppercase tracking-widest text-verified">
            Systems operational
          </p>
        </div>
      </div>
    </footer>
  );
}
