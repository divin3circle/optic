import { Actor, toHex } from "@dfinity/agent";
import { fromHexString } from "@dfinity/candid";
import { AccountIdentifier, idlFactory } from "@dfinity/ledger-icp";
import { Principal } from "@dfinity/principal";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAgent } from "@nfid/identitykit/react";

// TypeScript declarations for Plug wallet
declare global {
  interface Window {
    ic?: {
      plug?: {
        requestConnect: () => Promise<string>;
        requestTransfer: (params: {
          to: string;
          amount: number;
          memo: string;
        }) => Promise<{ height: number }>;
      };
    };
  }
}

export function useContribute(amount: number) {
  const agent = useAgent();
  if (!agent) {
    toast.error("Please connect your wallet");
  }
  return useMutation({
    mutationFn: async () => requestTransfer(amount, agent),
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

  const actor = Actor.createActor(idlFactory as any, {
    agent,
    canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
  });
  const address = AccountIdentifier.fromPrincipal({
    principal: Principal.fromText("2wdkf-viaaa-aaaam-ackqq-cai"),
  }).toHex();

  const transferArgs = {
    to: fromHexString(address),
    fee: { e8s: BigInt(10000) },
    memo: BigInt(0),
    from_subaccount: [],
    created_at_time: [],
    amount: { e8s: BigInt(100000000) },
  };
  const response = await actor.transfer(transferArgs);

  console.log(response);
  return true;
}

export async function sendICP(es8s: number) {
  // connect to plug wallet
  (async () => {
    try {
      const publicKey = await window.ic?.plug?.requestConnect();
      console.log(`The connected user's public key is:`, publicKey);
    } catch (e) {
      console.log(e);
    }
  })();

  (async () => {
    const params = {
      to: "4ppas-bcjk7-pvvzg-uy6xp-7cblq-56to3-gryyo-7sjbq-5anil-7uufn-3ae",
      amount: 2_000_000,
      memo: "123451231231",
    };
    const result = await window.ic?.plug?.requestTransfer(params);
    console.log(result); // { height: number }
  })();
}
