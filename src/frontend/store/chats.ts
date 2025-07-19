import { create } from "zustand";
import { ChatMessage, ChatRoom, PersonalMessage, User } from "../types/user";

type ChatStoreState = {
  selectedChatId: string | null;
  selectedGroupChatId: string | null;
  viewingGroupProfile: boolean;
  chatHeaderProps: User | null;
  groupHeaderProps: ChatRoom | null;
  messageBeingSent: PersonalMessage | null;
  groupMessageBeingSent: ChatMessage | null;
  sendingMessage: string | null;
  setSelectedChatId: (chatId: string | null) => void;
  setViewingGroupProfile: (viewing: boolean) => void;
  setChatHeaderProps: (props: User | null) => void;
  setGroupHeaderProps: (props: ChatRoom | null) => void;
  setMessageBeingSent: (message: PersonalMessage | null) => void;
  setGroupMessageBeingSent: (message: ChatMessage | null) => void;
  setSendingMessage: (sending: string | null) => void;
  setSelectedGroupChatId: (groupChatId: string | null) => void;
};

const useChatStore = create<ChatStoreState>((set) => ({
  selectedChatId: null,
  selectedGroupChatId: null,
  viewingGroupProfile: false,
  chatHeaderProps: null,
  groupHeaderProps: null,
  messageBeingSent: null,
  groupMessageBeingSent: null,
  sendingMessage: null,
  setSelectedChatId: (chatId: string | null) => set({ selectedChatId: chatId }),
  setViewingGroupProfile: (viewing: boolean) =>
    set({ viewingGroupProfile: viewing }),
  setChatHeaderProps: (props: User | null) => set({ chatHeaderProps: props }),
  setGroupHeaderProps: (props: ChatRoom | null) =>
    set({ groupHeaderProps: props }),
  setMessageBeingSent: (message: PersonalMessage | null) =>
    set({ messageBeingSent: message }),
  setGroupMessageBeingSent: (message: ChatMessage | null) =>
    set({ groupMessageBeingSent: message }),
  setSendingMessage: (sending: string | null) =>
    set({ sendingMessage: sending }),
  setSelectedGroupChatId: (groupChatId: string | null) =>
    set({ selectedGroupChatId: groupChatId }),
}));

export default useChatStore;
