import { LedgerCanister } from "@dfinity/ledger-icp";
import { Principal } from "@dfinity/principal";
import { AccountIdentifier } from "@dfinity/ledger-icp";
import agent from "../utils/agent.js";
import { useAuth } from "@nfid/identitykit/react";
import { useState, useEffect } from "react";

const ICP_LEDGER_CANISTER_ID = "ryjl3-tyaaa-aaaaa-aaaba-cai";

export default function useICPBalance() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<bigint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { accountBalance } = LedgerCanister.create({
    agent,
    canisterId: Principal.fromText(ICP_LEDGER_CANISTER_ID),
  });

  useEffect(() => {
    const fetchBalance = async () => {
      if (!user?.principal) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const balanceResult = await accountBalance({
          accountIdentifier: AccountIdentifier.fromPrincipal({
            principal: Principal.fromText(user.principal.toString()),
            subAccount: undefined,
          }),
        });

        setBalance(balanceResult);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch balance"
        );
        console.error("Error fetching ICP balance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [user?.principal, accountBalance]);

  return { balance, loading, error };
}
