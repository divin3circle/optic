import { useChatIsMobile } from "../../hooks/useChatIsMobile";
import ChatWindow from "../components/app/chats/ChatWindow";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import logo from "../../assets/images/icon.png";
import useChatStore from "../../store/chats";
import GroupSidebar from "@/components/app/groups/GroupSidebar";

function Groups() {
  const isMobile = useChatIsMobile();
  const { selectedChatId } = useChatStore();

  return (
    <div className="flex h-screen w-full">
      {(!isMobile || !selectedChatId) && (
        <div className={cn("w-full lg:w-[40%]")}>
          <GroupSidebar />
        </div>
      )}

      {(!isMobile || selectedChatId) && (
        <div className={cn("w-full lg:w-[60%]")}>
          {selectedChatId ? (
            <ChatWindow />
          ) : (
            <div className="flex items-center justify-center flex-col h-full">
              <a>
                <motion.div
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  exit={{ opacity: 0, y: 100 }}
                  className="flex items-center justify-center gap-2  p-2 rounded-3xl cursor-pointer"
                >
                  <img src={logo} alt="logo" className="w-10 h-10" />
                  <h1 className="text-2xl font-karla-bold text-primary">
                    Optic
                  </h1>
                </motion.div>
              </a>
              <motion.h1
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                exit={{ opacity: 0, y: 100 }}
                className="text-gray-500 font-karla text-lg"
              >
                Select a chat to start messaging
              </motion.h1>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Groups;
