"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";
import { shortAddress } from "@/lib/utils";
import { Wallet as WalletIcon, LogOut } from "lucide-react";
import { useCallback } from "react";

export function WalletButton({
  size = "default",
  className,
}: {
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  const { publicKey, disconnect, connecting, connected } = useWallet();
  const { setVisible } = useWalletModal();

  const onClick = useCallback(() => {
    if (connected) {
      void disconnect();
    } else {
      setVisible(true);
    }
  }, [connected, disconnect, setVisible]);

  const label = connecting
    ? "CONNECTING..."
    : connected && publicKey
    ? shortAddress(publicKey.toBase58())
    : "CONNECT WALLET";

  return (
    <Button
      onClick={onClick}
      variant={connected ? "outline" : "default"}
      size={size}
      className={className}
      aria-label={connected ? "Disconnect wallet" : "Connect wallet"}
    >
      {connected ? (
        <LogOut className="h-4 w-4" aria-hidden />
      ) : (
        <WalletIcon className="h-4 w-4" aria-hidden />
      )}
      {label}
    </Button>
  );
}
