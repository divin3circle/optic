import { FaCog } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { IoIosNotifications } from "react-icons/io";
import { FaUsers } from "react-icons/fa";
import { FaWallet } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import logo from "../../../../assets/images/icon.png";
import { Button } from "@/components/ui/button";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <FaHome className="text-[#faf9f6] text-2xl" />,
  },
  {
    title: "Notifications",
    url: "/dashboard/notifications",
    icon: <IoIosNotifications size={64} className="text-[#faf9f6]" />,
  },
  {
    title: "Messages",
    url: "/dashboard/messages",
    icon: <FaMessage size={64} className="text-[#faf9f6]" />,
  },
  {
    title: "Groups",
    url: "/dashboard/groups",
    icon: <FaUsers size={64} className="text-[#faf9f6]" />,
  },
  {
    title: "Settings",
    url: "/dashboard/profile",
    icon: <FaUser size={64} className="text-[#faf9f6]" />,
  },
  {
    title: "Wallet",
    url: "/dashboard/wallet",
    icon: <FaWallet size={64} className="text-[#faf9f6]" />,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-none py-2">
      <SidebarContent className="md:ml-4 border-2 border-[#17181c] md:rounded-3xl bg-[#17181c] my-0 md:my-4">
        <SidebarGroup className="h-full flex flex-col justify-between py-12 ">
          <SidebarGroupLabel className="flex items-center justify-center mb-4">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              exit={{ opacity: 0, y: 100 }}
              className="flex items-center flex-col justify-center p-2 rounded-3xl cursor-pointer"
            >
              <img src={logo} alt="logo" className="w-10 h-10" />
              <h1 className="text-2xl font-karla-bold text-[#faf9f6]">Optic</h1>
            </motion.div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-8">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="flex items-center md:justify-start justify-center hover:bg-[#e8492a] hover:text-[#faf9f6] rounded-3xl selection:bg-[#e8492a]"
                  >
                    <a href={item.url} className="text-2xl">
                      {item.icon}
                      <span className="font-karla text-md text-[#faf9f6] hidden md:block">
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarGroupLabel className="flex flex-col gap-2 mb-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-3xl bg-[#e8492a] text-[#faf9f6] border-none w-full"
            >
              <FaSignOutAlt />
            </Button>
          </SidebarGroupLabel>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
