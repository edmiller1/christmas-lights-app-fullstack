import { markAllNotificationsAsRead } from "@/api/auth/readAllNotifications";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Button } from "./ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";

export const MarkAllAsReadButton = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
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

  if (isDesktop) {
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
  }

  return (
    <Button
      variant="ghost"
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
  );
};
