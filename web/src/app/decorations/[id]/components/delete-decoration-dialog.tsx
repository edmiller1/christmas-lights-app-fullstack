"use client";

import { Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDecoration } from "@/api/decoration";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface Props {
  decorationName: string;
  decorationId: string;
}

export const DeleteDecorationDialog = ({
  decorationName,
  decorationId,
}: Props) => {
  const queryClient = useQueryClient();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const {
    mutate: handleDeleteDecoration,
    isPending: handleDeleteDecorationLoading,
  } = useMutation({
    mutationFn: deleteDecoration,
    onSuccess: () => {
      toast.success("Decoration deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["user-decorations"] });
      queryClient.invalidateQueries({ queryKey: ["decoration-stats"] });
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      const errorMessage =
        error?.response?.data?.error ||
        "Failed to delete decoration. Please try again.";
      toast.error(errorMessage);
    },
  });

  if (isDesktop) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
            }}
          >
            <span>Delete</span>
          </DropdownMenuItem>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your decoration &quot;
              <strong>{decorationName}</strong>&quot; and remove it from our
              platform. This includes all stats and images associated with the
              decoration. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteDecoration(decorationId)}
              disabled={handleDeleteDecorationLoading}
              className="bg-destructive"
            >
              {handleDeleteDecorationLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                <>Delete</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="lg">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your decoration &quot;
            <strong>{decorationName}</strong>&quot; and remove it from our
            platform. This includes all stats and images associated with the
            decoration. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDeleteDecoration(decorationId)}
            disabled={handleDeleteDecorationLoading}
            className="bg-destructive"
          >
            {handleDeleteDecorationLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
              </>
            ) : (
              <>Delete</>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
