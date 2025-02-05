"use client";

import { LucideIcon } from "lucide-react";
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
import { Session } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { UserMenu } from "./user-menu";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  auth: Session | null;
}

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
    items: [{ href: "/dashboard", icon: Home, text: "Dashboard" }],
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

export const DashboardSidebar = ({ auth }: Props) => {
  const pathname = usePathname();

  const { data: user, isLoading } = useQuery({
    queryKey: ["get-user"],
    queryFn: async () => {
      return api.auth.getUser();
    },
  });

  if (isLoading) {
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
  }

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
                          "group flex w-full items-center justify-start gap-x-2.5 rounded-md px-2 py-1.5 text-sm font-medium leading-6",
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
