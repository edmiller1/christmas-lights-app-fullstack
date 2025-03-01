"use client";

import { BadgeCheck, LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserMenu } from "./user-menu";
import { User } from "@/lib/types";

interface SidebarItem {
  href: string;
  icon: LucideIcon;
  text: string;
}

interface SidebarCategory {
  category: string;
  items: SidebarItem[];
}

const sidebarItems: SidebarCategory[] = [
  {
    category: "Overview",
    items: [
      { href: "/dashboard", icon: Home, text: "Dashboard" },
      {
        href: "/dashboard/verifications",
        icon: BadgeCheck,
        text: "Verifications",
      },
    ],
  },
  {
    category: "Account",
    items: [{ href: "/dashboard/upgrade", icon: Sparkles, text: "Upgrade" }],
  },
  {
    category: "Settings",
    items: [
      {
        href: "/dashboard/account-settings",
        icon: Settings,
        text: "Account Settings",
      },
    ],
  },
];

interface Props {
  user: User | null;
}

export const DashboardSidebar = ({ user }: Props) => {
  const pathname = usePathname();

  // if (loading) {
  //   return (
  //     <Sidebar>
  //       <SidebarHeader>
  //         <Skeleton className="w-full h-12" />
  //       </SidebarHeader>
  //       <SidebarContent>
  //         <SidebarGroup>
  //           <SidebarMenu className="mt-5">
  //             {Array.from([1, 2, 3]).map((_, index) => (
  //               <div className="mb-4 md:mb-8" key={index}>
  //                 <Skeleton className="w-full h-8" />
  //               </div>
  //             ))}
  //           </SidebarMenu>
  //         </SidebarGroup>
  //       </SidebarContent>
  //       <SidebarFooter>
  //         <Skeleton className="w-full h-20" />
  //       </SidebarFooter>
  //     </Sidebar>
  //   );
  // }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            width={100}
            height={100}
            alt="logo"
            className="h-12 w-12"
            priority
          />
          <p className="font-semibold">Christmas Lights App</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {sidebarItems.map(({ category, items }) => (
              <div key={category} className="mb-4 md:mb-8">
                <p className="text-sm font-medium leading-6 text-zinc-500">
                  {category}
                </p>
                <div>
                  {items.map((item, i) => (
                    <SidebarMenuItem key={i}>
                      <Link
                        href={item.href}
                        className={cn(
                          buttonVariants({ variant: "ghost" }),
                          "group flex w-full items-center justify-start gap-x-2.5 rounded-md my-1 px-2 py-1.5 text-sm font-medium leading-6",
                          {
                            "bg-sidebar-accent text-sidebar-accent-foreground":
                              pathname === item.href,
                          }
                        )}
                      >
                        <item.icon className="size-4" />
                        {item.text}
                      </Link>
                    </SidebarMenuItem>
                  ))}
                </div>
              </div>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserMenu user={user!} />
      </SidebarFooter>
    </Sidebar>
  );
};
