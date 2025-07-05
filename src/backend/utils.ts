/**CONSTANTS */

import { Principal } from "azle";

const BITCOIN_TESTNET_MANAGER_CANISTER_ID = Principal.fromText(
  "g4xu7-jiaaa-aaaan-aaaaq-cai"
);
const BITCOIN_API_CYCLE_COST = 100_000_000n;
const BITCOIN_BASE_TRANSACTION_COST = 5_000_000_000n;
const BITCOIN_CYCLE_COST_PER_TRANSACTION_BYTE = 20_000_000n;
const NODE_INDEX_CANISTER_ICPSWAP = "ggzvv-5qaaa-aaaag-qck7a-cai";
const POOL_STORAGE_CANISTER = "xmiu5-jqaaa-aaaag-qbz7q-cai";

/*HELPERS */

function getCkBtcPrincipal(): string {
  // Testnet ckBTC ledger
  return "mxzaz-hqaaa-aaaar-qaada-cai";
}
function getMinterPrincipal(): string {
  // Testnet ckBTC minter
  return "m7sm4-2iaaa-aaaab-qabra-cai";
}

export {
  BITCOIN_TESTNET_MANAGER_CANISTER_ID,
  BITCOIN_API_CYCLE_COST,
  BITCOIN_BASE_TRANSACTION_COST,
  BITCOIN_CYCLE_COST_PER_TRANSACTION_BYTE,
  NODE_INDEX_CANISTER_ICPSWAP,
  POOL_STORAGE_CANISTER,
  getCkBtcPrincipal,
  getMinterPrincipal,
};
