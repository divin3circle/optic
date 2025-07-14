import React from "react";
import ChatSearchbar from "./ChatSearchbar";
import ChatList from "./ChatList";

function ChatSidebar() {
  return (
    <div className="flex flex-col gap-2 p-2 h-full overflow-y-auto">
      <ChatSearchbar />
      <ChatList />
    </div>
  );
}

export default ChatSidebar;
