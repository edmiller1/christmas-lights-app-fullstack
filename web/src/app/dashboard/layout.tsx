import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./components/dashboard-sidebar";
import { MotionWrapper } from "@/components/motion-wrapper";
import { DashboardNavbar } from "./components/dashboard-navbar";
import { redirect } from "next/navigation";
import { getServerUser } from "@/hooks/getServerUser";
import { Suspense } from "react";
import { LottieAnimation } from "@/components/lottie-animation";
import christmasLoader from "../../lottie/christmas-loader.json";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getServerUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen md:min-h-[90vh] flex justify-center items-center">
          <LottieAnimation animationData={christmasLoader} autoplay loop />
        </div>
      }
    >
      <MotionWrapper>
        <SidebarProvider>
          <div className="flex h-screen w-full">
            <DashboardSidebar user={user} />
            <div className="flex flex-1 flex-col overflow-hidden">
              <DashboardNavbar />
              <main className="flex-1 overflow-y-auto p-4">{children}</main>
            </div>
          </div>
        </SidebarProvider>
      </MotionWrapper>
    </Suspense>
  );
};

export default Layout;
