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

function MessageInputBar() {
  const [userMessage, setUserMessage] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("");
  return (
    <div className="sticky bottom-0 left-0 right-0 p-2 flex items-center justify-between gap-2 border border-gray-200 rounded-3xl shadow-2xl backdrop-blur-2xl ">
      <div className="flex items-center justify-between border border-gray-300 rounded-3xl bg-white w-full px-4">
        <Input
          placeholder="Write something"
          className="border-none shadow-none text-primary h-12"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
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
        <Button className="bg-[#e8492a] border-[#e8492a] border-2 rounded-2xl hover:bg-transparent hover:text-primary py-4">
          <AiOutlineSend className="w-10 h-10 " />
        </Button>
      </div>
    </div>
  );
}

export default MessageInputBar;
