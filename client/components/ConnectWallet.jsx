"use client";
import { Wallet } from "lucide-react";
import { useTerraLend } from "@/context/TerraLendContext";
import { Button } from "@/components/ui/button";

export default function ConnectWallet({ size = "md", className = "" }) {
  const { connectWallet } = useTerraLend();
  return (
    <Button onClick={connectWallet} size={size} className={className}>
      <Wallet className="h-4 w-4" />
      Connect Wallet
    </Button>
  );
}
