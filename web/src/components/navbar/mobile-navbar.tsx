"use client";

import {
  Bell,
  Home,
  PlusCircle,
  SquarePlus,
  Telescope,
  UserCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import useStore from "@/store/useStore";

export const MobileNavbar = () => {
  const { setDialogOpen } = useStore((state) => state);
  const pathname = usePathname();

  const NavButton = ({
    icon,
    label,
    isActive,
  }: {
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
  }) => (
    <Button
      variant="ghost"
      size="icon"
      className={`flex flex-col items-center justify-center p-1 h-16 w-20 transition-colors ${
        isActive ? "text-[#FF385C]" : ""
      }`}
    >
      {icon}
      <span
        className={`text-xs mt-1 font-medium ${
          isActive ? "text-[#FF385C]" : "text-gray-500"
        }`}
      >
        {label}
      </span>
    </Button>
  );

  return (
    <nav className="fixed shadow w-full h-18 bottom-0 left-0 right-0 z-50 flex items-center border-t md:hidden">
      <div className="flex flex-auto items-start justify-around">
        <Button
          variant="ghost"
          size="icon"
          className={`flex flex-col items-center justify-center p-1 h-16 w-20 transition-colors ${
            pathname === "/" ? "text-primary" : ""
          }`}
        >
          <Home
            size={48}
            className={`w-12 h-12 ${pathname === "/" ? "text-primary" : ""}`}
          />
          <span
            className={`text-xs mt-1 font-medium ${
              pathname === "/" ? "text-primary" : ""
            }`}
          >
            Home
          </span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`flex flex-col items-center justify-center p-1 h-16 w-20 transition-colors ${
            pathname.includes("/explore") || pathname.includes("/decorations")
              ? "text-primary"
              : ""
          }`}
        >
          <Telescope
            className={`w-6 h-6 ${
              pathname.includes("/explore") || pathname.includes("/decorations")
                ? "text-primary"
                : ""
            }`}
          />
          <span
            className={`text-xs mt-1 font-medium ${
              pathname.includes("/explore") || pathname.includes("/decorations")
                ? "text-primary"
                : ""
            }`}
          >
            Explore
          </span>
        </Button>
        <div className="absolute left-1/2 -translate-x-1/2 -top-10">
          <div className="relative">
            <Button
              onClick={() => setDialogOpen(true)}
              variant="default"
              size="icon"
              className="relative h-16 w-16 rounded-full bg-primary"
            >
              <PlusCircle className="h-10 w-10" />
              <span className="sr-only">Create</span>
            </Button>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={`flex flex-col items-center justify-center p-1 h-16 w-20 transition-colors ${
            pathname === "/notifications" ? "text-primary" : ""
          }`}
        >
          <Bell
            className={`w-6 h-6 ${
              pathname === "/notifications" ? "text-primary" : ""
            }`}
          />
          <span
            className={`text-xs mt-1 font-medium ${
              pathname === "/notifications" ? "text-primary" : ""
            }`}
          >
            Notifications
          </span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`flex flex-col items-center justify-center p-1 h-16 w-20 transition-colors ${
            pathname === "/dashboard" ? "text-primary" : ""
          }`}
        >
          <UserCircle
            className={`w-6 h-6 ${
              pathname === "/dashboard" ? "text-primary" : ""
            }`}
          />
          <span
            className={`text-xs mt-1 font-medium ${
              pathname === "/dashboard" ? "text-primary" : ""
            }`}
          >
            Dashboard
          </span>
        </Button>
      </div>
    </nav>
  );
};
