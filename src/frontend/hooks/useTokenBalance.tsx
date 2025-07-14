import { Principal } from "@dfinity/principal";
import { useAuth } from "@nfid/identitykit/react";
import agent from "../utils/agent.js";
import { IcrcLedgerCanister } from "@dfinity/ledger";
import { useEffect, useState } from "react";

export default function useTokenBalance(ledgerId: string) {
  const { user } = useAuth();
  const { metadata, balance } = IcrcLedgerCanister.create({
    agent,
    canisterId: Principal.fromText(ledgerId),
  });
  const [balanceData, setBalanceData] = useState<bigint>(0n);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      console.log("User not found");
      return;
    }
    const fetchBalance = async () => {
      setLoading(true);
      const data = await metadata({
        certified: true,
      });
      const balanceData = await balance({
        certified: true,
        owner: Principal.fromText(user.principal.toString()),
      });
      setBalanceData(balanceData);
      setLoading(false);
    };
    fetchBalance();
  }, [user]);

  return { balanceData, loading };
}

export function formatDecimals(balance: bigint, tokenName: string): number {
  switch (tokenName) {
    case "ckBTC":
      return Number(balance / 10n ** 8n);
    case "ckETH":
      return Number(balance / 10n ** 18n);
    case "ckUSDC":
      return Number(balance / 10n ** 6n);
    case "ckLINK":
      return Number(balance / 10n ** 8n);
    case "ICS":
      return Number(balance / 10n ** 8n);
    case "ICP":
      return Number(balance / 10n ** 8n);
    default:
      return 0;
  }
}
