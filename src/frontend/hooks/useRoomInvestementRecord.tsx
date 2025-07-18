import { useQuery } from "@tanstack/react-query";
import { backend } from "../utils/index.js";
import useChatStore from "../store/chats.js";

export function useRoomInvestmentRecord() {
  const { selectedGroupChatId } = useChatStore();
  if (!selectedGroupChatId) {
    return { data: null, isLoading: false };
  }
  const { data, isLoading } = useQuery({
    queryKey: ["roomInvestmentRecord", selectedGroupChatId],
    queryFn: () =>
      backend.get_group_chat_total_contributions(selectedGroupChatId),
    enabled: !!selectedGroupChatId,
  });

  return { data: data?.[0], isLoading };
}
