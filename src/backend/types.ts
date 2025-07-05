import { IDL, Principal } from "azle";

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

export {
  Agent,
  User,
  Position,
  OracleFeed,
  Proposal,
  getBtcAddressArgs,
  getBtcAddressResult,
  Bridge,
  PublicPoolOverView,
};
