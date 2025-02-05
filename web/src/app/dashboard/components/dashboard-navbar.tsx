import { CreateButton } from "@/components/create-decoration/create-button";
import { NotificationMenu } from "@/components/notification-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const DashboardNavbar = () => {
  return (
    <nav className="border-b p-4">
      <div className="flex items-center justify-between">
        <SidebarTrigger />
        <div className="flex items-center gap-4 mr-5">
          <CreateButton />
          <NotificationMenu />
        </div>
      </div>
    </nav>
  );
};
