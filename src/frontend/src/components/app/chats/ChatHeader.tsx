import { Button } from "@/components/ui/button";
import dummy from "../../../../assets/images/message.webp";
import {
  FaEllipsisH,
  FaFlag,
  FaPhone,
  FaPlus,
  FaSearch,
  FaTrash,
  FaVideo,
  FaVolumeMute,
} from "react-icons/fa";

import { FaBan } from "react-icons/fa6";

const options = [
  {
    label: "Delete Chat",
    icon: <FaTrash className="w-4 h-4 text-[#e8492a]" />,
  },
  {
    label: "Report",
    icon: <FaFlag className="w-4 h-4 text-[#e8492a]" />,
  },
  {
    label: "Block User",
    icon: <FaBan className="w-4 h-4 text-[#e8492a]" />,
  },
  {
    label: "Mute",
    icon: <FaVolumeMute className="w-4 h-4 text-[#e8492a]" />,
  },
];

function ChatHeader() {
  return (
    <div className="flex items-center justify-between rounded-3xl bg-[#faf6f9] p-2 h-20">
      <div className="flex items-center gap-2">
        <div className="relative">
          <img src={dummy} alt="dummy" className="w-16 h-16 rounded-full" />
          <div className="absolute bottom-2 right-1 bg-green-500 w-2 h-2 rounded-full"></div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-gray-700 text-lg font-karla-semi-bold">
            Chat Item
          </h1>
          <p className="text-gray-500 text-sm font-karla">Online</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="border border-primary text-primary rounded-full"
          >
            Profile
          </Button>
          <Button
            variant="ghost"
            className="bg-primary hover:bg-primary/90 rounded-full"
          >
            <FaPlus className="w-4 h-4 text-[#faf6f9]" />
            <span className="text-[#faf6f9] text-sm font-karla-semi-bold">
              Invite
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
