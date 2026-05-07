import { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { CONTRACT_ADDRESS, SOLANA_RPC, TOKEN } from "@/lib/config";

/**
 * Get total $404 balance (across all token accounts) for an owner.
 * Returns whole-token amount (already divided by decimals).
 */
export async function getTokenBalance(owner: string): Promise<number> {
  if (!CONTRACT_ADDRESS || !owner) return 0;

  const connection = new Connection(SOLANA_RPC, "confirmed");
  const ownerPk = new PublicKey(owner);
  const mintPk = new PublicKey(CONTRACT_ADDRESS);

  const accounts = await connection.getParsedTokenAccountsByOwner(ownerPk, {
    programId: TOKEN_PROGRAM_ID,
  });

  let total = 0;
  for (const { account } of accounts.value) {
    const info = account.data.parsed?.info;
    if (info?.mint === mintPk.toBase58()) {
      const ui = Number(info.tokenAmount?.uiAmount ?? 0);
      total += ui;
    }
  }
  return total;
}

export function rawToUi(raw: number) {
  return raw / 10 ** TOKEN.decimals;
}
