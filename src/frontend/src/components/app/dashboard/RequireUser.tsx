import React from "react";
import useUserStore from "../../../../store/user";
import { useUser } from "../../../../hooks/useUser";
import Loading from "@/components/ui/Loading";
import { useLocation } from "react-router-dom";
import SettingsSkeleton from "@/skeletons/settings";
import HomeSkeleton from "@/skeletons/home";

const RequireUser: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useUserStore((state) => state.user);
  const { pathname } = useLocation();

  const { loading } = useUser();

  if (loading) return <Loading />;
  if (!user) {
    switch (pathname) {
      case "/dashboard/settings":
        return <SettingsSkeleton />;
      default:
        return <HomeSkeleton />;
    }
  }

  return <>{children}</>;
};

export default RequireUser;
