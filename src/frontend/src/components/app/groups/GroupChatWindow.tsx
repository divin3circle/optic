import React from "react";
import GroupHeader from "./GroupHeader";
import GroupMessageList from "./GroupMessageList";
import useChatStore from "../../../../store/chats";
import GroupProfile from "./GroupProfile";

function GroupChatWindow() {
  const { viewingGroupProfile } = useChatStore();
  return (
    <div className="flex flex-col gap-2 md:p-2 h-full ">
      <GroupHeader />
      {viewingGroupProfile ? <GroupProfile /> : <GroupMessageList />}
    </div>
  );
}

export default GroupChatWindow;
