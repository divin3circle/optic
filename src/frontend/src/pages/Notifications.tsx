import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import NotificationCard from "@/components/app/dashboard/NotificationCard";
import useUserStore from "../../store/user";

function Notifications() {
  const [active, setActive] = useState<"all" | "messages">("all");
  const user = useUserStore((state) => state.user);
  console.log(user?.notifications);
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
        <NotificationCard />
        <h1 className="text-gray-500 text-sm font-karla">Older</h1>
      </div>
    </div>
  );
}

export default Notifications;
