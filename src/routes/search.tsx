import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Nav, Footer } from "../components/layout";
import { latestJobs, StatusBadge } from "./index";
import {
  Search as SearchIcon,
  Building,
  MapPin,
  Clock,
  Briefcase,
  SlidersHorizontal,
  BellRing,
  HelpCircle,
  X,
  Sliders,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/search")({
  component: SearchPage,
});

function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [agency, setAgency] = useState("");
  const [category, setCategory] = useState("");
  const [state, setState] = useState("");
  const [status, setStatus] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(true);

  // Extract list of unique agencies & categories
  const agencies = useMemo(() => {
    return Array.from(new Set(latestJobs.map((j) => j.agencyShort))).sort();
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(latestJobs.map((j) => j.category))).sort();
  }, []);

  const states = [
    "Abuja (FCT)",
    "Lagos State",
    "Rivers State",
    "Kano State",
    "Kaduna State",
    "Oyo State",
    "Enugu State",
    "Delta State",
  ];

  const filteredJobs = useMemo(() => {
    return latestJobs.filter((job) => {
      if (keyword && !job.title.toLowerCase().includes(keyword.toLowerCase()) && !job.agency.toLowerCase().includes(keyword.toLowerCase())) {
        return false;
      }
      if (agency && job.agencyShort !== agency) {
        return false;
      }
      if (category && job.category !== category) {
        return false;
      }
      if (state && !job.location.includes(state.split(" ")[0])) {
        return false;
      }
      if (status && job.status !== status) {
        return false;
      }
      return true;
    });
  }, [keyword, agency, category, state, status]);

  const handleSaveSearchAlert = () => {
    toast.success("Vetting Alert Saved! We will notify you when new listings match these parameters.");
  };

  const handleReset = () => {
    setKeyword("");
    setAgency("");
    setCategory("");
    setState("");
    setStatus("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-secondary/25">
      <Nav />
      <main className="flex-1 mx-auto max-w-7xl w-full px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">Advanced Search</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Refine search fields across vetted ministries, departments, and recruitment timelines.
          </p>
        </div>

        {/* Search Panel Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm mb-8">
          <div className="flex flex-col gap-4">
            {/* Primary Search Row */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by keywords (e.g., Engineer, Trainee, Custom)..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background py-2.5 pl-11 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                />
                {keyword && (
                  <button
                    onClick={() => setKeyword("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-muted"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
              
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border border-border hover:bg-muted/50 cursor-pointer"
              >
                <SlidersHorizontal className="size-4" />
                Filters
              </button>
            </div>

            {/* Advanced Filters Expandable Grid */}
            {showAdvanced && (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 border-t border-border pt-4 mt-1">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Building className="size-3" /> MDA Agency
                  </label>
                  <select
                    value={agency}
                    onChange={(e) => setAgency(e.target.value)}
                    className="rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                  >
                    <option value="">All Agencies</option>
                    {agencies.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Briefcase className="size-3" /> Job Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                  >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <MapPin className="size-3" /> Location (State)
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                  >
                    <option value="">All Locations</option>
                    {states.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Clock className="size-3" /> Status Vetting
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                  >
                    <option value="">All Statuses</option>
                    <option value="verified">Verified</option>
                    <option value="urgent">Urgent</option>
                    <option value="warning">Warning</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            )}

            {/* Panel Buttons */}
            <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Reset Search Filters
              </button>

              <button
                onClick={handleSaveSearchAlert}
                className="inline-flex items-center gap-2 rounded-xl bg-primary/10 border border-primary/20 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/15 cursor-pointer"
              >
                <BellRing className="size-3.5" />
                Save Search Alert
              </button>
            </div>
          </div>
        </div>

        {/* Results grid */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Found <span className="font-semibold text-foreground">{filteredJobs.length}</span> matching recruitments
          </p>
        </div>

        {filteredJobs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <Link
                key={job.id}
                to="/jobs/$jobId"
                params={{ jobId: job.id }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md cursor-pointer"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid size-12 place-items-center rounded-xl bg-muted font-mono text-sm font-semibold tracking-wider text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                      {job.agencyShort}
                    </span>
                    <StatusBadge status={job.status} />
                  </div>

                  <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary line-clamp-1">
                    {job.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {job.agency}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-4 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3.5" />
                      Deadline: {job.deadline}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/60 pt-4">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    Detected {job.detected}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-primary group-hover:underline">
                    View & Apply →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center">
            <Sliders className="mx-auto size-12 text-muted-foreground" />
            <h3 className="mt-4 text-base font-semibold">No results found</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
              Try adjusting your keywords or filter parameters. All job entries on GovAlert are sourced from official government bulletins.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
