import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/dashboard/app-sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import Loading from "@/components/ui/Loading";
import { useAuth } from "@nfid/identitykit/react";

export default function Layout() {
  const { isConnecting } = useAuth();
  // const navigate = useNavigate();
  // const { currentUser, loading } = useUser();

  if (isConnecting) {
    return <Loading />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full p-2">
        <SidebarTrigger className="text-primary bg-amber-600" />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
