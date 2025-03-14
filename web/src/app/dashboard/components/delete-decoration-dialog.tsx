"use client";

import { Loader2, Trash2 } from "lucide-react";
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
} from "../../../components/ui/alert-dialog";
import { Button } from "../../../components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDecoration } from "@/api/decoration";
import { toast } from "sonner";

interface Props {
  decorationName: string;
  decorationId: string;
}

export const DeleteDecorationDialog = ({
  decorationName,
  decorationId,
}: Props) => {
  const queryClient = useQueryClient();

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

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
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
