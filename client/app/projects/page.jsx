"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import CardSkeleton from "@/components/CardSkeleton";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { useTerraLend } from "@/context/TerraLendContext";
import { FUNDING_MODEL } from "@/lib/config";
import { fundingPercent } from "@/lib/format";
import { isExpired } from "@/utils/date";

const FILTERS = ["All", FUNDING_MODEL.GRANT, FUNDING_MODEL.GREEN_LOAN, "Active", "Funded"];
const SORTS = {
  newest: "Newest",
  mostFunded: "Most funded",
  endingSoon: "Ending soon",
};

export default function ProjectsPage() {
  const { projects, loading, isConnected } = useTerraLend();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("newest");

  const visible = useMemo(() => {
    let list = [...projects];

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q)
      );
    }

    list = list.filter((p) => {
      switch (filter) {
        case FUNDING_MODEL.GRANT:
          return p.model === FUNDING_MODEL.GRANT;
        case FUNDING_MODEL.GREEN_LOAN:
          return p.model === FUNDING_MODEL.GREEN_LOAN;
        case "Active":
          return !isExpired(p.deadlineUnix) && fundingPercent(p.amountRaised, p.target) < 100;
        case "Funded":
          return fundingPercent(p.amountRaised, p.target) >= 100;
        default:
          return true;
      }
    });

    switch (sort) {
      case "mostFunded":
        list.sort(
          (a, b) => fundingPercent(b.amountRaised, b.target) - fundingPercent(a.amountRaised, a.target)
        );
        break;
      case "endingSoon":
        list.sort((a, b) => a.deadlineUnix - b.deadlineUnix);
        break;
      default:
        list.sort((a, b) => b.id - a.id);
    }

    return list;
  }, [projects, query, filter, sort]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-10 md:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Explore projects
            </h1>
            <p className="mt-2 text-muted-foreground">
              Back climate and impact projects as grants or green loans.
            </p>
          </div>
          <Link href="/create">
            <Button>
              <Plus className="h-4 w-4" />
              Start a project
            </Button>
          </Link>
        </div>

        {/* Controls */}
        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects…"
              className="w-full rounded-xl border border-input bg-card py-3 pl-10 pr-4 text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-2 text-sm">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <label htmlFor="sort" className="sr-only">Sort projects</label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-input bg-card px-3 py-2.5 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {Object.entries(SORTS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                filter === f
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
          ) : visible.length > 0 ? (
            visible.map((project) => <ProjectCard key={project.id} project={project} />)
          ) : (
            <EmptyState
              title={query || filter !== "All" ? "No matching projects" : "No projects yet"}
              description={
                query || filter !== "All"
                  ? "Try a different search or filter."
                  : "Be the first to launch a climate project on TerraLend."
              }
              actionLabel={isConnected ? "Start a project" : undefined}
              actionHref="/create"
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
