import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { GrEmoji } from "react-icons/gr";
import { Button } from "@/components/ui/button";
import { AiOutlineSend } from "react-icons/ai";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EMOJI_TYPES } from "../../../../mock/emojis";
import useChatStore from "../../../../store/chats";
import { backend } from "../../../../utils";
import { Principal } from "@dfinity/principal";
import { useQueryClient } from "@tanstack/react-query";
import { PersonalMessage } from "../../../../types/user";
import { toast } from "sonner";
import useUserStore from "../../../../store/user";

function GroupMessageInputBar() {
  const user = useUserStore((state) => state.user);
  const {
    setMessageBeingSent,
    chatHeaderProps,
    setSendingMessage,
    sendingMessage,
  } = useChatStore();
  const { selectedGroupChatId } = useChatStore();
  const [userMessage, setUserMessage] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const queryClient = useQueryClient();

  async function handleSendMessage() {
    if (!selectedGroupChatId) {
      console.error("No chat selected");
      return;
    }
    if (userMessage.length === 0) {
      console.error("No message to send");
      return;
    }
    if (!chatHeaderProps) {
      console.error("No chat header props");
      return;
    }
    if (userMessage.length > 100) {
      toast.error("Message must be less than 100 characters");
      return;
    }
    if (!user) {
      console.error("User not found");
      return;
    }

    try {
      setSendingMessage(userMessage);
      const tempMessage = {
        receiver: selectedGroupChatId,
        messageId: `temp-${Date.now()}`, // Give it a temporary ID
        content: userMessage,
        timestamp: BigInt(Date.now()),
        read: false,
      };

      // Optimistically update the cache
      queryClient.setQueryData(
        ["group-messages", selectedGroupChatId],
        (oldMessages: PersonalMessage[] = []) => [...oldMessages, tempMessage]
      );

      setMessageBeingSent(tempMessage);

      const sent = await backend.send_group_message(
        selectedGroupChatId,
        userMessage,
        user.id
      );

      // Invalidate to refetch and get the real message from backend
      queryClient.invalidateQueries({
        queryKey: ["group-messages", selectedGroupChatId],
      });
    } catch (error) {
      // On error, remove the optimistic message
      queryClient.setQueryData(
        ["group-messages", selectedGroupChatId],
        (oldMessages: PersonalMessage[] = []) =>
          oldMessages.filter((msg) => msg.messageId !== `temp-${Date.now()}`)
      );
    } finally {
      setUserMessage("");
      setSendingMessage(null);
      setMessageBeingSent(null);
    }
  }

  return (
    <div className="sticky bottom-0 left-0 right-0 p-2 flex items-center justify-between gap-2 border border-gray-200 rounded-3xl shadow-2xl backdrop-blur-2xl ">
      <div className="flex items-center justify-between border border-gray-300 rounded-3xl bg-white w-full px-4">
        <Input
          placeholder="Write something"
          className="border-none shadow-none text-primary h-12"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Popover>
          <PopoverTrigger>
            <GrEmoji className="text-primary w-6 h-6" />
          </PopoverTrigger>
          <PopoverContent className="w-full bg-white rounded-3xl h-[300px] overflow-y-scroll scrollbar-hide">
            <div className="flex flex-col gap-2">
              {EMOJI_TYPES.map((emoji) => (
                <div key={emoji.id} className="flex flex-col gap-2">
                  <h1 className="text-primary font-karla text-sm">
                    {emoji.id}
                  </h1>
                  <div className="grid grid-cols-6 gap-2">
                    {emoji.emojis.map((emoji) => (
                      <div
                        key={emoji}
                        className="text-primary font-karla text-lg cursor-pointer"
                        onClick={() => {
                          setUserMessage(userMessage + emoji);
                        }}
                      >
                        {emoji}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="">
        <Button
          className="bg-[#e8492a] border-[#e8492a] border-2 rounded-2xl hover:bg-transparent hover:text-primary py-4"
          onClick={handleSendMessage}
          disabled={userMessage.length === 0}
        >
          <AiOutlineSend className="w-10 h-10 " />
        </Button>
      </div>
    </div>
  );
}

export default GroupMessageInputBar;
