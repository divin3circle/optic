import GroupItem from "./GroupItem";
import Loading from "@/components/ui/Loading";
import { useGroupChatRooms } from "../../../../hooks/useGroupChatRooms";

function GroupList() {
  const { groupChatRooms, isLoading } = useGroupChatRooms();

  if (isLoading) {
    return <Loading />;
  }

  if (!groupChatRooms) {
    return (
      <div className="flex flex-col gap-2 p-2 h-full overflow-y-auto">
        <h1 className="text-gray-500 text-lg font-karla">No personal chats</h1>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#faf6f9] rounded-3xl p-2">
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex flex-col gap-2">
          {groupChatRooms.map((groupChatRoom) => (
            <GroupItem
              key={groupChatRoom.chatRoom[0].id}
              name={groupChatRoom.chatRoom[0].name}
              members={groupChatRoom.chatRoom[0].members.length}
              profileImage={groupChatRoom.chatRoom[0].profileImage}
              treasuryToken={groupChatRoom.chatRoom[0].treasury.token}
              id={groupChatRoom.chatRoom[0].id}
              room={groupChatRoom.chatRoom[0]}
            />
          ))}
          {groupChatRooms.length === 0 && (
            <div className="flex flex-col gap-2">
              <h1 className="text-gray-500 text-lg font-karla">
                No group chats
              </h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GroupList;
