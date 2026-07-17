"use client";
import { useTerraLend } from "@/context/TerraLendContext";
import TxLoader from "./TxLoader";

/** Bridges the context's txPending state into the global transaction overlay. */
export default function GlobalTxLoader() {
  const { txPending } = useTerraLend();
  return <TxLoader pending={txPending} />;
}
