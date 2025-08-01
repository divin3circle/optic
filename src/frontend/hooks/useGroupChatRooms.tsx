import { useQuery } from "@tanstack/react-query";
import { backend } from "../utils/index.js";
import useUserStore from "../store/user.js";
import { ChatMessage, ChatRoom, PersonalMessage, User } from "../types/user.js";

export function useGroupChatRooms() {
  const user = useUserStore((state) => state.user);
  if (!user) {
    return {
      groupChatRooms: [],
      isLoading: false,
      error: "User not found",
    };
  }
  const { data, isLoading } = useQuery({
    queryKey: ["groupChatRooms"],
    queryFn: () => {
      return Promise.all(
        user.chatRooms.map((gcr_id) => getGroupChatData(gcr_id))
      );
    },
    enabled: !!user.chatRooms,
  });

  return {
    groupChatRooms: data,
    isLoading,
  };
}

async function getGroupChatData(gcr_id: string): Promise<{
  chatRoom: ChatRoom[] | [];
  gcr_id: string;
}> {
  const chatRoom = await backend.get_group_chat(gcr_id);
  return {
    chatRoom,
    gcr_id,
  };
}

export function useGroupChatMessages(
  selectedGroupChatId: string | null,
  limit: bigint
) {
  if (!selectedGroupChatId) {
    return {
      messages: [],
      isLoading: false,
      error: "No group chat selected",
    };
  }
  const { data, isLoading } = useQuery({
    queryKey: ["group-messages", selectedGroupChatId],
    queryFn: async () => {
      const messages = await getGroupChatMessages(selectedGroupChatId, limit);
      return messages;
    },
  });
  return {
    messages: data,
    isLoading,
  };
}

async function getGroupChatMessages(
  gcr_id: string,
  limit: bigint
): Promise<ChatMessage[]> {
  const messages = await backend.get_group_chat_messages(gcr_id, BigInt(limit));
  return messages;
}
