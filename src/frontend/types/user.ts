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
