// src/frontend/mock/chats.ts

// Dummy Principals for mock data
const principal1 = "principal-1";
const principal2 = "principal-2";
const principal3 = "principal-3";
const principal4 = "principal-4";

// Personal Chat Rooms
export const personalChats = [
  {
    id: "pcr-1",
    participants: [principal1, principal2],
    messages: [
      {
        messageId: "msg-1",
        content: "Hey! How are you?",
        timestamp: 1718000000000n,
        read: true,
      },
      {
        messageId: "msg-2",
        content: "I'm good, thanks! How about you?",
        timestamp: 1718000001000n,
        read: true,
      },
      {
        messageId: "msg-3",
        content: "Doing well. Ready for the meeting?",
        timestamp: 1718000002000n,
        read: false,
      },
    ],
  },
  {
    id: "pcr-2",
    participants: [principal1, principal3],
    messages: [
      {
        messageId: "msg-4",
        content: "Did you finish the report?",
        timestamp: 1718000100000n,
        read: true,
      },
      {
        messageId: "msg-5",
        content: "Almost done, will send soon.",
        timestamp: 1718000101000n,
        read: false,
      },
    ],
  },
  {
    id: "pcr-3",
    participants: [principal1, principal4],
    messages: [
      {
        messageId: "msg-6",
        content: "Happy birthday! 🎉",
        timestamp: 1718000200000n,
        read: true,
      },
      {
        messageId: "msg-7",
        content: "Thank you so much!",
        timestamp: 1718000201000n,
        read: true,
      },
      {
        messageId: "msg-8",
        content: "Any plans for today?",
        timestamp: 1718000202000n,
        read: false,
      },
    ],
  },
];

// Group Chat Room
export const groupChats = [
  {
    id: "group-1",
    name: "Project Team",
    description: "All about the new project",
    profileImage: "",
    admin: principal1,
    members: [principal1, principal2, principal3, principal4],
    treasury: { token: "ICP", amount: 1000 },
    investors: [],
    contributionCycle: "weekly",
    investmentCycle: "monthly",
    investedAmount: 500,
    maxContribution: 200,
    createdAt: 1718000300000n,
    messages: [
      {
        messageId: "gmsg-1",
        roomId: "group-1",
        sender: principal1,
        content: "Welcome to the project team chat!",
        timestamp: 1718000300000n,
        reactions: [],
        replies: [],
      },
      {
        messageId: "gmsg-2",
        roomId: "group-1",
        sender: principal2,
        content: "Thanks! Excited to start.",
        timestamp: 1718000301000n,
        reactions: [],
        replies: [],
      },
      {
        messageId: "gmsg-3",
        roomId: "group-1",
        sender: principal3,
        content: "When is our first meeting?",
        timestamp: 1718000302000n,
        reactions: [],
        replies: [],
      },
      {
        messageId: "gmsg-4",
        roomId: "group-1",
        sender: principal1,
        content: "Tomorrow at 10am.",
        timestamp: 1718000303000n,
        reactions: [],
        replies: [],
      },
    ],
    nextContributionDate: 1718000400000n,
    nextInvestmentDate: 1718000500000n,
    minimumAccountBalance: 10,
  },
];

export type Chat = {
  id: string;
  participants: string[];
  messages: string[];
};

export type ChatMessage = {
  messageId: string;
  content: string;
  timestamp: bigint;
  read: boolean;
};

export type GroupChatMessage = {
  messageId: string;
  roomId: string;
  sender: string;
  content: string;
  timestamp: bigint;
};

export type ChatRoom = {
  id: string;
  name: string;
  description: string;
  profileImage: string;
  admin: string;
  members: string[];
  treasury: { token: string; amount: number };
  investors: { principalId: string; amountInvested: number }[];
  contributionCycle: "daily" | "weekly" | "monthly";
  investmentCycle: "weekly" | "monthly" | "yearly";
  investedAmount: number;
  maxContribution: number;
  createdAt: bigint;
  messages: ChatMessage[];
  nextContributionDate: bigint;
  nextInvestmentDate: bigint;
  minimumAccountBalance: number;
};
