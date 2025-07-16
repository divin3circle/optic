import React from "react";
import GroupHeader from "./GroupHeader";
import GroupMessageList from "./GroupMessageList";

function GroupChatWindow() {
  return (
    <div className="flex flex-col gap-2 md:p-2 h-full ">
      <GroupHeader />
      <GroupMessageList />
    </div>
  );
}

export default GroupChatWindow;
