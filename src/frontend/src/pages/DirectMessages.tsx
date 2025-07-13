import { useChatIsMobile } from "../../hooks/useChatIsMobile";
import React from "react";
import ChatSidebar from "../components/app/chats/ChatSidebar";
import ChatWindow from "../components/app/chats/ChatWindow";
import { cn } from "@/lib/utils";

type selectedChatId = string | null;

const selectedChatIdMock: selectedChatId = "1";

function DirectMessages() {
  const isMobile = useChatIsMobile();
  return (
    <div className="flex h-screen w-full ">
      <div
        className={cn(
          "w-full lg:w-[40%]",
          isMobile && selectedChatIdMock ? "hidden" : "block"
        )}
      >
        <ChatSidebar />
      </div>
      <div
        className={cn(
          "w-full lg:w-[60%]",
          isMobile && !selectedChatIdMock ? "hidden" : "block"
        )}
      >
        <ChatWindow />
      </div>
    </div>
  );
}

export default DirectMessages;
