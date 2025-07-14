import { create } from "zustand";
import { User } from "../types/user.js";

interface UserStoreState {
  user: User | null;
  setUser: (user: User) => void;
  getUser: () => User | null;
}

const useUserStore = create<UserStoreState>((set, get) => ({
  user: null,
  setUser: (user: User) => set({ user }),
  getUser: () => get().user,
}));

export default useUserStore;
