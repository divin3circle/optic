import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { FaX } from "react-icons/fa6";
import { backend } from "../../../../utils";
import { User } from "../../../../types/user";
import { LoadingSmall } from "@/components/ui/Loading";
import successAnimation from "../../../../assets/lottie/success.json";
import Lottie from "lottie-react";
import { cn } from "@/lib/utils";
import useUserStore from "../../../../store/user";
import { motion } from "framer-motion";
import useChatStore from "../../../../store/chats";
import { Principal } from "@dfinity/principal";

function InviteMemberModal({
  setIsCreateRoomModalOpen,
}: {
  setIsCreateRoomModalOpen: (isOpen: boolean) => void;
}) {
  const { selectedGroupChatId } = useChatStore();
  const user = useUserStore((state) => state.user);
  const [search, setSearch] = useState("");
  const [step, setStep] = useState(1);
  const [searchResults, setSearchResults] = useState<User[] | null>(null);
  const [receiver, setReceiver] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [roomCreationLoading, setRoomCreationLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await backend.get_user_by_username(search);
      setSearchResults(results as User[]);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleCreateRoom = async () => {
    if (!receiver || !user || !selectedGroupChatId) return;
    setRoomCreationLoading(true);
    try {
      const results = await backend.send_invite(
        selectedGroupChatId,
        Principal.fromText(receiver.id)
      );
      if (results) {
        setStep(3);
      } else {
        setStep(1);
      }
    } catch (error) {
      console.error(error);
    }
    setRoomCreationLoading(false);
  };
  return (
    <div className="flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed inset-0 flex items-center justify-center backdrop-blur-2xl bg-black/70 md:bg-black/80 z-50"
      >
        {step === 1 && (
          <div className="bg-[#faf6f9] border border-gray-200 rounded-3xl p-4 w-full max-w-md mx-1 mb-2">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-karla-bold text-primary ">
                Find a user
              </h1>
              <FaX
                className="text-sm text-gray-500 cursor-pointer"
                onClick={() => setIsCreateRoomModalOpen(false)}
              />
            </div>
            <div className="bg-white rounded-full flex items-center justify-between border border-gray-200">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="rounded-full border-none shadow-none h-10 w-3/4 focus-visible:ring-0 focus-visible:ring-offset-0 text-primary font-karla placeholder:text-primary/50"
              />
              <Button
                variant="ghost"
                size="icon"
                className="mx-2"
                onClick={handleSearch}
              >
                <SearchIcon className="w-3 h-3 text-primary" />
              </Button>
            </div>
            {!loading && !searchResults && (
              <div className="flex items-center justify-center">
                <h1 className="text-sm text-gray-400 my-4 font-karla-semi-bold">
                  Start typing to search
                </h1>
              </div>
            )}
            {loading && <LoadingSmall />}
            {searchResults && (
              <div className="flex flex-col gap-2">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center justify-between bg-white rounded-3xl p-2 border border-gray-200 my-4 cursor-pointer"
                    onClick={() => {
                      setReceiver(result);
                      setStep(2);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={result.profileImage}
                        alt={result.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />{" "}
                      <h1 className="text-sm font-karla-semi-bold text-primary">
                        {result.username}
                      </h1>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm text-gray-500">
                        {result.id.toString().slice(0, 6)}...
                        {result.id.toString().slice(0, 6)}...
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {step === 2 && (
          <div className="bg-[#faf6f9] border border-gray-200 rounded-3xl p-4 w-full max-w-md mx-1 mb-2">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-karla-bold text-primary ">
                Invite {receiver?.username}
              </h1>
              <FaX
                className="text-sm text-gray-500 cursor-pointer"
                onClick={() => setIsCreateRoomModalOpen(false)}
              />
            </div>
            <p className="text-sm text-gray-500 font-karla-semi-bold">
              Create a personal chat room with {receiver?.username}
            </p>
            <Button
              className={cn(
                "bg-[#e8492a] hover:bg-[#e8492a]/80 text-white font-karla-semi-bold rounded-3xl px-4 py-2 mt-4 w-full",
                roomCreationLoading && "hidden"
              )}
              onClick={handleCreateRoom}
            >
              Invite
            </Button>
            {roomCreationLoading && <LoadingSmall />}
          </div>
        )}
        {step === 3 && (
          <div className="bg-[#faf6f9] border border-gray-200 rounded-3xl p-4 w-full max-w-md mx-1 mb-2">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-karla-bold text-primary ">
                Invitation Sent
              </h1>
              <FaX
                className="text-sm text-gray-500 cursor-pointer"
                onClick={() => setIsCreateRoomModalOpen(false)}
              />
            </div>
            <Lottie animationData={successAnimation} loop={true} />
            <p className="text-sm text-gray-500 font-karla-semi-bold text-center">
              {receiver?.username} has been invited to the group!
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default InviteMemberModal;
