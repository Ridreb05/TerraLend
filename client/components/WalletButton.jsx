"use client";
import { useTerraLend } from "@/context/TerraLendContext";
import ConnectWallet from "./ConnectWallet";
import WalletInfo from "./WalletInfo";

/** Shows a Connect button, or wallet details once connected. */
export default function WalletButton() {
  const { isConnected } = useTerraLend();
  return isConnected ? <WalletInfo /> : <ConnectWallet />;
}
