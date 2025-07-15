import { useQuery } from "@tanstack/react-query";
import { backend } from "../utils/index.js";
import useUserStore from "../store/user.js";
import { PersonalMessage, User } from "../types/user.js";

export function usePersonalChatRooms() {
  const user = useUserStore((state) => state.user);
  if (!user) {
    return {
      personalChatRooms: [],
      isLoading: false,
      error: "User not found",
    };
  }
  const { data, isLoading } = useQuery({
    queryKey: ["personalChatRooms"],
    queryFn: () => {
      return Promise.all(
        user.personalChatRooms.map((pcr_id) => getChatRoomData(pcr_id, user.id))
      );
    },
    enabled: !!user.personalChatRooms,
  });

  return {
    personalChatRooms: data,
    isLoading,
  };
}

async function getChatRoomData(
  pcr_id: string,
  currentUserId: string
): Promise<{
  sender: User | null;
  lastMessage: PersonalMessage | null;
  pcr_id: string;
}> {
  const pcrParticipants = await backend.get_personal_chat_room_participants(
    pcr_id
  );
  const sender = pcrParticipants.find(
    (participant) => participant.id !== currentUserId
  );
  const lastMessage = await backend
    .get_personal_messages(pcr_id)
    .then((messages) => messages[messages.length - 1]);
  if (!sender) {
    return {
      sender: null,
      lastMessage: null,
      pcr_id,
    };
  }
  return {
    sender,
    lastMessage,
    pcr_id,
  };
}
