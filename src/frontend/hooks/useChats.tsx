import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { backend } from "../utils/index.js";
import { useAuth } from "@nfid/identitykit/react";

export function usePersonalChats() {
  const { user } = useAuth();
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
      const chatsIds = await getPersonalChatRoomsIds(
        user.principal.toString() || ""
      );
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

async function getPersonalChatRoomsIds(userId: string) {
  const chatsIds = await backend.get_personal_chat_rooms(userId);
  return chatsIds;
}
