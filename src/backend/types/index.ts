/**
 * *************************
 * ------------------------
 * Data Schemes
 * ------------------------
 * *************************
 */

import { IDL, Principal } from "azle";

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

// ChatMessage
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
  messageId: IDL.Text,
  sender: IDL.Principal,
  receiver: IDL.Principal,
  content: IDL.Text,
  timestamp: IDL.Int,
  read: IDL.Bool,
});
export type PersonalMessage = {
  messageId: string;
  sender: Principal;
  receiver: Principal;
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
});
export type Notification = {
  notificationId: string;
  type: "message" | "proposal" | "system";
  title: string;
  message: string;
  read: boolean;
  timestamp: bigint;
};

// User
export const User = IDL.Record({
  principalId: IDL.Principal,
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
  personalMessages: IDL.Vec(PersonalMessage), // list of personal messages
});
export type User = {
  principalId: Principal;
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
  personalMessages: PersonalMessage[];
};

// ChatRoom
export const ChatRoom = IDL.Record({
  id: IDL.Text,
  name: IDL.Text,
  description: IDL.Text,
  admin: IDL.Principal,
  members: IDL.Vec(IDL.Principal),
  treasury: IDL.Record({
    token: IDL.Text,
    amount: IDL.Float64,
  }),
  investors: IDL.Vec(
    IDL.Record({
      principalId: IDL.Principal,
      amountInvested: IDL.Float64,
      feeShare: IDL.Float32,
    })
  ),
  contributionCycle: IDL.Text, // "daily" | "weekly" | "monthly"
  investmentCycle: IDL.Text, // How long will each investment take: "7 days" | "30 days"
  maxContribution: IDL.Float64,
  createdAt: IDL.Int,
  messages: IDL.Vec(ChatMessage),
});
export type ChatRoom = {
  id: string;
  name: string;
  description: string;
  admin: Principal;
  members: Principal[];
  treasury: { token: string; amount: number };
  investors: {
    principalId: Principal;
    amountInvested: number;
    feeShare: number;
  }[];
  contributionCycle: "daily" | "weekly" | "monthly";
  investmentCycle: "weekly" | "monthly" | "yearly";
  maxContribution: number;
  createdAt: bigint;
  messages: ChatMessage[];
};

// ContributionRecord
export const Contribution = IDL.Record({
  roomId: IDL.Text,
  contributor: IDL.Principal,
  amount: IDL.Float64,
  timestamp: IDL.Int,
});
export type Contribution = {
  roomId: string;
  contributor: Principal;
  amount: number;
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
