"use client";
import { Loader2 } from "lucide-react";

/** Full-screen overlay shown while a wallet transaction is pending confirmation. */
export default function TxLoader({ pending }) {
  if (!pending) return null;
  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="mx-4 flex max-w-sm flex-col items-center rounded-2xl border border-border bg-card p-8 text-center shadow-2xl">
        <div className="relative mb-5 flex h-20 w-20 items-center justify-center">
          <span className="absolute inset-0 rounded-full border-4 border-secondary" />
          <Loader2 className="h-20 w-20 animate-spin text-primary" strokeWidth={2} />
        </div>
        <h2 className="font-display text-lg font-semibold text-foreground">
          Confirm in your wallet
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Approve the request in MetaMask and wait for the transaction to be
          mined on Linea Sepolia.
        </p>
      </div>
    </div>
  );
}
