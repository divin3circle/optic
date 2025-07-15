import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { FaPlus } from "react-icons/fa";
import CreateRoomModal from "./CreateRoomModal";
import { useState } from "react";

function ChatSearchbar() {
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);

  if (isCreateRoomModalOpen) {
    return (
      <CreateRoomModal setIsCreateRoomModalOpen={setIsCreateRoomModalOpen} />
    );
  }
  const handleCreateRoom = () => {
    setIsCreateRoomModalOpen(true);
  };
  return (
    <div className="flex items-center justify-between bg-[#faf6f9] rounded-3xl p-2 py-4 w-full h-20">
      <h1 className="text-primary font-karla text-lg font-bold">Chats</h1>
      <div className="bg-white rounded-full flex items-center justify-between border border-gray-200">
        <Input
          placeholder="Search"
          className="rounded-full border-none shadow-none h-10 w-3/4 focus-visible:ring-0 focus-visible:ring-offset-0 text-primary font-karla placeholder:text-primary/50"
        />
        <Button variant="ghost" size="icon" className="mx-2">
          <SearchIcon className="w-3 h-3 text-primary" />
        </Button>
      </div>
      <button
        onClick={handleCreateRoom}
        className="bg-[#e8492a] text-[#faf6f9] p-3 rounded-full"
      >
        <FaPlus className="w-5 h-5 " />
      </button>
    </div>
  );
}

export default ChatSearchbar;
