import dummy from "../../../../assets/images/message.webp";
import { User } from "../../../../types/user";
import { PersonalMessage } from "../../../../types/user";
import useChatStore from "../../../../store/chats.js";

function ChatItem({
  sender,
  lastMessage,
  pcr_id,
}: {
  sender: User;
  lastMessage: PersonalMessage | null;
  pcr_id: string;
}) {
  const { setSelectedChatId, setChatHeaderProps } = useChatStore();

  const handleClick = () => {
    setSelectedChatId(pcr_id);
    setChatHeaderProps(sender);
  };

  return (
    <div
      onClick={handleClick}
      className="border-[.5px] border-gray-200 flex items-center justify-between gap-2 pb-4 my-2 cursor-pointer bg-[#fff] rounded-3xl p-2 transition-all duration-300"
    >
      <div className="flex items-center gap-2">
        <img
          src={sender.profileImage || dummy}
          alt="dummy"
          className="w-12 h-12 rounded-full"
        />
        <div className="flex flex-col">
          <h1 className="text-gray-700 text-sm font-karla-semi-bold">
            {sender.username}
          </h1>
          <p className="text-gray-500 text-xs font-karla">
            {lastMessage?.content || "No messages yet"}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 justify-end items-end">
        <p className="text-gray-500 text-xs font-karla">
          {lastMessage &&
            new Intl.DateTimeFormat("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(Number(lastMessage.timestamp)))}
        </p>
        {lastMessage?.read && (
          <p className="text-xs font-karla bg-[#e8492a] text-white rounded-full p-1 w-6 h-6 flex items-center justify-center">
            {lastMessage?.read ? "1" : "0"}
          </p>
        )}
      </div>
    </div>
  );
}

export default ChatItem;
