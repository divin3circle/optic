import { useQuery } from "@tanstack/react-query";
import { backend } from "../utils/index.js";
import useUserStore from "../store/user.js";

export function usePersonalChats() {
  const user = useUserStore((state) => state.user);
  if (!user) {
    return {
      messages: [],
      isLoading: false,
      error: "User not found",
    };
  }
  const {
    data: messages,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["personal-messages"],
    queryFn: async () => {
      const chatsIds = user.personalChatRooms;
      if (chatsIds.length === 0) {
        return [];
      }
      const messages = await Promise.all(
        chatsIds.map(getPersonalMessagesByChatId)
      );
      return messages;
    },
  });

  return { messages, isLoading, error };
}

async function getPersonalMessagesByChatId(chatId: string) {
  const messages = await backend.get_personal_messages(chatId);
  return messages;
}
