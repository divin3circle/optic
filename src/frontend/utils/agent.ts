import { createAgent } from "@dfinity/utils";
import { LedgerCanister } from "@dfinity/ledger-icp";
import { AnonymousIdentity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

const identity = new AnonymousIdentity();

const agent = await createAgent({
  identity,
  host: "https://ic0.app",
});

export default agent;
