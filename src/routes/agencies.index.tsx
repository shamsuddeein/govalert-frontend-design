import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Nav, Footer } from "../components/layout";
import { agenciesData, type Agency } from "../lib/agenciesData";
import {
  Search,
  SlidersHorizontal,
  Clock,
  Briefcase,
  Archive,
  Building,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/agencies/")({
  component: AgenciesIndexPage,
});

function PortalStatusBadge({ status }: { status: Agency["portalStatus"] }) {
  const styles = {
    online: "bg-verified/10 text-verified border-verified/20",
    review: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    warning: "bg-closed/10 text-closed border-closed/20",
    closed: "bg-muted text-muted-foreground border-border",
  };

  const labels = {
    online: "Online",
    review: "Under Review",
    warning: "Access Warning",
    closed: "Portal Closed",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}
    >
      <span
        className={`size-1.5 rounded-full ${
          status === "online"
            ? "bg-verified animate-pulse"
            : status === "review"
              ? "bg-amber-500 animate-pulse"
              : status === "warning"
                ? "bg-closed animate-bounce"
                : "bg-muted-foreground"
        }`}
      />
      {labels[status]}
    </span>
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

    // Sort by name A-Z
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [search, status, category]);

  const handleClearFilters = () => {
    setSearch("");
    setStatus("");
    setCategory("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-secondary/25">
      <Nav />
      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="mb-10 text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 text-verified" />
            Vetting 13 active government registries
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-primary md:text-5xl">
            Federal MDAs & Portal Directories
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Verify official recruitment portal addresses, check uptime status, and access recruitment history for Ministries, Departments, and Agencies in Nigeria.
          </p>
        </div>

        {/* Filters Toolbar */}
        <div className="mb-8 rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by MDA name or acronym..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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

              {/* Category Filter */}
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
                <Building className="size-4 text-muted-foreground" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-transparent text-sm text-foreground outline-none border-none cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
                <SlidersHorizontal className="size-4 text-muted-foreground" />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="bg-transparent text-sm text-foreground outline-none border-none cursor-pointer"
                >
                  <option value="">All Portal Statuses</option>
                  <option value="online">Online</option>
                  <option value="review">Under Review</option>
                  <option value="warning">Access Warning</option>
                  <option value="closed">Portal Closed</option>
                </select>
              </div>
            </div>

            {/* Clear Filters Indicator */}
            {(search || status || category) && (
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-muted-foreground self-center">Active filters:</span>
                  {search && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
                      Search: {search}
                    </span>
                  )}
                  {category && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
                      Category: {category}
                    </span>
                  )}
                  {status && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
                      Portal: {status}
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

        {/* Results count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredAgencies.length}</span> registered MDAs
          </p>
        </div>

        {/* Grid Layout of Agencies */}
        {filteredAgencies.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAgencies.map((agency) => (
              <Link
                key={agency.short}
                to="/agencies/$agencyShort"
                params={{ agencyShort: agency.short }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md cursor-pointer"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid size-12 place-items-center rounded-xl bg-muted font-mono text-sm font-semibold tracking-wider text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                      {agency.short}
                    </div>
                    <PortalStatusBadge status={agency.portalStatus} />
                  </div>

                  <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {agency.name}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {agency.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-4">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Briefcase className="size-3.5" />
                      <span>{agency.activeCount} active recruitments</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Archive className="size-3.5" />
                      <span>{agency.historyCount} tracked campaigns</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/60 pt-4">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    Checked {agency.lastChecked}
                  </span>
                  <span className="inline-flex items-center gap-1 font-medium text-primary group-hover:underline">
                    View profile →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center">
            <SlidersHorizontal className="mx-auto size-12 text-muted-foreground" />
            <h3 className="mt-4 text-base font-semibold">No MDAs found</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
              We couldn't find any departments or agencies matching your search or filters. Try adjusting your selections.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/95 cursor-pointer"
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
