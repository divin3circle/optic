import React from "react";
import MessageBubble from "./MessageBubble";
import MessageInputBar from "./MessageInputBar";
import { motion } from "framer-motion";
import { usePersonalChats } from "../../../../hooks/useChats";
import useChatStore from "../../../../store/chats";
import Loading from "@/components/ui/Loading";
import { Button } from "@/components/ui/button";

function MessageList() {
  const { selectedChatId } = useChatStore();
  const { messages, isLoading } = usePersonalChats(selectedChatId);

  if (isLoading) {
    return <Loading />;
  }

  if (!messages) {
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
        <p className="text-gray-500 text-sm font-karla">Something went wrong</p>
        <Button variant="outline" className="w-full">
          Refresh
        </Button>
      </motion.div>
    );
  }

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
        {messages.length === 0 && (
          <div className="flex flex-col gap-2 items-center justify-center h-full">
            <p className="text-gray-500 text-sm font-karla">No messages</p>
          </div>
        )}
        {messages.length > 0 &&
          messages.map((message) => (
            <MessageBubble key={message.messageId} message={message} />
          ))}
      </div>
      <MessageInputBar />
    </motion.div>
  );
}

export default MessageList;
