import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useMemo, useEffect } from "react";
import { Nav, Footer } from "../components/layout";
import { AgencyLogo } from "../components/AgencyLogo";
import { api, ApiAgency } from "../lib/api";
import { agenciesData } from "../lib/agenciesData";
import { safeFormatTime } from "../lib/formatDate";

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
  const [status, setSearchStatus] = useState("");
  const [category, setCategory] = useState("");

  const [agencies, setAgencies] = useState<ApiAgency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgencies = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAgencies();
      if (res && res.results && res.results.length > 0) {
        setAgencies(res.results);
      } else {
        const fallback: ApiAgency[] = agenciesData.map((a, idx) => ({
          id: idx + 1,
          name: a.name,
          acronym: a.short,
          slug: a.short.toLowerCase(),
          description: a.description,
          category: a.category,
          portal_url: a.recruitmentPortal,
          status: a.portalStatus === "closed" ? "offline" : a.portalStatus === "warning" ? "maintenance" : "online",
          last_checked: a.lastChecked,
          response_time_ms: 120,
          jobs_available: a.activeCount,
          vetted_score: a.trustScore,
        }));
        setAgencies(fallback);
      }
    } catch (err: any) {
      console.warn("Error fetching agencies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgencies();
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(agencies.map((a) => a.category))).sort();
  }, [agencies]);

  const filteredAgencies = useMemo(() => {
    let result = [...agencies];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          (a.name ? a.name.toLowerCase().includes(q) : false) ||
          (a.acronym ? a.acronym.toLowerCase().includes(q) : false) ||
          (a.description ? a.description.toLowerCase().includes(q) : false)
      );
    }

    if (status) {
      result = result.filter((a) => a.status === status);
    }

    if (category) {
      result = result.filter((a) => a.category === category);
    }

    return result;
  }, [search, status, category, agencies]);

  const handleClearFilters = () => {
    setSearch("");
    setSearchStatus("");
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
            <span>VETTING {agencies.length} ACTIVE GOVERNMENT REGISTRIES</span>
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
                onChange={(e) => setSearchStatus(e.target.value)}
                className="h-[40px] w-full rounded-[6px] border border-border bg-background px-3 text-[14px] text-foreground outline-none focus:border-[#0a5c38] dark:focus:border-[#3fb68e] cursor-pointer"
              >
                <option value="">All Portal Statuses ▾</option>
                <option value="online">Online</option>
                <option value="maintenance">Maintenance</option>
                <option value="offline">Offline</option>
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

        {/* Loading and Error States */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#0a5c38] dark:border-[#3fb68e]"></div>
            <p className="text-sm text-muted-foreground">Loading agencies directories...</p>
          </div>
        )}

        {error && (
          <div className="rounded-[8px] border border-red-200 bg-red-50/50 p-6 text-center max-w-md mx-auto space-y-4 my-10">
            <p className="text-sm font-medium text-red-600">{error}</p>
            <button
              onClick={fetchAgencies}
              className="px-4 py-2 text-xs font-semibold text-white bg-red-600 rounded-[6px] cursor-pointer hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
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
                  const isOnline = agency.status === "online";
                  const isMaintenance = agency.status === "maintenance";

                  return (
                    <div
                      key={agency.acronym}
                      className="group flex flex-col justify-between overflow-hidden rounded-[8px] border border-border bg-card p-6 shadow-sm interactive-card"
                    >
                      <div className="space-y-4">
                        {/* Top Row: Acronym + Status Badge */}
                        <div className="flex items-center justify-between border-b border-border/40 pb-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <AgencyLogo short={agency.acronym} url={agency.portal_url} size={36} />
                            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                              {agency.acronym}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 text-[12px] font-medium">
                            <span className={`size-2 rounded-full ${
                              isOnline ? "bg-[#0a5c38]" : isMaintenance ? "bg-[#b45309]" : "bg-[#b91c1c]"
                            }`} />
                            <span className="text-foreground font-semibold">
                              {isOnline ? "Online" : isMaintenance ? "Maintenance" : "Offline"}
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
                            <span className="font-semibold text-foreground">{agency.jobs_available} active openings</span>
                          </div>
                          <div>
                            <span className="block text-muted-foreground">Vetted Score</span>
                            <span className="font-semibold text-foreground">{agency.vetted_score}% confidence</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-6 flex items-center justify-between text-[11px] border-t border-border/40 pt-4">
                        <span className="font-mono text-muted-foreground">
                          &thinsp;&thinsp;&#8635; Checked {safeFormatTime(agency.last_checked, "Never")}
                        </span>
                        <Link
                          to="/agencies/$agencyShort"
                          params={{ agencyShort: agency.slug || agency.acronym }}
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
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
