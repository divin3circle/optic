import ChatItem from "./ChatItem";
import useUserStore from "../../../../store/user";
import { usePersonalChats } from "../../../../hooks/useChats";
import { usePersonalChatRooms } from "../../../../hooks/usePersonalChatRooms";
import Loading from "@/components/ui/Loading";

function ChatList() {
  const { personalChatRooms, isLoading } = usePersonalChatRooms();

  if (isLoading) {
    return <Loading />;
  }

  if (!personalChatRooms) {
    return (
      <div className="flex flex-col gap-2 p-2 h-full overflow-y-auto">
        <h1 className="text-gray-500 text-lg font-karla">No personal chats</h1>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#faf6f9] rounded-3xl p-2">
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex flex-col gap-2">
          {personalChatRooms.map(
            (personalChatRoom) =>
              personalChatRoom.sender && (
                <ChatItem
                  key={personalChatRoom.sender.id}
                  sender={personalChatRoom.sender}
                  lastMessage={personalChatRoom.lastMessage}
                  pcr_id={personalChatRoom.pcr_id}
                />
              )
          )}
          {personalChatRooms.length === 0 && (
            <div className="flex flex-col gap-2">
              <h1 className="text-gray-500 text-lg font-karla">
                No personal chats
              </h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatList;
