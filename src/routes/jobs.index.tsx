import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { Nav, Footer } from "../components/layout";
import { AgencyLogo } from "../components/AgencyLogo";
import { StatusBadge, latestJobs, type Job, type Status } from "./index";
import { api, ApiAgency, isAuthenticated } from "../lib/api";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";

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

      if (res && res.results && res.results.length > 0) {
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
        setJobs(latestJobs);
        setTotalCount(latestJobs.length);
      }
    } catch (err: any) {
      setJobs(latestJobs);
      setTotalCount(latestJobs.length);
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

        {/* Loading and Error States */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#0a5c38] dark:border-[#3fb68e]"></div>
            <p className="text-sm text-muted-foreground">Loading verified listings...</p>
          </div>
        )}

        {error && (
          <div className="rounded-[8px] border border-red-200 bg-red-50/50 p-6 text-center max-w-md mx-auto space-y-4 my-10">
            <p className="text-sm font-medium text-red-600">{error}</p>
            <button
              onClick={fetchFilteredJobs}
              className="px-4 py-2 text-xs font-semibold text-white bg-red-600 rounded-[6px] cursor-pointer hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Info Counter Row */}
            <div className="mb-6 flex items-center justify-between border-b border-border/40 pb-3 text-[13px] text-muted-foreground">
              <p>
                Showing <span className="font-semibold text-foreground">{jobs.length}</span> verified listings
              </p>
              <div className="flex items-center gap-1">
                <span>Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent font-semibold text-foreground outline-none border-none cursor-pointer"
                >
                  <option value="recent">Recently Detected &darr;</option>
                  <option value="oldest">Oldest First</option>
                  <option value="alpha">Alphabetical (A-Z)</option>
                  <option value="deadline">Nearest Deadline</option>
                </select>
              </div>
            </div>

            {/* Job Listings Grid */}
            {jobs.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => {
                  const portalUrl = job.officialUrl || "#";
                  const isClosed = job.status === "closed";

                  return (
                    <div
                      key={job.id}
                      className={`group flex flex-col justify-between rounded-[8px] border border-border bg-card p-6 shadow-sm interactive-card ${
                        isClosed ? "opacity-65 bg-muted/5" : ""
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <AgencyLogo short={job.agencyShort} size={32} />
                            <span className="font-mono text-[11px] text-muted-foreground truncate">REF: {job.id}</span>
                          </div>
                          <StatusBadge status={job.status} />
                        </div>

                        <div>
                          <h3 className="text-[18px] font-semibold leading-snug text-foreground">
                            {job.title}
                          </h3>
                          <p className="mt-1 text-[13px] font-medium text-[#0a5c38] dark:text-[#3fb68e] hover:underline">
                            <Link to="/agencies/$agencyShort" params={{ agencyShort: job.agencyShort || job.agency || "NNPC" }}>
                              {job.agency}
                            </Link>
                          </p>
                        </div>

                        <div className="border-t border-border pt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[13px]">
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
                            <a
                              href={portalUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="font-medium text-[#0a5c38] dark:text-[#3fb68e] hover:underline inline-flex items-center gap-1 text-[12px]"
                            >
                              OFFICIAL SOURCE
                              <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-3 flex items-center justify-between border-t border-border/40">
                        <button
                          onClick={(e) => handleToggleBookmark(job.id, e)}
                          className={`inline-flex items-center gap-1.5 text-[12px] font-semibold transition-colors cursor-pointer ${
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
                          className="text-[13px] text-[#0a5c38] dark:text-[#3fb68e] hover:underline font-semibold"
                        >
                          View details &rarr;
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[8px] border border-dashed border-border py-12 text-center bg-card">
                <h3 className="text-sm font-bold text-primary">No listings found</h3>
                <p className="mt-2 text-xs text-muted-foreground max-w-sm mx-auto">
                  We couldn't find any listings matching your search or filters. Try adjusting your
                  selections or resetting.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="mt-6 inline-flex items-center gap-2 rounded-[6px] bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/95 cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2 border-t border-border pt-8">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="inline-flex h-8 px-3 items-center justify-center rounded-[6px] border border-border bg-card text-xs text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  ← Prev
                </button>

                <span className="text-xs text-muted-foreground font-mono px-3">
                  Page {currentPage} of {totalPages} &nbsp;·&nbsp; {totalCount} results
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="inline-flex h-8 px-3 items-center justify-center rounded-[6px] border border-border bg-card text-xs text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
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
