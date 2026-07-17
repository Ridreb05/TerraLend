"use client";
import Link from "next/link";
import { CalendarClock, Target } from "lucide-react";
import Badge from "@/components/ui/badge";
import ProgressBar from "@/components/ui/progress-bar";
import { FUNDING_MODEL } from "@/lib/config";
import { shortenAddress, formatEth, fundingPercent, truncateWords } from "@/lib/format";
import { formatUnixDate, isExpired, daysLeft } from "@/utils/date";

export default function ProjectCard({ project }) {
  const {
    id,
    title,
    summary,
    target,
    amountRaised,
    deadlineUnix,
    model,
    steward,
    isRepaid,
    isWithdrawn,
  } = project;

  const percent = fundingPercent(amountRaised, target);
  const expired = isExpired(deadlineUnix);
  const remaining = daysLeft(deadlineUnix);
  const isLoan = model === FUNDING_MODEL.GREEN_LOAN;

  return (
    <Link
      href={`/projects/${id}`}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <Badge variant={isLoan ? "loan" : "grant"}>{model}</Badge>
        {isRepaid ? (
          <Badge variant="success">Repaid</Badge>
        ) : isWithdrawn ? (
          <Badge variant="neutral">Withdrawn</Badge>
        ) : expired ? (
          <span className="text-xs font-medium text-muted-foreground">Closed</span>
        ) : (
          <span className="text-xs font-medium text-muted-foreground">
            {remaining}d left
          </span>
        )}
      </div>

      <h3 className="font-display text-lg font-semibold leading-tight text-foreground transition group-hover:text-primary">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {truncateWords(summary, 22)}
      </p>

      <div className="mt-5">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-sm font-semibold text-foreground">
            {formatEth(amountRaised)} ETH
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            {percent}% of {formatEth(target)}
          </span>
        </div>
        <ProgressBar value={percent} />
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Target className="h-3.5 w-3.5" />
          {formatEth(target)} ETH goal
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CalendarClock className="h-3.5 w-3.5" />
          {formatUnixDate(deadlineUnix)}
        </span>
      </div>

      <p className="mt-3 truncate font-mono text-[11px] text-muted-foreground/80">
        by {shortenAddress(steward, 6)}
      </p>
    </Link>
  );
}
