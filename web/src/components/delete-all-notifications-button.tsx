"use client";

import { deleteAllNotifications } from "@/api/auth/deleteAllNotifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Button } from "./ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

export const DeleteAllNotificationsButton = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
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

  if (isDesktop) {
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
  }

  return (
    <Button
      variant="ghost"
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
  );
};
