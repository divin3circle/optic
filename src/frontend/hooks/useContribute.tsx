import { Actor } from "@dfinity/agent";
import { fromHexString } from "@dfinity/candid";
import { AccountIdentifier, LedgerCanister } from "@dfinity/ledger-icp";
import { Principal } from "@dfinity/principal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAgent } from "@nfid/identitykit/react";
import { ledgerFactory } from "../utils/ledgerFactory";

export function useContribute(amount: number) {
  const agent = useAgent();
  return useMutation({
    mutationFn: (amount: number) => requestTransfer(amount, agent),
    onSuccess: () => {
      toast.success("Contribution successful");
    },
    onError: () => {
      toast.error("Contribution failed");
    },
  });
}

export async function requestTransfer(
  amount: number,
  agent: any
): Promise<boolean> {
  console.log("requestTransfer");

  const actor = Actor.createActor(ledgerFactory, {
    agent,
    canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
  });

  const destinationPrincipal =
    "4ppas-bcjk7-pvvzg-uy6xp-7cblq-56to3-gryyo-7sjbq-5anil-7uufn-3ae";
  const toAccount = AccountIdentifier.fromPrincipal({
    principal: Principal.fromText(destinationPrincipal),
  });

  const transferArgs = {
    to: Array.from(toAccount.toUint8Array()),
    fee: { e8s: BigInt(10000) },
    memo: BigInt(0),
    from_subaccount: [],
    created_at_time: [],
    amount: { e8s: BigInt(amount) },
  };
  const response = await actor.transfer(transferArgs);

  console.log(response);
  return true;
}
