import { useQuery } from "@tanstack/react-query";
import { backend } from "../utils/index.js";
import useUserStore from "../store/user.js";

export function usePersonalChatRooms() {
  const user = useUserStore((state) => state.user);
  if (!user) {
    return {
      personalChatRooms: [],
      isLoading: false,
      error: "User not found",
    };
  }

  return user.personalChatRooms;
}
