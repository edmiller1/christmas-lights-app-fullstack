import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export const SidebarLoading = () => {
  return (
    <Sidebar>
      <SidebarHeader>
        <Skeleton className="w-full h-12" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="mt-5">
            {Array.from([1, 2, 3]).map((_, index) => (
              <div className="mb-4 md:mb-8" key={index}>
                <Skeleton className="w-full h-8" />
              </div>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Skeleton className="w-full h-20" />
      </SidebarFooter>
    </Sidebar>
  );
};
