import { SidebarProvider } from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "./components/dashboard-sidebar";
import { MotionWrapper } from "@/components/motion-wrapper";
import { DashboardNavbar } from "./components/dashboard-navbar";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/sign-in");
  }

  return (
    <MotionWrapper>
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <DashboardSidebar auth={data.user} />
          <div className="flex flex-1 flex-col overflow-hidden">
            <DashboardNavbar />
            <main className="flex-1 overflow-y-auto p-4">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </MotionWrapper>
  );
};

export default Layout;
