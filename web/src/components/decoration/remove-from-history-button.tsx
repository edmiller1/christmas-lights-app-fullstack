"use client";

import { Loader2, Trash } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFromHistory } from "@/api/history";
import { toast } from "sonner";

interface Props {
  decorationId: string;
}

export const RemoveFromHistoryButton = ({ decorationId }: Props) => {
  const queryClient = useQueryClient();

  const {
    mutate: removeDecorationFromHistory,
    isPending: removeDecorationFromHistoryPending,
  } = useMutation({
    mutationFn: (decorationId: string) => {
      return removeFromHistory(decorationId);
    },
    onSuccess: () => {
      toast.success("Decoration removed from history");
      queryClient.invalidateQueries({ queryKey: ["get-history"] });
    },
    onError: () => {
      toast.error(
        "Failed to remove decoration from history. Please try again."
      );
    },
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeDecorationFromHistory(decorationId)}
            disabled={removeDecorationFromHistoryPending}
          >
            {removeDecorationFromHistoryPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash className="w-4 h-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Remove from history</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
