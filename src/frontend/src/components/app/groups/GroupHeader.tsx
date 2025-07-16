import { Button } from "@/components/ui/button";
import dummy from "../../../../assets/images/message.webp";
import { FaAngleLeft, FaPlus } from "react-icons/fa";
import useChatStore from "../../../../store/chats.js";
import { motion } from "framer-motion";

function GroupHeader() {
  const { setSelectedGroupChatId, groupHeaderProps, setViewingGroupProfile } =
    useChatStore();
  return (
    <motion.div
      className="sticky top-0 z-10 md:flex items-center justify-between rounded-3xl bg-[#faf6f9] p-2 h-20 border border-gray-200"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      exit={{ opacity: 0, y: 100 }}
    >
      <div className="flex items-center gap-2">
        <div className="flex md:hidden items-center gap-2">
          <FaAngleLeft
            className="w-6 h-6 text-primary"
            onClick={() => setSelectedGroupChatId(null)}
          />
        </div>
        <div className="relative">
          <img
            src={groupHeaderProps?.profileImage || dummy}
            alt={groupHeaderProps?.name || "user"}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover"
          />
        </div>
        <div
          className="flex flex-col cursor-pointer"
          onClick={() => setViewingGroupProfile(true)}
        >
          <h1 className="text-gray-700 text-lg font-karla-semi-bold underline">
            {groupHeaderProps?.name}
          </h1>
          <p className="text-gray-500 text-sm font-karla">
            {groupHeaderProps?.members.length}{" "}
            {groupHeaderProps?.members.length === 1 ? "member" : "members"}
          </p>
        </div>
      </div>
      <div className="md:flex hidden items-center justify-between gap-2">
        <div className="flex items-end justify-end flex-col gap-2">
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
    </motion.div>
  );
}

export default GroupHeader;
