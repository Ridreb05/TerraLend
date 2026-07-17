"use client";

import { useState } from "react";
import { HandCoins } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTerraLend } from "@/context/TerraLendContext";
import { formatEth } from "@/lib/format";

export default function FundProjectDialog({ projectId, title, remaining, onFunded }) {
  const { fundProject, txPending } = useTerraLend();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [agreed, setAgreed] = useState(false);

  const numeric = parseFloat(amount);
  const exceeds = numeric > parseFloat(remaining);
  const invalid = !amount || numeric <= 0 || exceeds || !agreed;

  const handleFund = async () => {
    if (invalid) return;
    const ok = await fundProject(projectId, amount);
    if (ok) {
      setOpen(false);
      setAmount("");
      setAgreed(false);
      onFunded?.();
    }
  };

  const quickAmounts = [0.01, 0.05, 0.1].filter((a) => a <= parseFloat(remaining));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full">
          <HandCoins className="h-4 w-4" />
          Back this project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Back “{title}”</DialogTitle>
          <DialogDescription>
            Contributions are final and settled on-chain. {formatEth(remaining)} ETH
            still needed to reach the goal.
          </DialogDescription>
        </DialogHeader>

        <div>
          <label htmlFor="fund-amount" className="mb-1.5 block text-sm font-medium text-foreground">
            Amount (ETH)
          </label>
          <input
            id="fund-amount"
            type="number"
            min="0"
            step="any"
            value={amount}
            disabled={txPending}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {quickAmounts.length > 0 && (
            <div className="mt-2 flex gap-2">
              {quickAmounts.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAmount(String(a))}
                  className="rounded-lg border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
                >
                  {a} ETH
                </button>
              ))}
            </div>
          )}
          {exceeds && (
            <p className="mt-2 text-sm text-destructive">
              Amount exceeds the {formatEth(remaining)} ETH still needed.
            </p>
          )}
        </div>

        <label className="flex items-start gap-2.5 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-input accent-[hsl(var(--primary))]"
          />
          I understand contributions are non-refundable and settled on-chain.
        </label>

        <Button onClick={handleFund} disabled={invalid || txPending} className="w-full">
          {txPending ? "Processing…" : "Confirm contribution"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
