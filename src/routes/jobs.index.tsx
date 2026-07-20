import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { Nav, Footer } from "../components/layout";
import { AgencyLogo } from "../components/AgencyLogo";
import { StatusBadge, JobCardSkeleton, JobsEmptyState, JobsErrorState, type Job, type Status } from "./index";
import { api, ApiAgency, isAuthenticated } from "../lib/api";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { OfficialSourceLink } from "../components/OfficialSourceLink";

export const Route = createFileRoute("/jobs/")({
  component: JobsPage,
});

function JobsPage() {
  const [search, setSearch] = useState("");
  const [agency, setAgency] = useState("");
  const [category, setCategory] = useState("");
  const [state, setState] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "alpha" | "deadline">("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;

  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [savedRefMap, setSavedRefMap] = useState<Record<string, boolean>>({});
  const [agenciesList, setAgenciesList] = useState<ApiAgency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAgenciesAndSaved = async () => {
      try {
        const res = await api.getAgencies();
        if (res && res.results) {
          setAgenciesList(res.results);
        }
        if (isAuthenticated()) {
          const saved = await api.getSavedJobs();
          const map: Record<string, boolean> = {};
          saved.forEach((j) => {
            map[j.ref] = true;
          });
          setSavedRefMap(map);
        }
      } catch (e) {}
    };
    loadAgenciesAndSaved();
  }, []);

  const handleToggleBookmark = async (ref: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated()) {
      toast.error("Please sign in to save jobs!");
      return;
    }
    const isBookmarked = savedRefMap[ref];
    if (isBookmarked) {
      const success = await api.unsaveJob(ref);
      if (success) {
        setSavedRefMap((prev) => ({ ...prev, [ref]: false }));
        toast.success("Job removed from saved list.");
      }
    } else {
      const success = await api.saveJob(ref);
      if (success) {
        setSavedRefMap((prev) => ({ ...prev, [ref]: true }));
        toast.success("Job saved to dashboard!");
      }
    }
  };

  const fetchFilteredJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const orderingMap: Record<string, string> = {
        recent: "-published_at",
        oldest: "published_at",
        alpha: "title",
        deadline: "deadline",
      };
      const res = await api.getJobs({
        search: search || undefined,
        category: category || undefined,
        location: state || undefined,
        status: status || undefined,
        ordering: orderingMap[sortBy] || undefined,
        agency: agency || undefined,
        page: currentPage,
        page_size: PAGE_SIZE,
      });

      if (res && res.results) {
        const mapped = res.results.map((j) => ({
          id: j.ref,
          agency: j.agency_name,
          agencyShort: j.agency_acronym,
          title: j.title,
          deadline: j.deadline || "Pending",
          status: (j.status === "new_opening" ? "new" : j.status) as Status,
          detected: new Date(j.published_at).toLocaleDateString(),
          category: j.category,
          state: j.location_state,
          createdAt: j.published_at,
          positions: j.positions || "Multiple Positions",
          officialUrl: j.official_url,
        }));
        setJobs(mapped);
        setTotalCount(res.count);
      } else {
        setJobs([]);
        setTotalCount(0);
      }
    } catch (err: any) {
      console.warn("API Error fetching jobs:", err);
      setError(err?.message || "Failed to load jobs from live API. Please try again.");
      setJobs([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when filters or page changes
  useEffect(() => {
    fetchFilteredJobs();
  }, [search, agency, category, state, status, sortBy, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, agency, category, state, status, sortBy]);

  const agencies = useMemo(() => {
    return agenciesList.map((a) => a.acronym).sort();
  }, [agenciesList]);

  const states = useMemo(() => {
    return Array.from(new Set(jobs.map((j) => j.state))).sort();
  }, [jobs]);

  const categoriesList = useMemo(() => {
    return ["Security", "Finance", "Utilities", "Health", "Education", "Transport", "Statistics", "Judiciary", "Other"];
  }, []);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const handleClearFilters = () => {
    setSearch("");
    setAgency("");
    setCategory("");
    setState("");
    setStatus("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-secondary/25 font-sans">
      <Nav />
      <main className="mx-auto max-w-[1184px] px-6 py-12">
        {/* Header */}
        <div className="mb-10 text-left space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
            <span className="relative flex h-2 w-2">
              <span className="pulsing-dot absolute inline-flex h-full w-full rounded-full bg-[#0a5c38] dark:bg-[#3fb68e] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0a5c38] dark:bg-[#3fb68e]"></span>
            </span>
            <span>REAL-TIME VERIFICATION ACTIVE</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-primary md:text-[32px] leading-tight">
            Federal Recruitments Feed
          </h1>
          <p className="text-[15px] text-muted-foreground">
            Live surveillance index of verified recruitment notices across Nigerian Federal Ministries, Departments, and Agencies.
          </p>
        </div>

        {/* Search Input bar */}
        <div className="mb-6">
          <form
            className="flex items-center rounded-[8px] border border-border bg-card p-0.5 focus-within:ring-2 focus-within:ring-[#0a5c38] dark:focus-within:ring-[#3fb68e] focus-within:ring-offset-2 transition-shadow"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="relative flex-1">
              <svg
                className="pointer-events-none absolute left-[12px] top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by role title, agency, or ID..."
                className="w-full border-none bg-transparent py-3 pl-10 pr-3 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </form>
        </div>

        {/* Filter Toolbar */}
        <div className="mb-6 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
            Filter Parameters
          </span>
          {(search || agency || category || state || status) && (
            <button
              onClick={handleClearFilters}
              className="text-xs font-semibold text-[#0a5c38] dark:text-[#3fb68e] hover:underline cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Agency
            </label>
            <select
              value={agency}
              onChange={(e) => {
                setAgency(e.target.value);
                setCurrentPage(1);
              }}
              className="h-[44px] w-full rounded-[6px] border border-border bg-card px-3 text-[14px] text-foreground outline-none focus:border-[#0a5c38] dark:focus:border-[#3fb68e] cursor-pointer"
            >
              <option value="" className="bg-card text-foreground">All Agencies ▾</option>
              {agencies.length === 0 ? (
                <option value="" disabled className="bg-card text-muted-foreground">Loading agencies...</option>
              ) : (
                agencies.map((a) => (
                  <option key={a} value={a} className="bg-card text-foreground">
                    {a}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="h-[44px] w-full rounded-[6px] border border-border bg-card px-3 text-[14px] text-foreground outline-none focus:border-[#0a5c38] dark:focus:border-[#3fb68e] cursor-pointer"
            >
              <option value="" className="bg-card text-foreground">All Categories ▾</option>
              {categoriesList.map((c) => (
                <option key={c} value={c} className="bg-card text-foreground">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Location
            </label>
            <select
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                setCurrentPage(1);
              }}
              className="h-[44px] w-full rounded-[6px] border border-border bg-card px-3 text-[14px] text-foreground outline-none focus:border-[#0a5c38] dark:focus:border-[#3fb68e] cursor-pointer"
            >
              <option value="" className="bg-card text-foreground">All Locations ▾</option>
              {states.map((s) => (
                <option key={s} value={s} className="bg-card text-foreground">
                  {s} State
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="h-[44px] w-full rounded-[6px] border border-border bg-card px-3 text-[14px] text-foreground outline-none focus:border-[#0a5c38] dark:focus:border-[#3fb68e] cursor-pointer"
            >
              <option value="" className="bg-card text-foreground">All Statuses ▾</option>
              <option value="verified" className="bg-card text-foreground">Verified</option>
              <option value="urgent" className="bg-card text-foreground">Urgent</option>
              <option value="warning" className="bg-card text-foreground">Updating</option>
              <option value="closed" className="bg-card text-foreground">Closed</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 my-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <JobCardSkeleton key={idx} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <JobsErrorState message={error} onRetry={fetchFilteredJobs} />
        )}

        {/* Content State */}
        {!loading && !error && (
          <>
            {/* Info Counter Row */}
            <div className="mb-6 flex items-center justify-between border-b border-border/40 pb-3 text-[13px] text-muted-foreground font-sans">
              <p>
                Indexed <span className="font-semibold text-foreground">{jobs.length}</span> verified notices
              </p>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-card border border-border rounded-[6px] px-2 py-1 text-xs font-semibold text-foreground outline-none cursor-pointer font-sans"
                >
                  <option value="recent" className="bg-card text-foreground">Recently Detected &darr;</option>
                  <option value="oldest" className="bg-card text-foreground">Oldest First</option>
                  <option value="alpha" className="bg-card text-foreground">Alphabetical (A-Z)</option>
                  <option value="deadline" className="bg-card text-foreground">Nearest Deadline</option>
                </select>
              </div>
            </div>

            {/* Job Listings Grid */}
            {jobs.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => {
                  const portalUrl = job.official_url || "#";
                  const isClosed = job.status === "closed";

                  return (
                    <div
                      key={job.id}
                      className={`group flex flex-col justify-between rounded-[8px] border border-border bg-card p-4 sm:p-6 shadow-sm interactive-card ${
                        isClosed ? "opacity-65 bg-muted/5" : ""
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-2 min-w-0">
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <AgencyLogo short={job.agencyShort} size={32} className="shrink-0" />
                            <span className="font-mono text-[11px] text-muted-foreground truncate min-w-0">
                              REF: {job.id}
                            </span>
                          </div>
                          <StatusBadge status={job.status} />
                        </div>

                        <div>
                          <h3 className="text-[16px] sm:text-[18px] font-semibold leading-snug text-foreground">
                            {job.title}
                          </h3>
                          <p className="mt-1 text-[13px] font-medium text-[#0a5c38] dark:text-[#3fb68e] hover:underline">
                            <Link to="/agencies/$agencyShort" params={{ agencyShort: job.agencyShort || job.agency || "NNPC" }}>
                              {job.agency}
                            </Link>
                          </p>
                        </div>

                        <div className="border-t border-border pt-4 grid grid-cols-1 xs:grid-cols-2 gap-x-4 gap-y-2 text-[13px]">
                          <div>
                            <span className="block text-muted-foreground text-[12px]">Deadline</span>
                            <span className="font-medium text-foreground">{job.deadline}</span>
                          </div>
                          <div>
                            <span className="block text-muted-foreground text-[12px]">Positions</span>
                            <span className="font-medium text-foreground">{job.positions || "Multiple"}</span>
                          </div>
                          <div>
                            <span className="block text-muted-foreground text-[12px]">Published</span>
                            <span className="font-medium text-foreground">{job.detected}</span>
                          </div>
                          <div>
                            <span className="block text-muted-foreground text-[12px]">Verification</span>
                            <OfficialSourceLink url={portalUrl} />
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-3 flex items-center justify-between border-t border-border/40">
                        <button
                          onClick={(e) => handleToggleBookmark(job.id, e)}
                          className={`inline-flex items-center gap-1.5 text-[12px] font-semibold transition-colors cursor-pointer font-sans ${
                            savedRefMap[job.id]
                              ? "text-[#0a5c38] dark:text-[#3fb68e]"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {savedRefMap[job.id] ? (
                            <BookmarkCheck className="size-4 fill-current" />
                          ) : (
                            <Bookmark className="size-4" />
                          )}
                          <span>{savedRefMap[job.id] ? "Saved" : "Save"}</span>
                        </button>

                        <Link
                          to="/jobs/$jobId"
                          params={{ jobId: job.id }}
                          className="text-[13px] text-[#0a5c38] dark:text-[#3fb68e] hover:underline font-semibold font-sans"
                        >
                          View details &rarr;
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <JobsEmptyState onClear={handleClearFilters} />
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2 border-t border-border pt-8">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="inline-flex h-[44px] px-4 items-center justify-center rounded-[6px] border border-border bg-card text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  ← Prev
                </button>

                <span className="text-xs text-muted-foreground font-mono px-3">
                  Page {currentPage} of {totalPages} &nbsp;·&nbsp; {totalCount} results
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="inline-flex h-[44px] px-4 items-center justify-center rounded-[6px] border border-border bg-card text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  Next →
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
