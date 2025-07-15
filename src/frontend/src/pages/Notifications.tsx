import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import NotificationCard from "@/components/app/dashboard/NotificationCard";
import { useNotifications } from "../../hooks/useNotifications";
import Loading from "@/components/ui/Loading";
import { Button } from "@/components/ui/button";

function Notifications() {
  const [active, setActive] = useState<"all" | "messages">("all");
  const { notifications, isLoading } = useNotifications();
  const [sliceIndex, setSliceIndex] = useState(4);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="max-w-[800px] mx-auto my-0">
      <h1 className="text-2xl font-karla-bold text-primary">Notifications</h1>
      <p className="text-gray-500 text-sm font-karla">
        Stay updated with your latest DMs and notifications.
      </p>
      <div className="rounded-2xl bg-[#faf9f6] p-2 my-4 flex items-center justify-between border border-gray-200">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex items-center justify-center gap-1 cursor-pointer rounded-2xl p-2 px-4 w-20 ",
              active === "all" ? "bg-[#e8492a] text-[#faf6f9]" : "text-gray-500"
            )}
            onClick={() => setActive("all")}
          >
            <h1 className=" text-sm font-karla">All</h1>
          </div>
          <div
            className={cn(
              "flex items-center justify-center gap-1 cursor-pointer rounded-2xl p-2 px-4 w-20",
              active === "messages"
                ? "bg-[#e8492a] text-[#faf6f9]"
                : "text-gray-500"
            )}
            onClick={() => setActive("messages")}
          >
            <h1 className=" text-sm font-karla">Messages</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-2xl p-2 px-4 border border-gray-200 cursor-pointer">
          <IoCheckmarkDoneOutline className="text-primary text-xl" />
          <h1 className="text-gray-500 text-sm font-karla">Mark all as read</h1>
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <h1 className="text-gray-500 text-sm font-karla">Today</h1>
        <div className="flex flex-col-reverse gap-4">
          {notifications.today.slice(0, sliceIndex).map((notification) => (
            <NotificationCard
              key={notification.notificationId}
              notification={notification}
            />
          ))}
        </div>
        {notifications.today.length > 4 &&
          sliceIndex !== notifications.today.length && (
            <div className="flex items-center justify-center h-full gap-4">
              <h1 className="text-gray-500 text-sm font-karla">
                +{notifications.today.length - 4} more
              </h1>
              <div className="h-1 w-1 bg-gray-500 rounded-full" />
              <p
                className="border-none text-gray-500 text-sm font-karla cursor-pointer"
                onClick={() => setSliceIndex(notifications.today.length)}
              >
                View all
              </p>
            </div>
          )}
        {sliceIndex === notifications.today.length && (
          <div className="flex items-center justify-center h-full gap-4">
            <h1 className="text-gray-500 text-sm font-karla">
              No more notifications
            </h1>
            <div className="h-1 w-1 bg-gray-500 rounded-full" />
            <p
              className="border-none text-gray-500 text-sm font-karla cursor-pointer"
              onClick={() => setSliceIndex(4)}
            >
              View less
            </p>
          </div>
        )}
        {notifications.today.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <h1 className="text-gray-500 text-sm font-karla">
              No new notifications
            </h1>
          </div>
        )}
        <h1 className="text-gray-500 text-sm font-karla">Older</h1>
        {notifications.older.slice(0, 4).map((notification) => (
          <NotificationCard
            key={notification.notificationId}
            notification={notification}
          />
        ))}
        {notifications.older.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <h1 className="text-gray-500 text-sm font-karla">
              No older notifications
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
