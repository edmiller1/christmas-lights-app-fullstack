"use client";

import { clearHistory, getHistory } from "@/api/history";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DecorationCardSkeleton } from "../components/decoration-card-skeleton";
import { Fragment } from "react";
import { DecorationCard } from "../components/decoration-card";
import { History, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";

const HistoryPage = () => {
  const {
    data: history,
    isLoading: historyLoading,
    isError: historyError,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ["get-history"],
    queryFn: getHistory,
  });

  const { mutate: clearAllHistory, isPending: clearAllHistoryPending } =
    useMutation({
      mutationFn: clearHistory,
      onSuccess: () => {
        toast.success("History cleared");
        refetchHistory();
      },
      onError: () => {
        toast.error("Failed to clear history. Please try again.");
      },
    });

  return (
    <div className="container max-w-4xl py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">History</h1>
        <p className="text-muted-foreground mt-2">
          Manage your recently visited decorations here.
        </p>
      </div>

      {history && history.length > 0 && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 mb-8"
              disabled={clearAllHistoryPending}
            >
              <Trash2 className="h-4 w-4" />
              Clear History
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear viewing history?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently remove all
                decorations from your viewing history.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => clearAllHistory()}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={clearAllHistoryPending}
              >
                {clearAllHistoryPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Clearing...
                  </>
                ) : (
                  "Clear"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {historyLoading ? (
        <div className="mt-8">
          <DecorationCardSkeleton array={[1, 2, 3]} />
        </div>
      ) : history && history.length > 0 ? (
        <div className="grid gap-6 sm:gris-cols-2 lg:grid-cols-3">
          {history.map((decoration) => (
            <Fragment key={decoration.id}>
              <DecorationCard decoration={decoration} />
            </Fragment>
          ))}
        </div>
      ) : historyError ? (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <History className="h-10 w-10 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Failed to load history</h3>
          <Button
            variant="outline"
            className="text-sm text-muted-foreground mt-1"
            onClick={() => refetchHistory()}
          >
            Try again
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <History className="h-10 w-10 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No history</h3>
          <p className="text-base text-muted-foreground">
            Visit decorations to see them here
          </p>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
