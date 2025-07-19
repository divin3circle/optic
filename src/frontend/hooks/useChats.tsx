import { useQuery } from "@tanstack/react-query";
import { backend } from "../utils/index.js";
import useUserStore from "../store/user.js";
import useChatStore from "../store/chats.js";

export function usePersonalChats(chatId: string | null) {
  const user = useUserStore((state) => state.user);
  const { messageBeingSent } = useChatStore();
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
    queryKey: ["personal-messages", chatId],
    queryFn: async () => {
      if (!chatId) {
        return [];
      }
      const messages = await getPersonalMessagesByChatId(chatId);

      return messages;
    },
    enabled: !!chatId,
  });

  return { messages, isLoading, error };
}

async function getPersonalMessagesByChatId(chatId: string) {
  const messages = await backend.get_personal_messages(chatId);
  return messages;
}
