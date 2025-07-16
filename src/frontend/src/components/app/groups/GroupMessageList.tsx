import React from "react";
import MessageBubble from "./GroupMessageBubble";
import MessageInputBar from "./GroupMessageInputBar";
import { motion } from "framer-motion";
import { usePersonalChats } from "../../../../hooks/useChats";
import useChatStore from "../../../../store/chats";
import Loading from "@/components/ui/Loading";
import { Button } from "@/components/ui/button";
import { List, AutoSizer } from "react-virtualized";
import { useGroupChatMessages } from "../../../../hooks/useGroupChatRooms";

function GroupMessageList() {
  const { selectedGroupChatId } = useChatStore();
  const { messages, isLoading } = useGroupChatMessages(
    selectedGroupChatId,
    BigInt(100)
  );
  const listRef = React.useRef<List>(null);

  // Performance optimization: Only render visible messages

  // Scroll to bottom when new messages arrive
  React.useEffect(() => {
    if (listRef.current && messages && messages.length > 0) {
      listRef.current.scrollToRow(messages.length - 1);
    }
  }, [messages?.length]);

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
      <div className="flex flex-col gap-2 flex-1 overflow-hidden">
        {messages.length === 0 && (
          <div className="flex flex-col gap-2 items-center justify-center h-full">
            <p className="text-gray-500 text-sm font-karla">No messages</p>
          </div>
        )}
        {messages.length > 0 && (
          <div className="flex-1">
            <AutoSizer className="mb-12">
              {({ height, width }: { height: number; width: number }) => (
                <List
                  ref={listRef}
                  height={height}
                  width={width}
                  rowCount={messages.length}
                  rowHeight={({ index }: { index: number }) => {
                    // Estimate height based on message content length
                    const message = messages[index];
                    const baseHeight = 125; // Base height for message bubble
                    const contentLength = message.content.length;
                    const lines = Math.ceil(contentLength / 50); // Rough estimate: 50 chars per line
                    return Math.max(baseHeight, lines * 40 + 60); // 20px per line + padding
                  }}
                  rowRenderer={({
                    index,
                    key,
                    style,
                  }: {
                    index: number;
                    key: string;
                    style: React.CSSProperties;
                  }) => (
                    <div key={key} style={style} className="px-2">
                      <MessageBubble message={messages[index]} />
                    </div>
                  )}
                  overscanRowCount={5} // Render 5 extra rows above/below for smooth scrolling
                />
              )}
            </AutoSizer>
          </div>
        )}
      </div>
      <MessageInputBar />
    </motion.div>
  );
}

export default GroupMessageList;
