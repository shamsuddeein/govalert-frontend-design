import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { Nav, Footer } from "../components/layout";
import { StatusBadge, JobsEmptyState } from "./index";
import { AgencyLogo } from "../components/AgencyLogo";
import { api, ApiJob } from "../lib/api";
import {
  Search as SearchIcon,
  Building,
  MapPin,
  Clock,
  Briefcase,
  SlidersHorizontal,
  BellRing,
  X,
  Sliders,
  Calendar,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/search")({
  component: SearchPage,
});

type DisplayJob = {
  id: string;
  agency: string;
  agencyShort: string;
  title: string;
  deadline: string;
  status: string;
  detected: string;
  category: string;
  state: string;
};

const CATEGORIES = [
  "Security",
  "Finance",
  "Utilities",
  "Health",
  "Education",
  "Transport",
  "Statistics",
  "Judiciary",
  "Other",
];

const STATES = [
  "Federal",
  "Abuja",
  "Lagos",
  "Rivers",
  "Kano",
  "Kaduna",
  "Oyo",
  "Enugu",
  "Delta",
  "Anambra",
  "Borno",
];

function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(true);

  const [results, setResults] = useState<DisplayJob[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Debounce keyword input
  useEffect(() => {
    const id = setTimeout(() => setDebouncedKeyword(keyword), 400);
    return () => clearTimeout(id);
  }, [keyword]);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getJobs({
        search: debouncedKeyword || undefined,
        category: category || undefined,
        location: location || undefined,
        status: status || undefined,
        page_size: 50,
      });

      if (res && res.results) {
        const mapped: DisplayJob[] = res.results.map((j: ApiJob) => ({
          id: j.ref,
          agency: j.agency_name,
          agencyShort: j.agency_acronym,
          title: j.title,
          deadline: j.deadline || "Pending",
          status: j.status === "new_opening" ? "new" : j.status,
          detected: j.published_at
            ? new Date(j.published_at).toLocaleDateString()
            : "Unknown",
          category: j.category,
          state: j.location_state,
        }));
        setResults(mapped);
        setTotalCount(res.count);
      } else {
        setResults([]);
        setTotalCount(0);
      }
    } catch {
      setResults([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [debouncedKeyword, category, location, status]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleSaveSearchAlert = () => {
    toast.success(
      "Vetting Alert Saved! We will notify you when new listings match these parameters.",
    );
  };

  const handleReset = () => {
    setKeyword("");
    setDebouncedKeyword("");
    setCategory("");
    setLocation("");
    setStatus("");
  };

  const hasActiveFilters = keyword || category || location || status;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-secondary/25">
      <Nav />
      <main className="flex-1 mx-auto max-w-7xl w-full px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-primary md:text-3xl">
            Advanced Search
          </h1>
          <p className="mt-2 text-xs text-muted-foreground">
            Refine search fields across vetted ministries, departments, and recruitment timelines.
          </p>
        </div>

        {/* Search Panel Card */}
        <div className="rounded-[8px] border border-border bg-card p-5 shadow-sm mb-8">
          <div className="flex flex-col gap-4">
            {/* Primary Search Row */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="search-keyword"
                  type="text"
                  placeholder="Search by keywords (e.g., Engineer, Trainee, Customs)..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full h-[44px] rounded-[6px] border border-border bg-background py-2 pl-10 pr-4 text-xs text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-[#0a5c38] dark:focus:border-[#3fb68e]"
                />
                {keyword && (
                  <button
                    onClick={() => setKeyword("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-muted"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 h-[44px] px-4 text-xs font-semibold rounded-[6px] border border-border hover:bg-muted/50 cursor-pointer"
              >
                <SlidersHorizontal className="size-4" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-1 h-2 w-2 rounded-full bg-[#0a5c38] dark:bg-[#3fb68e]" />
                )}
              </button>
            </div>

            {/* Advanced Filters Expandable Grid */}
            {showAdvanced && (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 border-t border-border pt-4 mt-1">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Briefcase className="size-3" /> Job Category
                  </label>
                  <select
                    id="search-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-[44px] w-full rounded-[6px] border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#0a5c38] dark:focus:border-[#3fb68e] cursor-pointer"
                  >
                    <option value="" className="bg-card text-foreground">All Categories</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-card text-foreground">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <MapPin className="size-3" /> State / Territory
                  </label>
                  <select
                    id="search-location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-[44px] w-full rounded-[6px] border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#0a5c38] dark:focus:border-[#3fb68e] cursor-pointer"
                  >
                    <option value="" className="bg-card text-foreground">All Locations</option>
                    {STATES.map((st) => (
                      <option key={st} value={st} className="bg-card text-foreground">
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Sliders className="size-3" /> Status
                  </label>
                  <select
                    id="search-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="h-[44px] w-full rounded-[6px] border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-[#0a5c38] dark:focus:border-[#3fb68e] cursor-pointer"
                  >
                    <option value="" className="bg-card text-foreground">All Statuses</option>
                    <option value="verified" className="bg-card text-foreground">Verified</option>
                    <option value="urgent" className="bg-card text-foreground">Urgent</option>
                    <option value="warning" className="bg-card text-foreground">Updating</option>
                    <option value="closed" className="bg-card text-foreground">Closed</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end gap-1.5">
                  <button
                    onClick={handleReset}
                    className="h-[44px] w-full rounded-[6px] border border-border bg-background px-3 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-6 flex justify-between items-center min-h-[24px]">
          {loading ? (
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              Searching live database...
            </span>
          ) : (
            <p className="text-xs text-muted-foreground">
              Found <span className="font-semibold text-foreground">{totalCount}</span>{" "}
              matching recruitment{totalCount !== 1 ? "s" : ""} in RecruitmentAlert database
            </p>
          )}
        </div>

        {/* Results Grid */}
        {!loading && results.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.map((job) => (
              <Link
                key={job.id}
                to="/jobs/$jobId"
                params={{ jobId: job.id }}
                className="group flex flex-col justify-between overflow-hidden rounded border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/45 cursor-pointer"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <AgencyLogo short={job.agencyShort} size={40} />
                    <StatusBadge status={job.status as any} />
                  </div>

                  <h3 className="mt-4 text-sm font-bold tracking-tight text-foreground transition-colors group-hover:text-primary line-clamp-2">
                    {job.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{job.agency}</p>

                  <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-4 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5" />
                      {job.state}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3.5" />
                      Deadline: {job.deadline}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between text-[10px] text-muted-foreground border-t border-border/60 pt-4">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    Detected {job.detected}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-primary group-hover:underline">
                    View &amp; Apply &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : !loading ? (
          <JobsEmptyState searchQuery={debouncedKeyword} onClear={hasActiveFilters ? handleReset : undefined} />
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
