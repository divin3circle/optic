/**
 * *************************
 * ------------------------
 * Data Schemes
 * ------------------------
 * *************************
 */

import { IDL, Principal } from "azle";

// Treasury Record
export const TreasuryRecord = IDL.Record({
  amount: IDL.Int, // Changed from IDL.Float64 to IDL.Int for precision
  token: IDL.Text,
  timestamp: IDL.Int,
});

export type TreasuryRecord = {
  amount: bigint; // Changed from number to bigint
  token: string;
  timestamp: bigint;
};

export const InvestmentRecord = IDL.Record({
  token: IDL.Text,
  amount: IDL.Int, // Changed from IDL.Float64 to IDL.Int for precision
  updatedAt: IDL.Int,
});
export type InvestmentRecord = {
  token: string;
  amount: bigint; // Changed from number to bigint
  updatedAt: bigint;
};

export const ContributionRecord = IDL.Record({
  roomId: IDL.Text,
  contributor: IDL.Principal,
  amount: IDL.Int, // Changed from IDL.Float64 to IDL.Int for precision
  amountInUSD: IDL.Int, // Changed from IDL.Float64 to IDL.Int for precision
  token: IDL.Text,
  timestamp: IDL.Int,
});
export type ContributionRecord = {
  roomId: string;
  contributor: Principal;
  amount: bigint; // Changed from number to bigint
  amountInUSD: bigint; // Changed from number to bigint
  token: string;
  timestamp: bigint;
};
export const MemberContributionRecord = IDL.Record({
  roomId: IDL.Text,
  room: IDL.Text,
  amount: IDL.Int, // Changed from IDL.Float64 to IDL.Int for precision
  amountInUSD: IDL.Int, // Changed from IDL.Float64 to IDL.Int for precision
  token: IDL.Text,
  timestamp: IDL.Int,
});
export type MemberContributionRecord = {
  roomId: string;
  room: string;
  amount: bigint; // Changed from number to bigint
  amountInUSD: bigint; // Changed from number to bigint
  token: string;
  timestamp: bigint;
};

// Investors
export const Investor = IDL.Record({
  principalId: IDL.Principal,
  amountInvested: IDL.Int, // Changed from IDL.Float64 to IDL.Int for precision
  feeShare: IDL.Int, // Changed from IDL.Float64 to IDL.Int for precision (will store as basis points * 10000)
});
export type Investor = {
  principalId: Principal;
  amountInvested: bigint; // Changed from number to bigint
  feeShare: bigint; // Changed from number to bigint (basis points * 10000 for precision)
};

//Reply
export const Reply = IDL.Record({
  messageId: IDL.Text,
  sender: IDL.Principal,
  content: IDL.Text,
  timestamp: IDL.Int,
});
export type Reply = {
  messageId: string;
  sender: Principal;
  content: string;
  timestamp: bigint;
};

// ChatMessage - Group Chat
export const ChatMessage = IDL.Record({
  messageId: IDL.Text,
  roomId: IDL.Text,
  sender: IDL.Principal,
  content: IDL.Text,
  timestamp: IDL.Int,
  reactions: IDL.Vec(
    IDL.Record({
      type: IDL.Text,
      count: IDL.Nat32,
    })
  ),
  replies: IDL.Vec(Reply), // list of replies
});
export type ChatMessage = {
  messageId: string;
  roomId: string;
  sender: Principal;
  content: string;
  timestamp: bigint;
  reactions: { type: string; count: number }[];
  replies: Reply[];
};

export const PersonalMessage = IDL.Record({
  receiver: IDL.Text,
  messageId: IDL.Text,
  content: IDL.Text,
  timestamp: IDL.Int,
  read: IDL.Bool,
});
export type PersonalMessage = {
  receiver: string;
  messageId: string;
  content: string;
  timestamp: bigint;
  read: boolean;
};

// Notification
export const Notification = IDL.Record({
  notificationId: IDL.Text,
  type: IDL.Text, // "message" | "proposal" | "system"
  title: IDL.Text,
  message: IDL.Text,
  read: IDL.Bool,
  timestamp: IDL.Int,
  data: IDL.Opt(IDL.Text),
});
export type Notification = {
  notificationId: string;
  type: "message" | "proposal" | "system";
  title: string;
  message: string;
  read: boolean;
  timestamp: bigint;
  data: [string] | [];
};

// Personal Chat Room
export const PersonalChatRoom = IDL.Record({
  id: IDL.Text,
  participants: IDL.Vec(IDL.Principal),
  messages: IDL.Vec(PersonalMessage),
});
export type PersonalChatRoom = {
  id: string;
  participants: Principal[];
  messages: PersonalMessage[];
};

// User
export const User = IDL.Record({
  id: IDL.Text,
  username: IDL.Text,
  nationality: IDL.Text,
  profileImage: IDL.Text,
  evmAddress: IDL.Text,
  btcAddress: IDL.Text,
  chatStatus: IDL.Text, // "online" | "offline"
  lastOnline: IDL.Int, // timestamp
  reputationScore: IDL.Float32, // 0 - 100
  subscriptionStatus: IDL.Record({
    type: IDL.Text,
    expiresIn: IDL.Int,
  }),
  theme: IDL.Text, // "light" | "dark"
  balances: IDL.Record({
    icp: IDL.Float64,
    ckBTC: IDL.Float64,
    evm: IDL.Float64,
  }),
  plugins: IDL.Vec(IDL.Text), // list of plugin canister IDs
  notifications: IDL.Vec(Notification),
  chatRooms: IDL.Vec(IDL.Text), // list of chat room ids
  personalChatRooms: IDL.Vec(IDL.Text), // list of personal chat room ids
});
export type User = {
  id: string;
  username: string;
  nationality: string;
  profileImage: string;
  evmAddress: string;
  btcAddress: string;
  chatStatus: "online" | "offline";
  lastOnline: bigint;
  reputationScore: number;
  subscriptionStatus: {
    type: string;
    expiresIn: number;
  };
  theme: "light" | "dark";
  balances: {
    icp: number;
    ckBTC: number;
    evm: number;
  };
  plugins: string[];
  notifications: Notification[];
  chatRooms: string[];
  personalChatRooms: string[];
};

// ChatRoom
export const ChatRoom = IDL.Record({
  id: IDL.Text,
  name: IDL.Text,
  description: IDL.Text,
  profileImage: IDL.Text,
  admin: IDL.Principal,
  members: IDL.Vec(IDL.Principal),
  treasury: IDL.Record({
    token: IDL.Text,
    amount: IDL.Int, // Changed from IDL.Float64 to IDL.Int for precision
  }),
  investors: IDL.Vec(
    // list of investors
    IDL.Record({
      principalId: IDL.Principal,
      amountInvested: IDL.Int, // Changed from IDL.Float64 to IDL.Int for precision
      feeShare: IDL.Int, // Changed from IDL.Float32 to IDL.Int for precision (basis points * 10000)
    })
  ),
  contributionCycle: IDL.Text, // "daily" | "weekly" | "monthly"
  investmentCycle: IDL.Text, // How long will each investment take: "7 days" | "30 days"
  investedAmount: IDL.Int, // Changed from IDL.Float64 to IDL.Int for precision
  maxContribution: IDL.Int, // Changed from IDL.Float64 to IDL.Int for precision
  createdAt: IDL.Int,
  messages: IDL.Vec(IDL.Text),
  nextContributionDate: IDL.Int,
  nextInvestmentDate: IDL.Int,
  minimumAccountBalance: IDL.Int, // Changed from IDL.Float64 to IDL.Int for precision
});
export type ChatRoom = {
  id: string;
  name: string;
  description: string;
  profileImage: string;
  admin: Principal;
  members: Principal[];
  treasury: { token: string; amount: bigint }; // Changed from number to bigint
  investors: Investor[];
  contributionCycle: "daily" | "weekly" | "monthly";
  investmentCycle: "weekly" | "monthly" | "yearly";
  investedAmount: bigint; // Changed from number to bigint
  maxContribution: bigint; // Changed from number to bigint
  createdAt: bigint;
  messages: string[];
  nextContributionDate: bigint;
  nextInvestmentDate: bigint;
  minimumAccountBalance: bigint; // Changed from number to bigint
};

// ContributionRecord
export const Contribution = IDL.Record({
  roomId: IDL.Text,
  contributor: IDL.Principal,
  amount: IDL.Int, // Changed from IDL.Float64 to IDL.Int for precision
  timestamp: IDL.Int,
});
export type Contribution = {
  roomId: string;
  contributor: Principal;
  amount: bigint; // Changed from number to bigint
  timestamp: bigint;
};

// PoolPosition
export const Position = IDL.Record({
  poolId: IDL.Text,
  tokenA: IDL.Text,
  tokenB: IDL.Text,
  amountA: IDL.Float64,
  amountB: IDL.Float64,
  lpTokens: IDL.Float64,
  lastUpdated: IDL.Int,
});
export type Position = {
  poolId: string;
  tokenA: string;
  tokenB: string;
  amountA: number;
  amountB: number;
  lpTokens: number;
  lastUpdated: bigint;
};

// InvestmentEvent
export const InvestmentEvent = IDL.Record({
  roomId: IDL.Text,
  action: IDL.Text, // "swap" | "provide" | "withdraw"
  details: IDL.Text,
  timestamp: IDL.Int,
});
export type InvestmentEvent = {
  roomId: string;
  action: "swap" | "provide" | "withdraw";
  details: string;
  timestamp: bigint;
};

// Proposal & Vote (Governance)
export const Proposal = IDL.Record({
  id: IDL.Text,
  proposer: IDL.Principal,
  params: IDL.Record({
    rebalanceThreshold: IDL.Float32,
    feeRateBps: IDL.Float32,
    minStake: IDL.Float32,
    votingPeriodSec: IDL.Int32,
    quorumBps: IDL.Nat64,
  }),
  votesFor: IDL.Nat64,
  votesAgainst: IDL.Nat64,
  expiration: IDL.Int,
  status: IDL.Text,
});
export type Proposal = {
  id: string;
  proposer: Principal;
  params: {
    rebalanceThreshold: number;
    feeRateBps: number;
    minStake: number;
    votingPeriodSec: number;
    quorumBps: bigint;
  };
  votesFor: bigint;
  votesAgainst: bigint;
  expiration: bigint;
  status: string;
};

export const Vote = IDL.Record({
  proposalId: IDL.Text,
  voter: IDL.Principal,
  approve: IDL.Bool,
  timestamp: IDL.Int,
});
export type Vote = {
  proposalId: string;
  voter: Principal;
  approve: boolean;
  timestamp: bigint;
};

// Plugin
export const Plugin = IDL.Record({
  id: IDL.Text,
  canisterId: IDL.Principal,
  name: IDL.Text,
  description: IDL.Text,
  fee: IDL.Float64,
});
export type Plugin = {
  id: string;
  canisterId: Principal;
  name: string;
  description: string;
  fee: number;
};
