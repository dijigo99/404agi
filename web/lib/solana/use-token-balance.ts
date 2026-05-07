"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { CONTRACT_ADDRESS, tierFor } from "@/lib/config";
import { getTokenBalance } from "./balance";

type State = {
  balance: number;
  tier: ReturnType<typeof tierFor>;
  loading: boolean;
  error: string | null;
};

export function useTokenBalance() {
  const { publicKey, connected } = useWallet();
  const [state, setState] = useState<State>({
    balance: 0,
    tier: "locked",
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!connected || !publicKey || !CONTRACT_ADDRESS) {
      setState({ balance: 0, tier: "locked", loading: false, error: null });
      return;
    }

    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));

    getTokenBalance(publicKey.toBase58())
      .then((balance) => {
        if (cancelled) return;
        setState({
          balance,
          tier: tierFor(balance),
          loading: false,
          error: null,
        });
      })
      .catch((err) => {
        if (cancelled) return;
        setState({
          balance: 0,
          tier: "locked",
          loading: false,
          error: err?.message ?? "Failed to fetch balance",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [connected, publicKey]);

  return state;
}
