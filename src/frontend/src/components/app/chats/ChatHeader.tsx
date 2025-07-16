import { Button } from "@/components/ui/button";
import dummy from "../../../../assets/images/message.webp";
import { FaAngleLeft, FaPlus } from "react-icons/fa";
import { useState } from "react";
import CreateRoomModal from "./CreateRoomModal";
import useChatStore from "../../../../store/chats.js";
import { motion } from "framer-motion";

function ChatHeader() {
  const { setSelectedChatId, chatHeaderProps } = useChatStore();
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
            onClick={() => setSelectedChatId(null)}
          />
        </div>
        <div className="relative">
          <img
            src={chatHeaderProps?.profileImage || dummy}
            alt={chatHeaderProps?.username || "user"}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover"
          />
          {chatHeaderProps?.chatStatus === "online" && (
            <div className="absolute bottom-2 right-1 bg-green-500 w-2 h-2 rounded-full"></div>
          )}
          {chatHeaderProps?.chatStatus === "offline" && (
            <div className="absolute bottom-2 right-1 bg-gray-500 w-2 h-2 rounded-full"></div>
          )}
        </div>
        <div className="flex flex-col">
          <h1 className="text-gray-700 text-lg font-karla-semi-bold">
            {chatHeaderProps?.username}
          </h1>
          <p className="text-gray-500 text-sm font-karla">
            {chatHeaderProps?.chatStatus.toLowerCase()}
          </p>
        </div>
      </div>
      <div className="md:flex hidden items-center justify-between gap-2">
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
    </motion.div>
  );
}

export default ChatHeader;
