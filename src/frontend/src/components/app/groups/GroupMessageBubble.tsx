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
  if (!sender || !sender[0]) {
    return null;
  }
  const user = useUserStore((state) => state.user);
  if (!user) {
    return null;
  }
  const isUser = useMemo(() => {
    return message.sender.toString() !== user.id;
  }, [message]);
  return (
    <div
      className={cn(
        "flex flex-col w-full mb-4",
        isUser ? "items-end" : "items-start"
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <img
          src={sender[0].profileImage}
          alt={sender[0].username}
          className="w-8 h-8 rounded-full"
        />
        <h1 className="text-gray-500 font-karla text-sm">
          {sender?.[0]?.username}
        </h1>
      </div>
      <div
        className={cn(
          "flex flex-col gap-2 max-w-[75%] py-3 px-2 text-wrap text-primary",
          isUser
            ? "items-start bg-[#e8492a] rounded-tr-3xl rounded-tl-3xl rounded-bl-3xl"
            : "items-start bg-[#faf6f9] rounded-tl-3xl rounded-tr-3xl rounded-br-3xl border border-gray-200"
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
        <p className="text-gray-500 font-karla text-sm">
          {sendingMessage === message.content
            ? "Sending..."
            : new Intl.DateTimeFormat("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(Number(message.timestamp)))}
        </p>
        <FaCheckDouble className="w-4 h-4 text-gray-500" />
      </div>
    </div>
  );
}

export default GroupMessageBubble;
