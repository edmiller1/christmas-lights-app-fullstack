"use client";

import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { User } from "@/lib/types";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  user: User | null;
  decorationId: string;
}

export const SaveButton = ({ decorationId, user }: Props) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();

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

  if (isDesktop) {
    return (
      <>
        {user ? (
          <>
            {user.favourites.some(
              (userFavourite) => userFavourite.decorationId === decorationId
            ) ? (
              <Button>
                <Heart className="w-4 h-4" fill="#FF647F" stroke="#FF647F" />
                Save
              </Button>
            ) : (
              <Button variant="ghost">
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
            <Button>
              <Heart className="w-12 h-12" fill="#FF647F" stroke="#FF647F" />
            </Button>
          ) : (
            <Button variant="ghost">
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
