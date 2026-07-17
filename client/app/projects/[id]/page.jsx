"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarClock,
  Users,
  Target,
  CheckCircle2,
  AlertTriangle,
  Download,
  RefreshCw,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Badge from "@/components/ui/badge";
import ProgressBar from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";
import ConnectWallet from "@/components/ConnectWallet";
import FundProjectDialog from "@/components/FundProjectDialog";
import { useTerraLend } from "@/context/TerraLendContext";
import { FUNDING_MODEL } from "@/lib/config";
import { shortenAddress, formatEth, fundingPercent } from "@/lib/format";
import { formatUnixDate, isExpired, daysLeft } from "@/utils/date";

export default function ProjectDetailPage({ params }) {
  const {
    account,
    isConnected,
    getProjectById,
    getBackers,
    withdrawFunds,
    repayLoan,
  } = useTerraLend();

  const [project, setProject] = useState(null);
  const [backers, setBackers] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  const load = useCallback(async () => {
    try {
      setStatus("loading");
      const [data, backerList] = await Promise.all([
        getProjectById(params.id),
        getBackers(params.id),
      ]);
      setProject(data);
      setBackers(backerList);
      setStatus("ready");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }, [params.id, getProjectById, getBackers]);

  useEffect(() => {
    load();
  }, [load]);

  if (status === "loading") return <DetailShell><DetailSkeleton /></DetailShell>;

  if (status === "error" || !project)
    return (
      <DetailShell>
        <div className="flex flex-col items-center py-24 text-center">
          <AlertTriangle className="h-10 w-10 text-destructive" />
          <h2 className="mt-4 font-display text-xl font-semibold text-foreground">
            Project not found
          </h2>
          <p className="mt-2 text-muted-foreground">
            We couldn&apos;t load this project. It may not exist.
          </p>
          <Link href="/projects" className="mt-6">
            <Button variant="outline">Back to projects</Button>
          </Link>
        </div>
      </DetailShell>
    );

  const percent = fundingPercent(project.amountRaised, project.target);
  const remaining = Math.max(
    parseFloat(project.target) - parseFloat(project.amountRaised),
    0
  ).toString();
  const fullyFunded = percent >= 100;
  const deadlinePassed = isExpired(project.deadlineUnix);
  const isOwner = account?.toLowerCase() === project.steward.toLowerCase();
  const isLoan = project.model === FUNDING_MODEL.GREEN_LOAN;

  const canWithdraw = isOwner && !project.isWithdrawn && (fullyFunded || deadlinePassed);
  const canRepay = isOwner && isLoan && fullyFunded && !project.isRepaid;
  const canFund = isConnected && !isOwner && !fullyFunded && !deadlinePassed;

  const handleWithdraw = async () => {
    if (await withdrawFunds(project.id)) load();
  };
  const handleRepay = async () => {
    if (await repayLoan(project.id, project.repaymentAmount)) load();
  };

  return (
    <DetailShell>
      <Link
        href="/projects"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All projects
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main column */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant={isLoan ? "loan" : "grant"}>{project.model}</Badge>
            {project.isRepaid && <Badge variant="success">Repaid</Badge>}
            {project.isWithdrawn && <Badge variant="neutral">Funds withdrawn</Badge>}
            {deadlinePassed && !fullyFunded && (
              <span className="text-xs font-medium text-muted-foreground">Deadline passed</span>
            )}
          </div>

          <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
            {project.title}
          </h1>

          <p className="mt-3 font-mono text-sm text-muted-foreground">
            by {shortenAddress(project.steward, 8)}
            {isOwner && <span className="ml-2 text-primary">(you)</span>}
          </p>

          <div className="mt-6 whitespace-pre-line text-[15px] leading-relaxed text-foreground/90">
            {project.summary}
          </div>

          {/* Loan repayment info */}
          {isLoan && (
            <div className="mt-6 rounded-xl border border-leaf-500/25 bg-leaf-500/5 p-4">
              <p className="text-sm font-semibold text-foreground">Green loan terms</p>
              <p className="mt-1 text-sm text-muted-foreground">
                The steward commits to repay a total of{" "}
                <span className="font-semibold text-foreground">
                  {formatEth(project.repaymentAmount)} ETH
                </span>
                , distributed to backers in proportion to their contribution.
              </p>
            </div>
          )}

          {/* Backers */}
          <div className="mt-8">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
              <Users className="h-5 w-5 text-primary" />
              Backers
              <span className="text-sm font-normal text-muted-foreground">
                ({backers.length})
              </span>
            </h2>
            <div className="mt-3 overflow-hidden rounded-xl border border-border">
              {backers.length > 0 ? (
                <ul className="divide-y divide-border">
                  {backers.map((b, i) => (
                    <li
                      key={`${b.address}-${i}`}
                      className="flex items-center justify-between px-4 py-3 text-sm"
                    >
                      <span className="font-mono text-muted-foreground">
                        {shortenAddress(b.address, 6)}
                      </span>
                      <span className="font-semibold text-foreground">
                        {formatEth(b.amount)} ETH
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No backers yet — be the first to support this project.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-baseline justify-between">
              <span className="font-display text-2xl font-bold text-foreground">
                {formatEth(project.amountRaised)} ETH
              </span>
              <span className="text-sm text-muted-foreground">of {formatEth(project.target)}</span>
            </div>
            <ProgressBar value={percent} className="mt-3 h-3" />
            <p className="mt-2 text-sm font-medium text-primary">{percent}% funded</p>

            <dl className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
              <Row Icon={Target} label="Remaining" value={`${formatEth(remaining)} ETH`} />
              <Row Icon={CalendarClock} label="Deadline" value={formatUnixDate(project.deadlineUnix)} />
              <Row
                Icon={CalendarClock}
                label="Time left"
                value={deadlinePassed ? "Ended" : `${daysLeft(project.deadlineUnix)} days`}
              />
            </dl>

            {/* Actions */}
            <div className="mt-6 space-y-3">
              {canFund && (
                <FundProjectDialog
                  projectId={project.id}
                  title={project.title}
                  remaining={remaining}
                  onFunded={load}
                />
              )}

              {!isConnected && !isOwner && !fullyFunded && !deadlinePassed && (
                <ConnectWallet size="lg" className="w-full" />
              )}

              {canWithdraw && (
                <Button onClick={handleWithdraw} size="lg" className="w-full">
                  <Download className="h-4 w-4" />
                  Withdraw funds
                </Button>
              )}

              {canRepay && (
                <Button onClick={handleRepay} size="lg" variant="solid" className="w-full">
                  <RefreshCw className="h-4 w-4" />
                  Repay {formatEth(project.repaymentAmount)} ETH
                </Button>
              )}

              {fullyFunded && !canFund && !canWithdraw && !canRepay && (
                <div className="flex items-center gap-2 rounded-xl bg-leaf-500/10 p-3 text-sm text-leaf-700 dark:text-leaf-300">
                  <CheckCircle2 className="h-4 w-4" />
                  This project reached its goal.
                </div>
              )}

              {isOwner && !fullyFunded && !deadlinePassed && (
                <p className="text-center text-xs text-muted-foreground">
                  You can withdraw once funded, or after the deadline.
                </p>
              )}
            </div>
          </div>

          <p className="mt-4 px-1 text-xs leading-relaxed text-muted-foreground">
            TerraLend settles all contributions on-chain. Green-loan repayments
            are the steward&apos;s commitment; review each project carefully and
            back at your own discretion.
          </p>
        </aside>
      </div>
    </DetailShell>
  );
}

function DetailShell({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 md:px-8">{children}</main>
      <Footer />
    </div>
  );
}

function Row({ Icon, label, value }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="grid animate-pulse gap-8 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <div className="h-6 w-24 rounded bg-secondary" />
        <div className="h-10 w-3/4 rounded bg-secondary" />
        <div className="h-4 w-40 rounded bg-secondary" />
        <div className="mt-4 space-y-2">
          <div className="h-3 w-full rounded bg-secondary" />
          <div className="h-3 w-full rounded bg-secondary" />
          <div className="h-3 w-2/3 rounded bg-secondary" />
        </div>
      </div>
      <div className="h-72 rounded-2xl bg-secondary lg:col-span-1" />
    </div>
  );
}
