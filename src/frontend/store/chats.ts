import { create } from "zustand";
import { PersonalMessage, User } from "../types/user";

type ChatStoreState = {
  selectedChatId: string | null;
  chatHeaderProps: User | null;
  messageBeingSent: PersonalMessage | null;
  sendingMessage: string | null;
  setSelectedChatId: (chatId: string | null) => void;
  setChatHeaderProps: (props: User | null) => void;
  setMessageBeingSent: (message: PersonalMessage | null) => void;
  setSendingMessage: (sending: string | null) => void;
};

const useChatStore = create<ChatStoreState>((set) => ({
  selectedChatId: null,
  chatHeaderProps: null,
  messageBeingSent: null,
  sendingMessage: null,
  setSelectedChatId: (chatId: string | null) => set({ selectedChatId: chatId }),
  setChatHeaderProps: (props: User | null) => set({ chatHeaderProps: props }),
  setMessageBeingSent: (message: PersonalMessage | null) =>
    set({ messageBeingSent: message }),
  setSendingMessage: (sending: string | null) =>
    set({ sendingMessage: sending }),
}));

export default useChatStore;
