"use client";

import {
  deleteNotification,
  getNotifications,
  markNotificationAsRead,
  markNotificationAsUnread,
} from "@/api/auth";
import { DeleteAllNotificationsButton } from "@/components/notifications/delete-all-notifications-button";
import { MarkAllAsReadButton } from "@/components/notifications/mark-all-as-read-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  BellDot,
  Check,
  Loader2,
  MoreVertical,
  Trash,
  TriangleAlert,
  Undo,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { format } from "timeago.js";

const NotificationsPage = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();

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

  useEffect(() => {
    if (isDesktop) {
      router.push("/dashboard");
    }
  }, [router, isDesktop]);

  return (
    <div className="min-w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <div className="flex items-center gap-2">
          <MarkAllAsReadButton />
          {notifications && notifications.length > 0 && (
            <DeleteAllNotificationsButton />
          )}
        </div>
      </div>
      {notificationsError && (
        <div className="flex flex-col h-[70vh] mx-24 justify-center items-center">
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
        </div>
      )}
      {notificationsLoading && (
        <div className="flex items-center justify-center h-[70vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      {notifications?.length === 0 ? (
        <div className="flex flex-col items-center h-80 justify-center">
          <BellDot className="h-10 w-10 mb-3" />
          <p className="text-center">No notifications</p>
        </div>
      ) : (
        <>
          {notifications?.map((notification) => (
            <div
              key={notification.id}
              className="mb-2 flex items-start justify-between rounded-md p-3 transition-colors duration-200 hover:bg-accent hover:text-accent-foreground"
            >
              <div className="flex-grow">
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
        </>
      )}
    </div>
  );
};

export default NotificationsPage;
