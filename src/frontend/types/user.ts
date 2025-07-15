export type Notification = {
  title: string;
  read: boolean;
  type: string;
  message: string;
  timestamp: bigint;
  notificationId: string;
};

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
    expiresIn: bigint;
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

import message from "../assets/icons/newmessage.png";
import system from "../assets/images/icon-dark.png";
import agent from "../assets/icons/aiagent.png";

export const NotificationImages = {
  message,
  system,
  agent,
};
