export type Notification = {
  title: string;
  read: boolean;
  type: string;
  message: string;
  timestamp: bigint;
  notificationId: string;
  data: [string] | [];
};

export type User = {
  id: string;
  username: string;
  nationality: string;
  profileImage: string;
  evmAddress: string;
  btcAddress: string;
  chatStatus: "online" | "offline" | string;
  lastOnline: bigint;
  reputationScore: number;
  subscriptionStatus: {
    type: string;
    expiresIn: bigint;
  };
  theme: "light" | "dark" | string;
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

export type PersonalMessage = {
  receiver: string;
  messageId: string;
  content: string;
  timestamp: bigint;
  read: boolean;
};

export type Reply = {
  messageId: string;
  sender: Principal;
  content: string;
  timestamp: bigint;
};

export type ChatMessage = {
  messageId: string;
  roomId: string;
  sender: Principal;
  content: string;
  timestamp: bigint;
  reactions: { type: string; count: number }[];
  replies: Reply[];
};

export type Investor = {
  principalId: Principal;
  amountInvested: number;
  feeShare: number;
};

export type ChatRoom = {
  id: string;
  name: string;
  description: string;
  profileImage: string;
  admin: Principal;
  members: Principal[];
  treasury: { token: string; amount: number };
  investors: Investor[];
  contributionCycle: "daily" | "weekly" | "monthly" | string;
  investmentCycle: "weekly" | "monthly" | "yearly" | string;
  investedAmount: number;
  maxContribution: number;
  createdAt: bigint;
  messages: string[];
  nextContributionDate: bigint;
  nextInvestmentDate: bigint;
  minimumAccountBalance: number;
};

import message from "../assets/icons/newmessage.png";
import system from "../assets/images/icon-dark.png";
import agent from "../assets/icons/aiagent.png";
import { Principal } from "@dfinity/principal";

export const NotificationImages = {
  message,
  system,
  agent,
};
