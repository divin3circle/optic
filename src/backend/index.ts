import { call, IDL, init, Principal, query, update, msgCaller } from "azle";
import * as bitcoin from "bitcoinjs-lib";
import { Network, networks, Transaction } from "bitcoinjs-lib";
import { Buffer } from "buffer";
import {
  bitcoin_get_balance_args,
  bitcoin_get_balance_result,
  bitcoin_get_current_fee_percentiles_args,
  bitcoin_get_current_fee_percentiles_result,
  bitcoin_get_utxos_args,
  bitcoin_get_utxos_result,
  bitcoin_send_transaction_args,
  ecdsa_public_key_args,
  ecdsa_public_key_result,
  bitcoin_network,
  bitcoin_address,
  satoshi,
} from "azle/canisters/management/idl";

/**CONSTANTS */

const BITCOIN_TESTNET_MANAGER_CANISTER_ID = Principal.fromText(
  "g4xu7-jiaaa-aaaan-aaaaq-cai"
);
const BITCOIN_API_CYCLE_COST = 100_000_000n;
const BITCOIN_BASE_TRANSACTION_COST = 5_000_000_000n;
const BITCOIN_CYCLE_COST_PER_TRANSACTION_BYTE = 20_000_000n;

/**TYPES & IDLs */

const Position = IDL.Record({
  poolId: IDL.Text,
  amount: IDL.Float64,
  aprAtDeposit: IDL.Float32,
  timestamp: IDL.Int,
  lastRebalance: IDL.Int,
});

type Position = {
  poolId: string;
  amount: number;
  aprAtDeposit: number;
  timestamp: number;
  lastRebalance: number;
};

const OracleFeed = IDL.Record({
  poolId: IDL.Text,
  apr: IDL.Float32,
  updatedAt: IDL.Int,
});

type OracleFeed = {
  poolId: string;
  apr: number;
  updatedAt: number;
};

const Proposal = IDL.Record({
  id: IDL.Text,
  proposer: IDL.Principal,
  params: IDL.Record({
    rebalanceThreshold: IDL.Float32,
    feeRateBps: IDL.Float32,
    minStake: IDL.Float32,
    votingPeriodSec: IDL.Int32,
    quorumBps: IDL.Nat64,
  }),
  votes: IDL.Float32,
});

type Proposal = {
  id: string;
  proposer: Principal;
  params: {
    rebalanceThreshold: number;
    feeRateBps: number;
    minStake: number;
    votingPeriodSec: number;
    quorumBps: number;
  };
  votes: number;
};

const Balances = IDL.Record({
  ckBTC: IDL.Float32,
  BTC: IDL.Float32,
  ICP: IDL.Float32,
  updatedAt: IDL.Int,
});

type Balances = {
  ckBTC: number;
  BTC: number;
  ICP: number;
  updatedAt: number;
};

const Bridge = IDL.Record({
  address: IDL.Text,
  utxosAddress: IDL.Text,
  btcAmount: IDL.Float32,
  ckBTCAmount: IDL.Float32,
  timestamp: IDL.Int,
});

type Bridge = {
  address: string;
  utxosAddress: string;
  btcAmount: number;
  ckBTCAmount: number;
  timestamp: number;
};

/**CANISTER CLASSES */

export default class {
  /**
   * Maps of the canister's state.
   */

  deposits: Map<Principal, string> = new Map();
  positions: Map<Principal, Position[]> = new Map();
  feeds: Map<string, OracleFeed> = new Map();
  stakes: Map<Principal, number> = new Map();
  proposal: Map<string, Proposal> = new Map();
  balances: Map<string, Balances> = new Map();
  bridges: Map<Principal, Bridge[]> = new Map();

  /**
   * Get caller's principal.
   * @returns The caller's principal.
   */

  @query([], IDL.Principal)
  async getCaller(): Promise<Principal> {
    return msgCaller();
  }

  /**
   * Get the balance of a Bitcoin address.
   * @param address - The Bitcoin address to get the balance of.
   * @returns The balance of the Bitcoin address.
   */

  @update([IDL.Text], bitcoin_get_balance_result)
  async getBalance(address: string): Promise<bitcoin_get_balance_result> {
    return await call<[bitcoin_get_balance_args], bitcoin_get_balance_result>(
      "aaaaa-aa",
      "bitcoin_get_balance",
      {
        paramIdlTypes: [bitcoin_get_balance_args],
        returnIdlType: bitcoin_get_balance_result,
        args: [
          {
            address,
            min_confirmations: [],
            network: { regtest: null },
          },
        ],
        cycles: BITCOIN_API_CYCLE_COST,
      }
    );
  }

  /**
   * Create a deposit address for a user.
   * @returns The Bitcoin address of the user.
   */

  @update([], bitcoin_address)
  async createDepositAddress(): Promise<bitcoin_address> {
    const caller = msgCaller();
    const derivationPath = principalToDerivationPath(caller);
    const result = await call<[ecdsa_public_key_args], ecdsa_public_key_result>(
      "aaaaa-aa",
      "ecdsa_public_key",
      {
        paramIdlTypes: [ecdsa_public_key_args],
        returnIdlType: ecdsa_public_key_result,
        args: [
          {
            canister_id: [],
            derivation_path: derivationPath,
            key_id: {
              curve: { secp256k1: null },
              name: "dfx_test_key",
            },
          },
        ],
      }
    );
    const pubkey = result.public_key;
    const address = publicKeyToP2pkhAddress({ regtest: null }, pubkey);
    this.deposits.set(caller, address);
    this.bridges.set(caller, []);
    return address;
  }

  /**
   * Monitor the balance of a Bitcoin address.
   * @returns The balance of the Bitcoin address.
   */
  @update([IDL.Text], bitcoin_get_utxos_result)
  async getUtxos(address: string): Promise<bitcoin_get_utxos_result> {
    const caller = msgCaller();
    const result = await call<
      [bitcoin_get_utxos_args],
      bitcoin_get_utxos_result
    >("aaaaa-aa", "bitcoin_get_utxos", {
      paramIdlTypes: [bitcoin_get_utxos_args],
      returnIdlType: bitcoin_get_utxos_result,
      args: [
        {
          address,
          filter: [],
          network: { regtest: null },
        },
      ],
      cycles: BITCOIN_API_CYCLE_COST,
    });
    return result;
  }

  /**
   * Get the bridges of a user.
   * @returns The bridges of the user.
   */

  @query([], IDL.Vec(Bridge))
  async getBridges(): Promise<Bridge[]> {
    const caller = msgCaller();
    return this.bridges.get(caller) ?? [];
  }

  /**
   * Get btc amount deposited by a user(utxos)
   * @param address - The Bitcoin address to get the balance of.
   * @returns The btc amount deposited by the user.
   */

  @update([IDL.Text], IDL.Float32)
  async getBtcAmountDeposited(address: string): Promise<number> {
    const result = await call<
      [bitcoin_get_utxos_args],
      bitcoin_get_utxos_result
    >("aaaaa-aa", "bitcoin_get_utxos", {
      paramIdlTypes: [bitcoin_get_utxos_args],
      returnIdlType: bitcoin_get_utxos_result,
      args: [
        {
          address,
          filter: [],
          network: { regtest: null },
        },
      ],
      cycles: BITCOIN_API_CYCLE_COST,
    });
    const totalbtc = sumUtxos(result);
    const totalckbtc = Number(totalbtc) / 100000000;
    return totalckbtc;
  }

  /**
   * BridgeHandler - Allows a user to request deposit addresses, and
   * simulate minting ckBTC when BTC is detected.
   */
}

/**HELPERS */

function principalToDerivationPath(principal: Principal): Uint8Array[] {
  return [Uint8Array.from(principal.toUint8Array())];
}

function publicKeyToP2pkhAddress(
  network: bitcoin_network,
  publicKey: Uint8Array
): string {
  const { address } = bitcoin.payments.p2pkh({
    pubkey: Buffer.from(publicKey),
    network: determineNetwork(network),
  });
  if (address === undefined) {
    throw new Error("Unable to get address from the canister");
  }
  return address;
}

function determineNetwork(network: bitcoin_network): Network {
  if ("mainnet" in network) return networks.bitcoin;
  if ("testnet" in network) return networks.testnet;
  if ("regtest" in network) return networks.regtest;
  throw new Error(`Unknown Network: ${JSON.stringify(network)}`);
}

function sumUtxos(utxos: bitcoin_get_utxos_result): bigint {
  return utxos.utxos.reduce((acc, utxo) => acc + utxo.value, 0n);
}
