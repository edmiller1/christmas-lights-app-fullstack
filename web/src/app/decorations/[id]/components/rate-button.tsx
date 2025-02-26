"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { User } from "@/lib/types";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RateDecorationDialog } from "./rate-decoration-dialog";
import { useMediaQuery } from "@/hooks/use-media-query";

interface Props {
  user: User | null;
  decorationId: string;
}

export const RateButton = ({ decorationId, user }: Props) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();

  const renderToast = () => {
    toast("You must be logged in to rate a decoration.", {
      action: (
        <Button variant="secondary" onClick={() => router.push("/sign-in")}>
          Log in
        </Button>
      ),
      dismissible: true,
      duration: 10000,
    });
  };

  const userRating = user?.ratings.find((r) => r.decorationId === decorationId);

  if (isDesktop) {
    return (
      <>
        {user ? (
          <>
            {user.ratings.some(
              (userRating) => userRating.decorationId === decorationId
            ) ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <RateDecorationDialog
                      decorationId={decorationId}
                      userRating={userRating}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Your rating: {userRating?.rating} stars</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <RateDecorationDialog
                decorationId={decorationId}
                userRating={user.ratings.find(
                  (r) => r.decorationId === decorationId
                )}
              />
            )}
          </>
        ) : (
          <Button variant="ghost" onClick={renderToast}>
            <Star className="w-4 h-4" />
            Rate
          </Button>
        )}
      </>
    );
  }

  return (
    <>
      {user ? (
        <>
          {user.ratings.some(
            (userRating) => userRating.decorationId === decorationId
          ) ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <RateDecorationDialog
                    decorationId={decorationId}
                    userRating={userRating}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your rating: {userRating?.rating} stars</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <RateDecorationDialog
              decorationId={decorationId}
              userRating={user.ratings.find(
                (r) => r.decorationId === decorationId
              )}
            />
          )}
        </>
      ) : (
        <Button variant="ghost" onClick={renderToast}>
          <Star className="w-4 h-4" />
        </Button>
      )}
    </>
  );
};
