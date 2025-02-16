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

interface Props {
  user: User | null;
  decorationId: string;
}

export const RateButton = ({ decorationId, user }: Props) => {
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
                  <Button variant="ghost">
                    <Star className="w-4 h-4" fill="#facd14" stroke="#facd14" />
                    Rate
                  </Button>
                </TooltipTrigger>
                {user.ratings.find((r) => r.decorationId === decorationId) ? (
                  <TooltipContent>
                    <p>
                      Your rating: $
                      {
                        user.ratings.find(
                          (r) => r.decorationId === decorationId
                        )?.rating
                      }{" "}
                      stars
                    </p>
                  </TooltipContent>
                ) : null}
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button variant="ghost">
              <Star className="w-4 h-4" />
              Rate
            </Button>
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
};
