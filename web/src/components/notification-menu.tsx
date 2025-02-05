"use client";

import { useState } from "react";
import { Bell, Check, MoreVertical, Trash, Undo } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Notification } from "@/lib/types";

export const NotificationMenu = () => {
  const [notifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New message",
      content: "You have a new message from John",
      createdAt: "2 min ago",
      unread: false,
      userId: "fc933798-c6d7-49b9-946d-03c447512439",
    },
    {
      id: "2",
      title: "Calendar event",
      content: "Meeting with team at 3 PM",
      createdAt: "1 hour ago",
      unread: false,
      userId: "fc933798-c6d7-49b9-946d-03c447512439",
    },
    {
      id: "3",
      title: "Profile update",
      content: "Your profile has been updated successfully",
      createdAt: "2 hours ago",
      unread: true,
      userId: "fc933798-c6d7-49b9-946d-03c447512439",
    },
    {
      id: "4",
      title: "New follower",
      content: "Jane Doe started following you",
      createdAt: "1 day ago",
      unread: true,
      userId: "fc933798-c6d7-49b9-946d-03c447512439",
    },
  ]);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          <span className="absolute right-2 top-1 h-3 w-3 rounded-full border-2 border-background bg-red-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="mr-10 w-80">
        <h3 className="mb-2 text-lg font-semibold">Notifications</h3>
        <ScrollArea className="h-[300px]">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="mb-2 flex items-start justify-between rounded-md p-3 transition-colors duration-200 hover:bg-accent hover:text-accent-foreground"
            >
              <div className="flex-grow cursor-pointer">
                <div className="flex items-center">
                  {notification.unread && (
                    <span
                      className="mr-2 h-2 w-2 rounded-full bg-red-500"
                      aria-hidden="true"
                    />
                  )}
                  <h4 className="font-medium">{notification.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  {notification.content}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {notification.createdAt}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {notification.unread ? (
                    <DropdownMenuItem>
                      <Check className="mr-2 h-4 w-4" />
                      <span>Mark as read</span>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem>
                      <Undo className="mr-2 h-4 w-4" />
                      <span>Mark as unread</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
