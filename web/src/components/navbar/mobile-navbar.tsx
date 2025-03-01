"use client";

import { Bell, Home, SquarePlus, Telescope, UserCircle } from "lucide-react";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import useStore from "@/store/useStore";

interface Props {
  className?: string;
}

export const MobileNavbar = ({ className }: Props) => {
  const { setDialogOpen } = useStore((state) => state);
  const pathname = usePathname();

  return (
    <nav
      className={`fixed shadow w-full h-18 bottom-0 left-0 right-0 bg-background z-[99] flex items-center border-t ${className}`}
    >
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
        <Button
          variant="ghost"
          size="icon"
          className={`flex flex-col items-center justify-center p-1 h-16 w-20 transition-colors ${
            pathname.includes("/explore") || pathname.includes("/decorations")
              ? "text-primary"
              : ""
          }`}
          onClick={() => setDialogOpen(true)}
        >
          <SquarePlus
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
