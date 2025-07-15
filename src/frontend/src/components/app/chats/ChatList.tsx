import ChatItem from "./ChatItem";
import useUserStore from "../../../../store/user";
import { usePersonalChats } from "../../../../hooks/useChats";
import { usePersonalChatRooms } from "../../../../hooks/usePersonalChatRooms";

function ChatList() {
  const personalChatRooms = usePersonalChatRooms();

  console.log(personalChatRooms);

  return (
    <div className="h-full bg-[#faf6f9] rounded-3xl p-2">
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-gray-500 text-lg font-karla">Group Chats</h1>
        <p className="text-gray-500 text-sm font-karla text-center">
          No group chats.
        </p>
      </div>
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-gray-500 text-lg font-karla">All</h1>
        <div className="flex flex-col gap-2">
          <ChatItem />
          <ChatItem />
          <ChatItem />
        </div>
      </div>
    </div>
  );
}

export default ChatList;
