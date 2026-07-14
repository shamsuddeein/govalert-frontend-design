import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Nav, Footer } from "../components/layout";
import { agenciesData, type Agency } from "../lib/agenciesData";

export const Route = createFileRoute("/agencies/")({
  component: AgenciesIndexPage,
});

function VettedArc({ score }: { score: number }) {
  const radius = 10;
  const stroke = 2.5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center gap-1.5">
      <svg className="size-5 transform -rotate-90">
        <circle
          className="text-border"
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          className="text-[#0a5c38] dark:text-[#3fb68e]"
          strokeWidth={stroke}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <span className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">
        Vetted {score}%
      </span>
    </div>
  );
}

function AgenciesIndexPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");

  const categories = useMemo(() => {
    return Array.from(new Set(agenciesData.map((a) => a.category))).sort();
  }, []);

  const filteredAgencies = useMemo(() => {
    let result = [...agenciesData];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.short.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
      );
    }

    if (status) {
      result = result.filter((a) => a.portalStatus === status);
    }

    if (category) {
      result = result.filter((a) => a.category === category);
    }

    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [search, status, category]);

  const handleClearFilters = () => {
    setSearch("");
    setStatus("");
    setCategory("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-secondary/25 font-sans">
      <Nav />
      <main className="mx-auto max-w-[1184px] px-6 py-12">
        {/* Header */}
        <div className="mb-10 text-left space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#0a5c38] dark:text-[#3fb68e] font-mono">
            <span className="relative flex h-2 w-2">
              <span className="pulsing-dot absolute inline-flex h-full w-full rounded-full bg-[#0a5c38] dark:bg-[#3fb68e] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0a5c38] dark:bg-[#3fb68e]"></span>
            </span>
            <span>VETTING 13 ACTIVE GOVERNMENT REGISTRIES</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-primary md:text-[32px] leading-tight">
            Federal MDAs & Portal Directories
          </h1>
          <p className="text-[15px] text-muted-foreground">
            Verify official recruitment portal addresses, check uptime status, and access recruitment history for Ministries, Departments, and Agencies in Nigeria.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mb-8 rounded-[8px] border border-border bg-card p-5 shadow-sm space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Search input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by MDA name or acronym..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-[40px] w-full rounded-[6px] border border-border bg-background px-3 text-[14px] text-foreground outline-none placeholder:text-muted-foreground focus:border-[#0a5c38] dark:focus:border-[#3fb68e]"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-[40px] w-full rounded-[6px] border border-border bg-background px-3 text-[14px] text-foreground outline-none focus:border-[#0a5c38] dark:focus:border-[#3fb68e] cursor-pointer"
              >
                <option value="">All Categories ▾</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-[40px] w-full rounded-[6px] border border-border bg-background px-3 text-[14px] text-foreground outline-none focus:border-[#0a5c38] dark:focus:border-[#3fb68e] cursor-pointer"
              >
                <option value="">All Portal Statuses ▾</option>
                <option value="online">Online</option>
                <option value="review">Under Review</option>
                <option value="warning">Access Warning</option>
                <option value="closed">Portal Closed</option>
              </select>
            </div>
          </div>

          {/* Active Filters Clear Button */}
          {(search || status || category) && (
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] text-muted-foreground self-center uppercase font-bold">Active filters:</span>
                {search && (
                  <span className="inline-flex items-center gap-1 rounded bg-[#0a5c38]/10 text-[#0a5c38] dark:bg-[#3fb68e]/10 dark:text-[#3fb68e] px-2 py-0.5 text-xs font-semibold">
                    Search: {search}
                  </span>
                )}
                {category && (
                  <span className="inline-flex items-center gap-1 rounded bg-[#0a5c38]/10 text-[#0a5c38] dark:bg-[#3fb68e]/10 dark:text-[#3fb68e] px-2 py-0.5 text-xs font-semibold">
                    Category: {category}
                  </span>
                )}
                {status && (
                  <span className="inline-flex items-center gap-1 rounded bg-[#0a5c38]/10 text-[#0a5c38] dark:bg-[#3fb68e]/10 dark:text-[#3fb68e] px-2 py-0.5 text-xs font-semibold">
                    Portal: {status}
                  </span>
                )}
              </div>
              <button
                onClick={handleClearFilters}
                className="text-xs font-semibold text-muted-foreground hover:text-primary cursor-pointer"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="mb-6 border-b border-border/40 pb-3">
          <p className="text-[13px] text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredAgencies.length}</span> registered MDAs
          </p>
        </div>

        {/* Grid Layout of Agencies */}
        {filteredAgencies.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAgencies.map((agency) => {
              const isOnline = agency.portalStatus === "online";
              const isMaintenance = agency.portalStatus === "review" || agency.portalStatus === "warning";

              return (
                <div
                  key={agency.short}
                  className="group flex flex-col justify-between overflow-hidden rounded-[8px] border border-border bg-card p-6 shadow-sm interactive-card"
                >
                  <div className="space-y-4">
                    {/* Top Row: Acronym + Status Badge */}
                    <div className="flex items-center justify-between border-b border-border/40 pb-3">
                      <span className="inline-flex h-[32px] items-center justify-center rounded-[6px] bg-[#0a5c38] dark:bg-[#3fb68e] text-white dark:text-[#0c1015] px-3 font-sans text-xs font-bold uppercase tracking-wider">
                        {agency.short}
                      </span>
                      
                      <div className="flex items-center gap-1.5 text-[12px] font-medium">
                        <span className={`size-2 rounded-full ${
                          isOnline ? "bg-[#0a5c38]" : isMaintenance ? "bg-[#b45309]" : "bg-[#b91c1c]"
                        }`} />
                        <span className="text-foreground font-semibold">
                          {isOnline ? "Online" : isMaintenance ? "Under Review" : "Portal Closed"}
                        </span>
                      </div>
                    </div>

                    {/* Agency Info */}
                    <div>
                      <h3 className="text-[17px] font-semibold text-foreground transition-colors group-hover:text-primary">
                        {agency.name}
                      </h3>
                      <p className="mt-2 text-[13px] text-muted-foreground line-clamp-2 leading-relaxed">
                        {agency.description}
                      </p>
                    </div>

                    {/* Metrics details */}
                    <div className="grid grid-cols-2 gap-x-4 border-t border-border pt-4 text-[12px]">
                      <div>
                        <span className="block text-muted-foreground">Active recruitments</span>
                        <span className="font-semibold text-foreground">{agency.activeCount} active openings</span>
                      </div>
                      <div>
                        <span className="block text-muted-foreground">Tracked campaigns</span>
                        <span className="font-semibold text-foreground">{agency.historyCount} tracked campaigns</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 flex items-center justify-between text-[11px] border-t border-border/40 pt-4">
                    <span className="font-mono text-muted-foreground">
                      &thinsp;&thinsp;&#8635; Checked {agency.lastChecked}
                    </span>
                    <Link
                      to="/agencies/$agencyShort"
                      params={{ agencyShort: agency.short }}
                      className="font-semibold text-[#0a5c38] dark:text-[#3fb68e] hover:underline"
                    >
                      View profile &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[8px] border border-dashed border-border py-12 text-center bg-card">
            <h3 className="text-sm font-bold text-primary">No MDAs found</h3>
            <p className="mt-2 text-xs text-muted-foreground max-w-sm mx-auto">
              We couldn't find any departments or agencies matching your search or filters. Try
              adjusting your selections.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-6 inline-flex items-center gap-2 rounded-[6px] bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/95 cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
