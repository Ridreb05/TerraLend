"use client";
import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTerraLend } from "@/context/TerraLendContext";

const STATS = [
  { label: "On-chain & transparent", Icon: ShieldCheck },
  { label: "Grants & green loans", Icon: Leaf },
  { label: "Returns to backers", Icon: TrendingUp },
];

export default function Hero() {
  const { projects } = useTerraLend();
  const total = projects.length;

  return (
    <section className="aurora relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-leaf-500" />
            Decentralized crowdlending on Linea
          </span>

          <h1 className="animate-fade-up mt-6 text-balance font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-6xl">
            Fund the projects{" "}
            <span className="gradient-text">regenerating our planet</span>
          </h1>

          <p className="animate-fade-up mt-6 text-balance text-lg text-muted-foreground md:text-xl">
            TerraLend connects climate builders with backers worldwide. Support
            impact projects as a grant, or lend capital as a green loan and earn
            your returns — all settled transparently on-chain.
          </p>

          <div className="animate-fade-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/projects">
              <Button size="lg">
                Explore projects
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/create">
              <Button size="lg" variant="outline">
                Start a project
              </Button>
            </Link>
          </div>

          <div className="animate-fade-in mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {STATS.map(({ label, Icon }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="h-4 w-4 text-primary" />
                {label}
              </div>
            ))}
          </div>

          {total > 0 && (
            <p className="mt-8 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{total}</span>{" "}
              live {total === 1 ? "project" : "projects"} raising funds right now
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
