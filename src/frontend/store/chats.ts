import { create } from "zustand";
import { User } from "../types/user";

type ChatStoreState = {
  selectedChatId: string | null;
  chatHeaderProps: User | null;
  setSelectedChatId: (chatId: string | null) => void;
  setChatHeaderProps: (props: User | null) => void;
};

const useChatStore = create<ChatStoreState>((set) => ({
  selectedChatId: null,
  chatHeaderProps: null,
  setSelectedChatId: (chatId: string | null) => set({ selectedChatId: chatId }),
  setChatHeaderProps: (props: User | null) => set({ chatHeaderProps: props }),
}));

export default useChatStore;
