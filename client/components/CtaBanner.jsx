import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CtaBanner() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
      <div className="aurora relative overflow-hidden rounded-3xl border border-border bg-card p-10 text-center md:p-16">
        <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Have a project that heals the planet?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Launch a grant or a green loan in minutes. Reach a global community of
          backers who want their capital to do good.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/create">
            <Button size="lg">
              Start a project
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/projects">
            <Button size="lg" variant="outline">
              Browse projects
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
