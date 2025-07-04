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
const NODE_INDEX_CANISTER_ICPSWAP = "ggzvv-5qaaa-aaaag-qck7a-cai";
const POOL_STORAGE_CANISTER = "xmiu5-jqaaa-aaaag-qbz7q-cai";

/**TYPES & IDLs */

const Agent = IDL.Record({
  name: IDL.Text,
  description: IDL.Text,
  image: IDL.Text,
});

const User = IDL.Record({
  principal: IDL.Principal,
  username: IDL.Text,
  theme: IDL.Text,
  agent: Agent,
  updatedAt: IDL.Int,
  createdAt: IDL.Int,
});

type Agent = {
  name: string;
  description: string;
  image: string;
};

type User = {
  principal: Principal;
  username: string;
  theme: "light" | "Dark";
  agent: Agent;
  updatedAt: number;
  createdAt: number;
};

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

const PublicPoolOverView = IDL.Record({
  id: IDL.Nat,
  token0TotalVolume: IDL.Float64,
  volumeUSD1d: IDL.Float64,
  volumeUSD7d: IDL.Float64,
  token0Id: IDL.Text,
  token1Id: IDL.Text,
  token1Volume24H: IDL.Float64,
  totalVolumeUSD: IDL.Float64,
  sqrtPrice: IDL.Float64,
  pool: IDL.Text,
  tick: IDL.Int,
  liquidity: IDL.Nat,
  token1Price: IDL.Float64,
  feeTier: IDL.Nat,
  token1TotalVolume: IDL.Float64,
  volumeUSD: IDL.Float64,
  feesUSD: IDL.Float64,
  token0Volume24H: IDL.Float64,
  token1Standard: IDL.Text,
  txCount: IDL.Nat,
  token1Decimals: IDL.Float64,
  token0Standard: IDL.Text,
  token0Symbol: IDL.Text,
  token0Decimals: IDL.Float64,
  token0Price: IDL.Float64,
  token1Symbol: IDL.Text,
  timestamp: IDL.Int,
});

type PublicPoolOverView = {
  id: bigint;
  token0TotalVolume: number;
  volumeUSD1d: number;
  volumeUSD7d: number;
  token0Id: string;
  token1Id: string;
  token1Volume24H: number;
  totalVolumeUSD: number;
  sqrtPrice: number;
  pool: string;
  tick: bigint;
  liquidity: bigint;
  token1Price: number;
  feeTier: bigint;
  token1TotalVolume: number;
  volumeUSD: number;
  feesUSD: number;
  token0Volume24H: number;
  token1Standard: string;
  txCount: bigint;
  token1Decimals: number;
  token0Standard: string;
  token0Symbol: string;
  token0Decimals: number;
  token0Price: number;
  token1Symbol: string;
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
   * user object.
   * Used to track user's information,
   * avoiding regenerating user objects for the same user.
   * @notice This is the main user object that is used to track
   * all user information.
   */

  users: Map<Principal, User> = new Map();

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
   * Create a user object for a user.
   * @param principal - The principal of the user.
   * @param username - The username of the user.
   * @param theme - The theme of the user.
   * @param agent - The agent of the user.
   */

  @update([IDL.Text, IDL.Text, IDL.Text, Agent], User)
  async createUser(
    principal: Principal,
    username: string,
    theme: "light" | "Dark",
    agent: Agent
  ): Promise<User> {
    const caller = msgCaller();
    const user: User = {
      principal: caller,
      username,
      theme,
      agent,
      updatedAt: Date.now(),
      createdAt: Date.now(),
    };
    this.users.set(caller, user);
    return user;
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
   * Get all deposit addresses
   * @returns All deposit addresses and their corresponding user principal
   */

  @query(
    [],
    IDL.Vec(
      IDL.Record({
        address: IDL.Text,
        principal: IDL.Principal,
      })
    )
  )
  async getDepositAddresses(): Promise<
    {
      address: string;
      principal: Principal;
    }[]
  > {
    return Array.from(this.deposits.entries()).map(([principal, address]) => ({
      address,
      principal,
    }));
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

  /**
   * Get all user positions and update the positions map
   * @notice This function is called by the user
   * @returns The positions of the user.
   */

  @update([], IDL.Vec(Position))
  async getAllUserPositions(): Promise<Position[]> {
    const caller = msgCaller();
    const positions = Array.from(this.positions.get(caller) ?? []);
    this.positions.set(caller, positions);
    return positions;
  }
}

/**HELPERS */

function sumUtxos(utxos: bitcoin_get_utxos_result): bigint {
  return utxos.utxos.reduce((acc, utxo) => acc + utxo.value, 0n);
}

function getCkBtcPrincipal(): string {
  // TODO: change once ready for mainnet
  return "l62sy-yx777-77777-aaabq-cai"; // ckbtc ledger
}
function getMinterPrincipal(): string {
  // TODO: change once ready for mainnet
  return "umunu-kh777-77774-qaaca-cai"; // minter
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
