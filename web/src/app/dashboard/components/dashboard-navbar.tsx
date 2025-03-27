import { CreateButton } from "@/components/create-decoration/create-button";
import { NotificationMenu } from "@/components/notifications/notification-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";

export const DashboardNavbar = () => {
  return (
    <nav className="border-b p-4">
      <div className="flex items-center justify-between">
        <div>
          <SidebarTrigger />
          <Link href="/explore" className="ml-5 hover:underline">
            Explore
          </Link>
        </div>
        <div className="flex items-center gap-4 mr-5">
          <CreateButton />
          <NotificationMenu />
        </div>
      </div>
    </nav>
  );
};
