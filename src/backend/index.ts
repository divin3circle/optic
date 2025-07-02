import { call, IDL, init, Principal, query, update, msgCaller } from "azle";
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
import { UpdateBalanceArgs, UpdateBalanceResult } from "./minterTypes";
import {
  Account,
  TransferArgs,
  TransferResult,
} from "azle/canisters/icrc_1/idl";

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
  expiration: IDL.Int,
  status: IDL.Text,
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
  expiration: number;
  status: string;
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

const getBtcAddressArgs = IDL.Record({
  owner: IDL.Principal,
  subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
});

const getBtcAddressResult = IDL.Text;

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
  /************
   * OPTIC STATES
   * **********
   */

  /**
   * A mapping of user principal to their
   * btc deposit address.
   * Used to track user's btc deposit addresses,
   * avoiding regenerating addresses for the same user.
   */

  deposits: Map<Principal, string> = new Map();

  /**
   * A mapping of user principal to their
   * positions in various pools. Useful for
   * tracking user's positions and calculating
   * their rewards and app fees
   */

  positions: Map<Principal, Position[]> = new Map();

  /**
   * A mapping of pool id to their oracle feed.
   * Used to track the oracle feed for each pool.
   * Important for deciding when to rebalance pools
   * for users to earn rewards.
   */

  feeds: Map<string, OracleFeed> = new Map();

  /**
   * A mapping of user principal to the
   * staked amount of ckBTC they have in
   * the protocol. Important for calculating
   * user's voting power in proposals.
   */

  stakes: Map<Principal, number> = new Map();

  /**
   * A mapping of proposal id to the proposal.
   * Used to track the proposal and its votes.
   * Important for tracking the status of proposals
   */

  proposal: Map<string, Proposal> = new Map();

  /**
   * A mapping of user principal to their
   * bridges. Used to track the bridges from btc to ckBTC.
   * Important for tracking the amount of btc deposited
   * by a user and the amount of ckBTC they have received.
   */

  bridges: Map<Principal, Bridge[]> = new Map();

  /************
   * OPTIC FUNCTIONS
   * **********
   */

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
    const result = await getUserBtcDepositAddress(msgCaller().toString());
    this.deposits.set(msgCaller(), result);
    return result;
  }

  /**
   * Get all deposit addresses
   * @returns All deposit addresses
   */

  @query([], IDL.Vec(IDL.Text))
  async getDepositAddresses(): Promise<string[]> {
    return Array.from(this.deposits.values());
  }

  /**
   * Monitor the balance of a Bitcoin address.
   * @returns The balance of the Bitcoin address.
   */
  @update([IDL.Text], bitcoin_get_utxos_result)
  async getUtxos(address: string): Promise<bitcoin_get_utxos_result> {
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
   * Update user ckBTC balance
   * @returns The result of the update balance call.
   */

  @update([], UpdateBalanceResult)
  async updateBalance(): Promise<UpdateBalanceResult> {
    const updateBalanceResult: UpdateBalanceResult = await call<
      [UpdateBalanceArgs],
      UpdateBalanceResult
    >(getMinterPrincipal(), "update_balance", {
      paramIdlTypes: [UpdateBalanceArgs],
      returnIdlType: UpdateBalanceResult,
      args: [
        {
          owner: [msgCaller()],
          subaccount: [],
        },
      ],
    });

    return updateBalanceResult;
  }

  /**
   * Get the ckBTC balance of a user.
   * @returns The ckBTC balance of the user.
   */

  @update([], IDL.Nat64)
  async getCkBTCBalance(): Promise<bigint> {
    return await call<[Account], bigint>(
      getCkBtcPrincipal(),
      "icrc1_balance_of",
      {
        paramIdlTypes: [Account],
        returnIdlType: IDL.Nat,
        args: [
          {
            owner: msgCaller(),
            subaccount: [],
          },
        ],
      }
    );
  }
}

/**HELPERS */

function sumUtxos(utxos: bitcoin_get_utxos_result): bigint {
  return utxos.utxos.reduce((acc, utxo) => acc + utxo.value, 0n);
}

function getCkBtcPrincipal(): string {
  // TODO: change once ready for mainnet
  return "lqy7q-dh777-77777-aaaaq-cai"; // ckbtc ledger
}
function getMinterPrincipal(): string {
  // TODO: change once ready for mainnet
  return "ll5dv-z7777-77777-aaaca-cai"; // minter
}

async function getUserBtcDepositAddress(
  userPrincipal: string,
  subaccount?: Uint8Array
): Promise<string> {
  const args = {
    owner: Principal.fromText(userPrincipal),
    subaccount: subaccount ? [subaccount] : [],
  };

  const btcAddress = await call<[typeof args], string>(
    getMinterPrincipal(),
    "get_btc_address",
    {
      paramIdlTypes: [getBtcAddressArgs],
      returnIdlType: getBtcAddressResult,
      args: [args],
    }
  );

  return btcAddress;
}
