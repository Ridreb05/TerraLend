"use client";
import { LogOut } from "lucide-react";
import { useTerraLend } from "@/context/TerraLendContext";
import { shortenAddress, formatEth } from "@/lib/format";

export default function WalletInfo() {
  const { account, balance, disconnectWallet } = useTerraLend();
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-2 py-1.5 shadow-sm">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-leaf-gradient text-xs font-bold text-white">
        {account?.slice(2, 4).toUpperCase()}
      </span>
      <div className="leading-tight">
        <p className="font-mono text-xs font-semibold text-foreground">
          {shortenAddress(account)}
        </p>
        <p className="text-[11px] text-muted-foreground">{formatEth(balance)} ETH</p>
      </div>
      <button
        onClick={disconnectWallet}
        aria-label="Disconnect wallet"
        className="ml-1 rounded-lg p-1.5 text-muted-foreground transition hover:bg-accent hover:text-foreground"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}
