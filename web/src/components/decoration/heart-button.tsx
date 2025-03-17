"use client";

import { useUser } from "@/hooks/useUser";
import { Tooltip, TooltipContent, TooltipProvider } from "../ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Heart } from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeDecoration, saveDecoration } from "@/api/decoration";
import { Loader2 } from "lucide-react";

interface Props {
  decorationId: string;
}

export const HeartButton = ({ decorationId }: Props) => {
  const { user } = useUser();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: favouriteDecoration, isPending: favouriteDecorationPending } =
    useMutation({
      mutationFn: (decorationId: string) => {
        return saveDecoration(decorationId);
      },
      onSuccess: () => {
        toast.success("Decoration saved");
        queryClient.invalidateQueries({ queryKey: ["get-user"] });
      },
      onError: () => {
        toast.error("Failed to save decoration");
      },
    });

  const {
    mutate: unfavouriteDecoration,
    isPending: unfavouriteDecorationPending,
  } = useMutation({
    mutationFn: (decorationId: string) => {
      return removeDecoration(decorationId);
    },
    onSuccess: () => {
      toast.success("Decoration removed");
      queryClient.invalidateQueries({ queryKey: ["get-user"] });
      queryClient.invalidateQueries({ queryKey: ["get-user-favourites"] });
    },
    onError: () => {
      toast.error("Failed to remove decoration");
    },
  });

  const renderToast = () => {
    toast("You must be logged in to save a decoration.", {
      action: (
        <Button variant="secondary" onClick={() => router.push("/sign-in")}>
          Log in
        </Button>
      ),
      dismissible: true,
      duration: 10000,
    });
  };

  if (!user) {
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" onClick={renderToast}>
            <Heart className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Save decoration</TooltipContent>
      </Tooltip>
    </TooltipProvider>;
  }

  return (
    <>
      {user?.favourites.some((fav) => fav.decorationId === decorationId) ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => unfavouriteDecoration(decorationId)}
              >
                {unfavouriteDecorationPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Heart className="w-4 h-4" weight="fill" color="#FF647F" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Remove decoration</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => favouriteDecoration(decorationId)}
                >
                  {favouriteDecorationPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Heart className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save decoration</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </>
      )}
    </>
  );
};
