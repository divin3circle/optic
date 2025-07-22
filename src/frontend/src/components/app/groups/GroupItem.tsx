import dummy from "../../../../assets/images/message.webp";
import { ChatRoom, User } from "../../../../types/user";
import { PersonalMessage } from "../../../../types/user";
import useChatStore from "../../../../store/chats.js";

function GroupItem({
  name,
  members,
  profileImage,
  treasuryToken,
  id,
  room,
}: {
  name: string;
  members: number;
  profileImage: string;
  treasuryToken: string;
  id: string;
  room: ChatRoom;
}) {
  const { setSelectedGroupChatId, setGroupHeaderProps } = useChatStore();

  const handleClick = () => {
    setSelectedGroupChatId(id);
    setGroupHeaderProps(room);
  };

  return (
    <div
      onClick={handleClick}
      className="border-[.5px] border-gray-200 flex items-center justify-between gap-2 my-2 cursor-pointer bg-[#fff] rounded-3xl p-2 transition-all duration-300"
    >
      <div className="flex items-center gap-2">
        <img
          src={profileImage || dummy}
          alt="dummy"
          className="w-14 h-14 md:w-12 md:h-12 rounded-full object-cover border border-gray-200"
        />
        <div className="flex flex-col">
          <h1 className="text-gray-700 text-sm font-karla-semi-bold">{name}</h1>
          <p className="text-gray-500 text-xs font-karla">
            {members} {members === 1 ? "member" : "members"}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 justify-end items-end">
        <p className="text-gray-500 text-xs font-karla">
          {treasuryToken.toUpperCase()}
        </p>
      </div>
    </div>
  );
}

export default GroupItem;
