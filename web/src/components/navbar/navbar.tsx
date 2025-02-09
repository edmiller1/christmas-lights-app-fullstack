"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { useState } from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { CreateButton } from "../create-decoration/create-button";
import { NotificationMenu } from "../notification-menu";
import { useUser } from "@/hooks/useUser";
import { UserMenu } from "./user-menu";

export const Navbar = () => {
  const { user } = useUser();
  return (
    <nav className="border-b">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="logo" width={50} height={50} />
          </Link>
          <Link href="/explore">
            <Button
              variant="link"
              className="text-foreground ml-4 hidden sm:inline-flex"
            >
              Explore
            </Button>
          </Link>
        </div>

        {/* Center section: Search bar */}
        <div className="block flex-1 max-w-md mx-4">
          <div className="flex items-center border rounded-full">
            <Input
              type="text"
              placeholder="Start your search"
              className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button size="icon" className="rounded-full">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
        </div>

        {/* Right section: Notification and Avatar */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <CreateButton />
              <NotificationMenu />
              <UserMenu user={user} />
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
};
