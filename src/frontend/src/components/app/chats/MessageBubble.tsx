import React from "react";
import { cn } from "@/lib/utils";
import { FaCheckDouble } from "react-icons/fa6";

function MessageBubble({ isSender }: { isSender: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-col w-full my-2",
        isSender ? "items-end" : "items-start"
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-2 w-3/4 md:w-1/4 py-3 px-2",
          isSender
            ? "items-start bg-[#e8492a] rounded-tr-3xl rounded-tl-3xl rounded-bl-3xl"
            : "items-start bg-[#faf6f9] rounded-tl-3xl rounded-tr-3xl rounded-br-3xl border border-gray-200"
        )}
      >
        <h1
          className={cn(
            "text-white font-karla text-lg",
            isSender ? "text-white" : "text-primary"
          )}
        >
          Hey, how are you?
        </h1>
      </div>
      <div
        className={cn(
          "flex items-center gap-2",
          isSender ? "justify-end" : "justify-start flex-row-reverse"
        )}
      >
        <p className="text-gray-500 font-karla text-sm">12:00 PM</p>
        <FaCheckDouble className="w-4 h-4 text-gray-500" />
      </div>
    </div>
  );
}

export default MessageBubble;
