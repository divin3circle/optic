import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { FaCheckDouble } from "react-icons/fa6";
import useUserStore from "../../../../store/user";
import { ChatMessage } from "../../../../types/user";
import useChatStore from "../../../../store/chats";
import { useGetUser } from "../../../../hooks/useUser";

function GroupMessageBubble({ message }: { message: ChatMessage }) {
  const { sendingMessage } = useChatStore();
  const { data: sender } = useGetUser(message.sender.toString());

  const user = useUserStore((state) => state.user);
  if (!user) {
    return null;
  }
  const isUser = useMemo(() => {
    return message.sender.toString() !== user.id;
  }, [message]);
  if (!sender || !sender[0]) {
    return null;
  }
  return (
    <div
      className={cn(
        "flex flex-col w-full mb-4 p-2",
        isUser ? "items-end" : "items-start"
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <img
          src={sender[0].profileImage}
          alt={sender[0].username}
          className={cn(
            "w-8 h-8 rounded-full border border-gray-200",
            !isUser ? "border-[#e8492a]" : "border-gray-200"
          )}
        />
        <h1 className="text-gray-500 font-karla text-sm">
          {isUser ? sender?.[0]?.username : "You"}
        </h1>
      </div>
      <div
        className={cn(
          "flex flex-col gap-2 min-w-[50px] max-w-[75%] py-3 px-2 text-wrap text-primary items-start bg-[#faf6f9] rounded-tl-xl rounded-tr-3xl rounded-br-3xl border border-gray-200",
          !isUser ? "border-l-[#e8492a] border-2" : "border-gray-200"
        )}
      >
        <h1
          className={cn(
            "text-white font-karla text-lg",
            isUser ? "text-white" : "text-primary"
          )}
        >
          {message.content}
        </h1>
      </div>
      <div
        className={cn(
          "flex items-center gap-2",
          isUser ? "justify-end" : "justify-start flex-row-reverse"
        )}
      >
        <p className="text-gray-500 font-karla text-xs">
          {sendingMessage === message.content
            ? "Sending..."
            : new Intl.DateTimeFormat("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(Number(message.timestamp)))}
        </p>
        <FaCheckDouble className="w-3 h-3 text-gray-500" />
      </div>
    </div>
  );
}

export default GroupMessageBubble;
