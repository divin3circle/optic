import React from "react";
import MessageBubble from "./MessageBubble";
import MessageInputBar from "./MessageInputBar";
import { motion } from "framer-motion";

function MessageList() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      exit={{ opacity: 0, y: 100 }}
      className="h-full w-full rounded-3xl bg-[#faf6f9] p-0 md:p-2 flex flex-col gap-2 hide-scrollbar"
      style={{
        scrollbarColor: "#faf6f9",
      }}
    >
      <div className="flex flex-col gap-2 flex-1 overflow-y-scroll hide-scrollbar">
        <MessageBubble isSender={true} />
        <MessageBubble isSender={true} />
        <MessageBubble isSender={false} />
        <MessageBubble isSender={true} />
        <MessageBubble isSender={false} />
        <MessageBubble isSender={true} />
        <MessageBubble isSender={true} />
        <MessageBubble isSender={true} />
        <MessageBubble isSender={false} />
        <MessageBubble isSender={true} />
        <MessageBubble isSender={false} />
        <MessageBubble isSender={true} />
        <MessageBubble isSender={true} />
        <MessageBubble isSender={true} />
        <MessageBubble isSender={false} />
        <MessageBubble isSender={true} />
        <MessageBubble isSender={false} />
        <MessageBubble isSender={true} />
      </div>
      <MessageInputBar />
    </motion.div>
  );
}

export default MessageList;
