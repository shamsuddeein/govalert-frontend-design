import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Nav, Footer } from "../components/layout";
import { latestJobs, StatusBadge, type Job, type Status } from "./index";
import { agenciesData } from "../lib/agenciesData";

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
  const itemsPerPage = 9;

  // Extract unique agencies, states and categories dynamically
  const agencies = useMemo(() => {
    return Array.from(new Set(latestJobs.map((j) => j.agencyShort))).sort();
  }, []);

  const states = useMemo(() => {
    return Array.from(new Set(latestJobs.map((j) => j.state))).sort();
  }, []);

  const categoriesList = useMemo(() => {
    return Array.from(new Set(latestJobs.map((j) => j.category))).sort();
  }, []);

  // Filter and sort jobs
  const filteredAndSortedJobs = useMemo(() => {
    let result = [...latestJobs];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.agency.toLowerCase().includes(q) ||
          j.agencyShort.toLowerCase().includes(q) ||
          j.id.toLowerCase().includes(q)
      );
    }

    if (agency) result = result.filter((j) => j.agencyShort === agency);
    if (category) result = result.filter((j) => j.category === category);
    if (state) result = result.filter((j) => j.state === state);
    if (status) result = result.filter((j) => j.status === status);

    result.sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === "alpha") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "deadline") {
        if (a.status === "closed" && b.status !== "closed") return 1;
        if (b.status === "closed" && a.status !== "closed") return -1;
        if (a.deadline === "Pending" && b.deadline !== "Pending") return 1;
        if (b.deadline === "Pending" && a.deadline !== "Pending") return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      return 0;
    });

    return result;
  }, [search, agency, category, state, status, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedJobs.length / itemsPerPage);
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedJobs.slice(start, start + itemsPerPage);
  }, [filteredAndSortedJobs, currentPage]);

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
            Browse verified federal government job openings across all MDAs.
          </p>
        </div>

        {/* Search Input bar */}
        <div className="mb-6">
          <form
            className="flex items-center rounded-[8px] border border-border bg-card p-0.5 focus-within:ring-2 focus-within:ring-[#0a5c38] dark:focus-within:ring-[#3fb68e] focus-within:ring-offset-2 transition-shadow"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex items-center flex-1 px-3">
              <span className="text-muted-foreground mr-2 text-sm">🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by role title, agency, or ID..."
                className="w-full border-none bg-transparent py-3 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </form>
        </div>

        {/* Filter Toolbar (4 Dropdowns side-by-side) */}
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
              className="h-[40px] w-full rounded-[6px] border border-border bg-card px-3 text-[14px] text-foreground outline-none focus:border-[#0a5c38] dark:focus:border-[#3fb68e] cursor-pointer"
            >
              <option value="">All Agencies ▾</option>
              {agencies.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
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
              className="h-[40px] w-full rounded-[6px] border border-border bg-card px-3 text-[14px] text-foreground outline-none focus:border-[#0a5c38] dark:focus:border-[#3fb68e] cursor-pointer"
            >
              <option value="">All Categories ▾</option>
              {categoriesList.map((c) => (
                <option key={c} value={c}>
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
              className="h-[40px] w-full rounded-[6px] border border-border bg-card px-3 text-[14px] text-foreground outline-none focus:border-[#0a5c38] dark:focus:border-[#3fb68e] cursor-pointer"
            >
              <option value="">All Locations ▾</option>
              {states.map((s) => (
                <option key={s} value={s}>
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
              className="h-[40px] w-full rounded-[6px] border border-border bg-card px-3 text-[14px] text-foreground outline-none focus:border-[#0a5c38] dark:focus:border-[#3fb68e] cursor-pointer"
            >
              <option value="">All Statuses ▾</option>
              <option value="verified">Verified</option>
              <option value="urgent">Urgent</option>
              <option value="warning">Updating</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Info Counter Row */}
        <div className="mb-6 flex items-center justify-between border-b border-border/40 pb-3 text-[13px] text-muted-foreground">
          <p>
            Showing <span className="font-semibold text-foreground">{filteredAndSortedJobs.length}</span> verified listings
          </p>
          <div className="flex items-center gap-1">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
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
        {paginatedJobs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedJobs.map((job) => {
              const agencyDataObj = agenciesData.find((a) => a.short === job.agencyShort);
              const portalUrl = agencyDataObj ? agencyDataObj.recruitmentPortal : "#";
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
                      <span className="font-mono text-[11px] text-muted-foreground">REF: {job.id}</span>
                      <StatusBadge status={job.status} />
                    </div>

                    <div>
                      <h3 className="text-[18px] font-semibold leading-snug text-foreground">
                        {job.title}
                      </h3>
                      <p className="mt-1 text-[13px] font-medium text-[#0a5c38] dark:text-[#3fb68e] hover:underline">
                        <Link to="/agencies/$agencyShort" params={{ agencyShort: job.agencyShort }}>
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

                  <div className="mt-6 pt-3 flex justify-end">
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
              className="inline-flex size-8 items-center justify-center rounded-[6px] border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              &larr;
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`inline-flex size-8 items-center justify-center rounded-[6px] text-xs font-bold cursor-pointer ${
                  currentPage === page
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="inline-flex size-8 items-center justify-center rounded-[6px] border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              &rarr;
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
