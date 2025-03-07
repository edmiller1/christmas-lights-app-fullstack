"use client";

import {
  Bell,
  BellDot,
  Check,
  CheckCircle2,
  Loader2,
  MoreVertical,
  Trash,
  Trash2,
  TriangleAlert,
  Undo,
} from "lucide-react";

import { format } from "timeago.js";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotifications } from "@/api/auth/notifications";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { markNotificationAsRead } from "@/api/auth/readNotification";
import { useState } from "react";
import { toast } from "sonner";
import { markNotificationAsUnread } from "@/api/auth/unreadNotification";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { markAllNotificationsAsRead } from "@/api/auth/readAllNotifications";
import { deleteNotification } from "@/api/auth/deleteNotification";
import { deleteAllNotifications } from "@/api/auth/deleteAllNotifications";

const DeleteAllNotificationsButton = () => {
  const queryClient = useQueryClient();

  const {
    mutate: removeAllNotifications,
    isPending: removeAllNotificationsLoading,
  } = useMutation({
    mutationFn: deleteAllNotifications,
    onSuccess: () => {
      toast.success("All notifications deleted");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => {
      toast.error("Failed to delete all notifications");
    },
  });
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeAllNotifications()}
            disabled={removeAllNotificationsLoading}
          >
            {removeAllNotificationsLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Clear all notifications</span>
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Delete all notifications</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const MarkAllAsReadButton = () => {
  const queryClient = useQueryClient();

  const {
    mutate: readAllNotifications,
    isPending: readAllNotificationsLoading,
  } = useMutation({
    mutationFn: () => markAllNotificationsAsRead(),
    onSuccess: () => {
      toast.success("All notifications marked as read");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => {
      toast.error("Failed to mark all notifications as read");
    },
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => readAllNotifications()}
            disabled={readAllNotificationsLoading}
          >
            {readAllNotificationsLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span className="sr-only">Mark all as read</span>
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Mark all notifications as read</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const NotificationMenu = () => {
  const [processingId, setProcessingId] = useState<string | null>(null);

  const {
    data: notifications,
    isLoading: notificationsLoading,
    isError: notificationsError,
    refetch: refetchNotifications,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(),
  });

  const { mutate: readNotification } = useMutation({
    mutationFn: (notificationId: string) => {
      setProcessingId(notificationId);
      return markNotificationAsRead(notificationId);
    },
    onSuccess: () => {
      refetchNotifications();
      setProcessingId(null);
    },
    onError: () => {
      toast.error("Failed to mark notification as read");
      setProcessingId(null);
    },
  });

  const { mutate: unreadNotification } = useMutation({
    mutationFn: (notificationId: string) => {
      setProcessingId(notificationId);
      return markNotificationAsUnread(notificationId);
    },
    onSuccess: () => {
      refetchNotifications();
      setProcessingId(null);
    },
    onError: () => {
      toast.error("Failed to mark notification as unread");
      setProcessingId(null);
    },
  });

  const { mutate: removeNotification } = useMutation({
    mutationFn: (notificationId: string) => {
      setProcessingId(notificationId);
      return deleteNotification(notificationId);
    },
    onSuccess: () => {
      toast.success("Notification deleted");
      refetchNotifications();
      setProcessingId(null);
    },
    onError: () => {
      toast.error("Failed to delete notification");
      setProcessingId(null);
    },
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {notifications?.some((notification) => notification.unread) && (
            <span className="absolute right-2 top-1 h-3 w-3 rounded-full border-2 border-background bg-red-500" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="mr-10 w-80">
        <div className="flex items-center justify-between">
          <h3 className="mb-2 text-lg font-semibold">Notifications</h3>
          <div className="flex items-center space-x-3">
            {notifications?.some((notification) => notification.unread) && (
              <MarkAllAsReadButton />
            )}
            {notifications && notifications?.length > 0 && (
              <DeleteAllNotificationsButton />
            )}
          </div>
        </div>
        {notificationsError && (
          <>
            <Alert variant="destructive">
              <TriangleAlert className="h-4 w-4 text-destructive" />
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription>Failed to load notifications.</AlertDescription>
            </Alert>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => refetchNotifications()}
            >
              Try again
            </Button>
          </>
        )}
        {notificationsLoading && (
          <div className="flex items-center justify-center h-80">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}
        {notifications?.length === 0 ? (
          <div className="flex flex-col items-center h-80 justify-center">
            <BellDot className="h-10 w-10 mb-3" />
            <p className="text-center">No notifications</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            {notifications?.map((notification) => (
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
                    {format(new Date(notification.createdAt))}
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
                      <DropdownMenuItem
                        onClick={() => readNotification(notification.id)}
                        disabled={processingId === notification.id}
                      >
                        {processingId === notification.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="mr-2 h-4 w-4" />
                        )}
                        <span>Mark as read</span>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => unreadNotification(notification.id)}
                        disabled={processingId === notification.id}
                      >
                        {processingId === notification.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Undo className="mr-2 h-4 w-4" />
                        )}
                        <span>Mark as unread</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => removeNotification(notification.id)}
                      disabled={processingId === notification.id}
                    >
                      {processingId === notification.id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Trash className="mr-2 h-4 w-4" />
                      )}
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
};
