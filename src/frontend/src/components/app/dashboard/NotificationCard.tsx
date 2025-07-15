import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { NotificationImages } from "../../../../types/user.js";
import { WiMoonAltNew } from "react-icons/wi";
import { Notification } from "../../../../types/user.js";
import { motion } from "framer-motion";

function NotificationCard({ notification }: { notification: Notification }) {
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

      <WiMoonAltNew className="text-[#e8492a] text-sm absolute right-2 top-2" />
    </motion.div>
  );
}

export default NotificationCard;
