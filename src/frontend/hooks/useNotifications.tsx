import { useState } from "react";
import { useEffect } from "react";
import useUserStore from "../store/user.js";
import { Notification } from "../types/user.js";

type NotificationReturn = {
  today: Notification[];
  older: Notification[];
};

export function useNotifications() {
  const user = useUserStore((state) => state.user);
  const allNotifications = user?.notifications;
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationReturn>({
    today: [],
    older: [],
  });

  useEffect(() => {
    const categorizeNotifications = async () => {
      setIsLoading(true);
      if (allNotifications) {
        const categorizedNotifications = await categorizeOlderNotifications(
          allNotifications
        );
        setNotifications(categorizedNotifications);
      }
      setIsLoading(false);
    };
    categorizeNotifications();
  }, [allNotifications]);

  return { notifications, isLoading };
}

async function categorizeOlderNotifications(
  notifications: Notification[]
): Promise<NotificationReturn> {
  const todayTimestamp = Date.now() / 1000;
  const todayNotifications = notifications.filter((notification) => {
    const notificationTimestamp = Number(notification.timestamp);
    return notificationTimestamp >= todayTimestamp;
  });
  const olderNotifications = notifications.filter((notification) => {
    const notificationTimestamp = Number(notification.timestamp);
    return notificationTimestamp < todayTimestamp;
  });
  return { today: todayNotifications, older: olderNotifications };
}
