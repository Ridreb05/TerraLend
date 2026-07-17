"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, HandCoins, Info, Wallet } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConnectWallet from "@/components/ConnectWallet";
import { Button } from "@/components/ui/button";
import { useTerraLend } from "@/context/TerraLendContext";
import { FUNDING_MODEL } from "@/lib/config";
import { todayInputValue } from "@/utils/date";

const EMPTY = {
  title: "",
  summary: "",
  target: "",
  repaymentAmount: "",
  deadline: "",
  model: FUNDING_MODEL.GRANT,
  agreed: false,
};

export default function CreateProjectPage() {
  const router = useRouter();
  const { account, isConnected, createProject, txPending } = useTerraLend();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const isLoan = form.model === FUNDING_MODEL.GREEN_LOAN;

  const update = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (form.title.trim().length < 8) e.title = "Title must be at least 8 characters.";
    if (form.summary.trim().length < 40) e.summary = "Summary must be at least 40 characters.";
    if (!(parseFloat(form.target) > 0)) e.target = "Enter a funding target greater than 0.";
    if (isLoan) {
      const t = parseFloat(form.target) || 0;
      const r = parseFloat(form.repaymentAmount) || 0;
      if (r <= t) e.repaymentAmount = "Repayment must be greater than the target.";
    }
    if (!form.deadline) e.deadline = "Choose a deadline.";
    else if (new Date(form.deadline) <= new Date()) e.deadline = "Deadline must be in the future.";
    if (isLoan && !form.agreed) e.agreed = "You must accept the repayment commitment.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const ok = await createProject({
      title: form.title.trim(),
      summary: form.summary.trim(),
      target: form.target,
      repaymentAmount: form.repaymentAmount || "0",
      deadline: form.deadline,
      model: form.model,
    });
    if (ok) router.push("/projects");
  };

  const inputCls = (field) =>
    `w-full rounded-xl border bg-background px-4 py-3 text-foreground shadow-sm transition focus:outline-none focus:ring-2 focus:ring-ring ${
      errors[field] ? "border-destructive" : "border-input focus:border-primary"
    }`;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 md:px-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Start a project
          </h1>
          <p className="mt-2 text-muted-foreground">
            Raise funds as a non-repayable grant or a repayable green loan.
          </p>
        </div>

        {!isConnected ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-leaf-100 text-leaf-700 dark:bg-leaf-500/15 dark:text-leaf-300">
              <Wallet className="h-6 w-6" />
            </span>
            <h2 className="font-display text-lg font-semibold text-foreground">
              Connect your wallet to continue
            </h2>
            <p className="mb-6 mt-2 max-w-sm text-sm text-muted-foreground">
              You&apos;ll need a wallet on Linea Sepolia to publish a project.
              Funds can only be withdrawn to the connected address.
            </p>
            <ConnectWallet size="lg" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border bg-card p-6 md:p-8">
            {/* Funding model selector */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Funding model</label>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { model: FUNDING_MODEL.GRANT, Icon: Leaf, desc: "Non-repayable. Backers support your impact with no returns expected." },
                  { model: FUNDING_MODEL.GREEN_LOAN, Icon: HandCoins, desc: "Repayable. You commit to repay backers pro-rata, with a return." },
                ].map(({ model, Icon, desc }) => (
                  <button
                    key={model}
                    type="button"
                    onClick={() => update("model", model)}
                    className={`rounded-xl border p-4 text-left transition ${
                      form.model === model
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <Icon className="h-5 w-5 text-primary" />
                    <p className="mt-2 font-semibold text-foreground">{model}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <Field label="Project title" error={errors.title}>
              <input
                type="text"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="e.g. Community Solar Microgrid for Rural Kenya"
                className={inputCls("title")}
              />
            </Field>

            <Field label="Summary" error={errors.summary}>
              <textarea
                rows={5}
                value={form.summary}
                onChange={(e) => update("summary", e.target.value)}
                placeholder="Describe the project, its impact, milestones, and who benefits."
                className={inputCls("summary")}
              />
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Info className="h-3.5 w-3.5" />
                Tip: mention measurable outcomes and links that build trust.
              </p>
            </Field>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Funding target (ETH)" error={errors.target}>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={form.target}
                  onChange={(e) => update("target", e.target.value)}
                  placeholder="10"
                  className={inputCls("target")}
                />
              </Field>

              <Field label="Deadline" error={errors.deadline}>
                <input
                  type="date"
                  min={todayInputValue()}
                  value={form.deadline}
                  onChange={(e) => update("deadline", e.target.value)}
                  className={inputCls("deadline")}
                />
              </Field>
            </div>

            {isLoan && (
              <Field label="Total repayment to backers (ETH)" error={errors.repaymentAmount}>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={form.repaymentAmount}
                  onChange={(e) => update("repaymentAmount", e.target.value)}
                  placeholder="12"
                  className={inputCls("repaymentAmount")}
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Distributed pro-rata to backers when you repay. Must exceed the target.
                </p>
              </Field>
            )}

            {isLoan && (
              <label className="flex items-start gap-2.5 rounded-xl border border-border bg-secondary/50 p-4 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={form.agreed}
                  onChange={(e) => update("agreed", e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-input accent-[hsl(var(--primary))]"
                />
                <span>
                  I commit to repay the borrowed amount in full by the deadline and
                  to use the funds solely for this project&apos;s stated purpose.
                  {errors.agreed && (
                    <span className="mt-1 block text-destructive">{errors.agreed}</span>
                  )}
                </span>
              </label>
            )}

            <Button type="submit" size="lg" disabled={txPending} className="w-full">
              {txPending ? "Publishing…" : "Publish project"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Publishing from{" "}
              <span className="font-mono font-medium text-foreground">{account}</span>.
              Only this address can withdraw the raised funds.
            </p>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-sm text-destructive">{error}</p>}
    </div>
  );
}
