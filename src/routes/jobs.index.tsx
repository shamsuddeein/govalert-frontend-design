import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Nav, Footer } from "../components/layout";
import { latestJobs, StatusBadge, type Job, type Status } from "./index";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Clock,
  Briefcase,
  X,
} from "lucide-react";

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
  const itemsPerPage = 6;

  // Extract unique agencies and states from mock data dynamically
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

    // Search query matching
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

    // Facet filters
    if (agency) result = result.filter((j) => j.agencyShort === agency);
    if (category) result = result.filter((j) => j.category === category);
    if (state) result = result.filter((j) => j.state === state);
    if (status) result = result.filter((j) => j.status === status);

    // Sorting
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
        // Closed jobs go to the bottom
        if (a.status === "closed" && b.status !== "closed") return 1;
        if (b.status === "closed" && a.status !== "closed") return -1;
        // Pending status
        if (a.deadline === "Pending" && b.deadline !== "Pending") return 1;
        if (b.deadline === "Pending" && a.deadline !== "Pending") return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      return 0;
    });

    return result;
  }, [search, agency, category, state, status, sortBy]);

  // Pagination calculation
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
    <div className="min-h-screen bg-background text-foreground selection:bg-secondary/25">
      <Nav />
      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="mb-10 text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-verified opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-verified"></span>
            </span>
            Real-time verification active
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-primary md:text-5xl">
            Federal Recruitments Feed
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Browse, search, and monitor verified federal government job openings, career pathways, and cadet courses in Nigeria.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="mb-8 rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
          <div className="flex flex-col gap-4">
            {/* Search Input and Sort */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by role title, agency, or ID..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-xl border border-border bg-background py-2.5 pl-11 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-muted"
                  >
                    <X className="size-3.5 text-muted-foreground" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
                <ArrowUpDown className="size-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-sm text-foreground outline-none border-none cursor-pointer"
                >
                  <option value="recent">Recently Detected</option>
                  <option value="oldest">Oldest First</option>
                  <option value="alpha">Alphabetical (A-Z)</option>
                  <option value="deadline">Nearest Deadline</option>
                </select>
              </div>
            </div>

            {/* Faceted Selectors */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {/* Agency Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Agency
                </label>
                <select
                  value={agency}
                  onChange={(e) => {
                    setAgency(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary"
                >
                  <option value="">All Agencies</option>
                  {agencies.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary"
                >
                  <option value="">All Categories</option>
                  {categoriesList.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* State Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Location (State)
                </label>
                <select
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary"
                >
                  <option value="">All States</option>
                  {states.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary"
                >
                  <option value="">All Statuses</option>
                  <option value="verified">Verified</option>
                  <option value="urgent">Urgent</option>
                  <option value="warning">Updating</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Clear Filters indicator */}
            {(search || agency || category || state || status) && (
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-muted-foreground self-center">Active filters:</span>
                  {search && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
                      Search: {search}
                    </span>
                  )}
                  {agency && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
                      Agency: {agency}
                    </span>
                  )}
                  {category && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
                      Category: {category}
                    </span>
                  )}
                  {state && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
                      State: {state}
                    </span>
                  )}
                  {status && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
                      Status: {status}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer"
                >
                  <SlidersHorizontal className="size-3" />
                  Reset all filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredAndSortedJobs.length}</span> verified listings
          </p>
        </div>

        {/* Job Listings Grid */}
        {paginatedJobs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedJobs.map((job) => (
              <Link
                key={job.id}
                to="/jobs/$jobId"
                params={{ jobId: job.id }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md cursor-pointer"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid size-12 place-items-center rounded-xl bg-muted font-mono text-sm font-semibold tracking-wider text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                      {job.agencyShort}
                    </div>
                    <StatusBadge status={job.status} />
                  </div>

                  <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {job.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">{job.agency}</p>

                  <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-4">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Briefcase className="size-3.5" />
                      <span>{job.category}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="size-3.5" />
                      <span>{job.state} State</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono-ui text-[9px] uppercase tracking-wider text-muted-foreground">
                      Deadline
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-foreground">
                      <Calendar className="size-3.5 text-muted-foreground" />
                      {job.deadline}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 text-right">
                    <span className="font-mono-ui text-[9px] uppercase tracking-wider text-muted-foreground">
                      Detected
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground justify-end">
                      <Clock className="size-3.5" />
                      {job.detected}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center">
            <SlidersHorizontal className="mx-auto size-12 text-muted-foreground" />
            <h3 className="mt-4 text-base font-semibold">No listings found</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
              We couldn't find any listings matching your search or filters. Try adjusting your selections or resetting.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/95 cursor-pointer"
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
              className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft className="size-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`inline-flex size-9 items-center justify-center rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  currentPage === page
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
