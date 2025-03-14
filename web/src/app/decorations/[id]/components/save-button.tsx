"use client";

import { removeDecoration, saveDecoration } from "@/api/decoration";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { User } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  user: User | null;
  decorationId: string;
}

export const SaveButton = ({ decorationId, user }: Props) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: favouriteDecoration, isPending: favouriteDecorationPending } =
    useMutation({
      mutationFn: () => saveDecoration(decorationId),
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["get-user"],
        });
        toast.success("Decoration saved to favourites");
      },
      onError: (error: { response?: { data?: { error?: string } } }) => {
        const errorMessage =
          error?.response?.data?.error || "Failed to save decoration";
        toast.error(errorMessage);
      },
    });

  const { mutate: removeFavourite, isPending: removeFavouritePending } =
    useMutation({
      mutationFn: () => removeDecoration(decorationId),
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["get-user"],
        });
        toast.success("Decoration removed from favourites");
      },
      onError: (error: { response?: { data?: { error?: string } } }) => {
        const errorMessage =
          error?.response?.data?.error || "Failed to remove decoration";
        toast.error(errorMessage);
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

  if (favouriteDecorationPending || removeFavouritePending) {
    return (
      <Button variant="ghost">
        <Loader2 className="w-4 h-4 animate-spin" />
      </Button>
    );
  }

  if (isDesktop) {
    return (
      <>
        {user ? (
          <>
            {user.favourites.some(
              (userFavourite) => userFavourite.decorationId === decorationId
            ) ? (
              <Button variant="ghost" onClick={() => removeFavourite()}>
                <Heart className="w-4 h-4" fill="#FF647F" stroke="#FF647F" />
                Save
              </Button>
            ) : (
              <Button variant="ghost" onClick={() => favouriteDecoration()}>
                <Heart className="w-4 h-4" />
                Save
              </Button>
            )}
          </>
        ) : (
          <Button variant="ghost" onClick={renderToast}>
            <Heart className="w-4 h-4" />
            Save
          </Button>
        )}
      </>
    );
  }

  return (
    <>
      {user ? (
        <>
          {user.favourites.some(
            (userFavourite) => userFavourite.decorationId === decorationId
          ) ? (
            <Button variant="ghost" onClick={() => removeFavourite()}>
              <Heart className="w-12 h-12" fill="#FF647F" stroke="#FF647F" />
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => favouriteDecoration()}>
              <Heart className="w-12 h-12" />
            </Button>
          )}
        </>
      ) : (
        <Button variant="ghost" onClick={renderToast}>
          <Heart className="w-12 h-12" />
        </Button>
      )}
    </>
  );
};
