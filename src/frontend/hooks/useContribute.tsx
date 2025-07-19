import { Actor } from "@dfinity/agent";
import { fromHexString } from "@dfinity/candid";
import { AccountIdentifier, idlFactory } from "@dfinity/ledger-icp";
import { Principal } from "@dfinity/principal";
import { useAgent } from "@nfid/identitykit/react";
import { useQuery } from "@tanstack/react-query";

export function useContribute(amount: number) {}

async function requestTransfer(amount: number): Promise<boolean> {
  const agent = useAgent();

  // you'll need to import the idlFactory for ICP (or any other ledger canister)
  // and specify which canister you're calling, in this case the ICP ledger.
  // note: it would be very helpful to have a common 'ICRCledgerFactory'
  // so individual ledger canister idl's don't need to be imported.
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
  });

  const destinationPrincipal = SOME_DESTINATION_PRINCIPAL;
  const address = AccountIdentifier.fromPrincipal({
    principal: Principal.fromText(destinationPrincipal),
  }).toHex();

  const transferArgs = {
    to: fromHexString(address),
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
