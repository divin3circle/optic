import { create } from "zustand";
import { ChatRoom, PersonalMessage, User } from "../types/user";

type ChatStoreState = {
  selectedChatId: string | null;
  selectedGroupChatId: string | null;
  chatHeaderProps: User | null;
  groupHeaderProps: ChatRoom | null;
  messageBeingSent: PersonalMessage | null;
  sendingMessage: string | null;
  setSelectedChatId: (chatId: string | null) => void;
  setChatHeaderProps: (props: User | null) => void;
  setGroupHeaderProps: (props: ChatRoom | null) => void;
  setMessageBeingSent: (message: PersonalMessage | null) => void;
  setSendingMessage: (sending: string | null) => void;
  setSelectedGroupChatId: (groupChatId: string | null) => void;
};

const useChatStore = create<ChatStoreState>((set) => ({
  selectedChatId: null,
  selectedGroupChatId: null,
  chatHeaderProps: null,
  groupHeaderProps: null,
  messageBeingSent: null,
  sendingMessage: null,
  setSelectedChatId: (chatId: string | null) => set({ selectedChatId: chatId }),
  setChatHeaderProps: (props: User | null) => set({ chatHeaderProps: props }),
  setGroupHeaderProps: (props: ChatRoom | null) =>
    set({ groupHeaderProps: props }),
  setMessageBeingSent: (message: PersonalMessage | null) =>
    set({ messageBeingSent: message }),
  setSendingMessage: (sending: string | null) =>
    set({ sendingMessage: sending }),
  setSelectedGroupChatId: (groupChatId: string | null) =>
    set({ selectedGroupChatId: groupChatId }),
}));

export default useChatStore;
