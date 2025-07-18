import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { NotificationImages } from "../../../../types/user.js";
import { WiMoonAltNew } from "react-icons/wi";
import { Notification } from "../../../../types/user.js";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button.js";
import { FaCheck } from "react-icons/fa";
import { backend } from "../../../../utils/index.js";
import { useState } from "react";
import { toast } from "sonner";
import { LoadingSmall } from "@/components/ui/Loading.js";
import useUserStore from "../../../../store/user.js";

function NotificationCard({ notification }: { notification: Notification }) {
  const { user } = useUserStore();
  const [inviteSent, setInviteSent] = useState(false);

  const [loading, setLoading] = useState(false);
  function getNotificationImage(notification: Notification) {
    switch (notification.type) {
      case "message":
        return NotificationImages.message;
      case "proposal":
        return NotificationImages.agent;
      case "system":
        return NotificationImages.system;
      default:
        return NotificationImages.system;
    }
  }

  const handleNotificationAction = async () => {
    if (!user) return;
    if (!notification.data[0] || notification.data[0].length === 0) {
      toast.error("Invalid Room ID");
      return;
    }

    setLoading(true);
    if (notification.type === "message") {
      // TODO: mark as read
    } else if (notification.type === "proposal") {
      // TODO: accept proposal
    } else {
      try {
        const result = await backend.join_group_chat(
          notification.data[0],
          user.id
        );
        if (result) {
          setInviteSent(true);
        }
        console.log(result);
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error("An error occurred. Try again later.");
      }
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      exit={{ opacity: 0, y: 100 }}
      className="bg-[#faf9f6] rounded-3xl border border-gray-200 p-4 flex items-center gap-2 relative cursor-pointer hover:bg-[#fff] transition-all duration-300"
    >
      <img
        src={getNotificationImage(notification)}
        alt="dummy"
        className="w-14 h-14 rounded-xl"
      />
      <div className="flex flex-col">
        <h1 className="text-primary text-lg font-karla-bold">
          {notification.title}
        </h1>
        <p className="text-gray-500 text-sm font-karla">
          {notification.message}
        </p>
        <p className="text-gray-500 text-xs font-karla ">
          {new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date(Number(notification.timestamp)))}
        </p>
      </div>
      {!inviteSent && (
        <div className="absolute right-2 top-1/2">
          <Button
            variant="ghost"
            className="text-gray-500 border-[#e8492a] border-2 hover:bg-transparent rounded-xl font-karla-semi-bold"
            onClick={handleNotificationAction}
            disabled={loading}
          >
            {notification.type === "message" && !loading
              ? "Mark as Read"
              : loading
              ? "Loading..."
              : "Accept"}
            {loading && <LoadingSmall />}
          </Button>
        </div>
      )}
      {inviteSent && (
        <div className="absolute right-2 top-1/2">
          <p className="text-gray-500 text-sm font-karla">
            Invitation accepted to join {notification.data[0]?.slice(0, 4)}...
            {notification.data[0]?.slice(-4)}
          </p>
        </div>
      )}

      <WiMoonAltNew className="text-[#e8492a] text-sm absolute right-2 top-2" />
    </motion.div>
  );
}

export default NotificationCard;
