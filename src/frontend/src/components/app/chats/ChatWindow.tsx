import React from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";

function ChatWindow() {
  return (
    <div className="flex flex-col gap-2 md:p-2 h-full ">
      <ChatHeader />
      <MessageList />
    </div>
  );
}

export default ChatWindow;
