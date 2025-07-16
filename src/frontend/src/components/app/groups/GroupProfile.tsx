import { motion } from "framer-motion";
import React from "react";
import useChatStore from "../../../../store/chats";
import { FaEllipsisH, FaHandHoldingUsd, FaPlus } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";
import GroupMembersView from "./GroupMembersView";
import { Button } from "@/components/ui/button";
import GroupTreasury from "./GroupTreasury";

function GroupProfile() {
  const { groupHeaderProps, setViewingGroupProfile } = useChatStore();
  if (!groupHeaderProps) {
    return null;
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      exit={{ opacity: 0, y: 100 }}
      className="h-full w-full rounded-3xl bg-[#fff] p-0 md:p-2 flex flex-col gap-2 hide-scrollbar"
      style={{
        scrollbarColor: "#faf6f9",
      }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between mt-4">
          <ArrowLeft
            className="w-6 h-6 text-gray-500 cursor-pointer"
            onClick={() => setViewingGroupProfile(false)}
          />
          <img
            src={groupHeaderProps.profileImage}
            alt="Group Profile"
            className="w-24 h-24 rounded-full"
          />
          <FaEllipsisH className="w-4 h-4 text-gray-500" />
        </div>
        <div className="flex items-end justify-between md:justify-center gap-2 mt-4 px-2">
          <Button
            variant="ghost"
            className="bg-primary hover:bg-primary/90 rounded-full w-1/2 md:w-1/4"
          >
            <FaPlus className="w-4 h-4 text-[#faf6f9]" />
            <span className="text-[#faf6f9] text-sm font-karla-semi-bold">
              Invite
            </span>
          </Button>
          <Button
            variant="ghost"
            className="bg-[#e8492a] hover:bg-[#e8492a]/90 rounded-full w-1/2 md:w-1/4"
          >
            <FaHandHoldingUsd className="w-4 h-4 text-[#faf6f9]" />
            <span className="text-[#faf6f9] text-sm font-karla-semi-bold">
              Contribute
            </span>
          </Button>
        </div>
        <div className="flex flex-col items-center mt-4">
          <h1 className="text-primary text-2xl font-karla-semi-bold">
            {groupHeaderProps.name}
          </h1>
          <p className="text-gray-500 text-sm font-karla">
            {groupHeaderProps.members.length}{" "}
            {groupHeaderProps.members.length === 1 ? "member" : "members"}
          </p>
        </div>
        <div className="flex flex-col mt-4">
          <h1 className="text-xl text-primary font-karla-semi-bold">
            Description
          </h1>
          <p className="text-gray-500 text-sm font-karla">
            {groupHeaderProps.description}
          </p>
        </div>
        <div className="flex flex-col mt-4">
          <h1 className="text-xl text-primary font-karla-semi-bold">Members</h1>
          <GroupMembersView members={groupHeaderProps.members} />
        </div>
        <GroupTreasury />
      </div>
    </motion.div>
  );
}

export default GroupProfile;
