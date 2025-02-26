"use client";

import { rateDecoration } from "@/api/decoration/rateDecoration";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Rating } from "@/lib/types";
import { Star } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  decorationId: string;
  userRating: Rating | undefined;
}

export const RateDecorationDialog = ({ decorationId, userRating }: Props) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(userRating?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const { mutate: rate, isPending: ratingLoading } = useMutation({
    mutationFn: () => rateDecoration({ decorationId, rating }),
    onSuccess: () => {
      if (userRating) {
        toast.success("Decoration updated successfully");
      } else {
        toast.success("Decoration rated successfully");
      }
      setIsOpen(false);
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      const errorMessage =
        error?.response?.data?.error || "Failed to rate decoration";
      toast.error(errorMessage);
    },
  });

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {userRating ? (
            <Button variant="ghost">
              <Star className="w-4 h-4 text-[#facd14]" weight="fill" />
              Rate
            </Button>
          ) : (
            <Button variant="ghost">
              <Star className="w-4 h-4" />
              Rate
            </Button>
          )}
        </DialogTrigger>
        <DialogContent
          hideClose
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Rate Decoration</DialogTitle>
            <DialogDescription>
              Rate this decoration from 1-5 stars
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-2">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className="p-1 hover:scale-110 transition-transform"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    size={32}
                    weight={
                      (hoveredRating || rating) >= star ? "fill" : "regular"
                    }
                    color="#fdcc4b"
                  />
                </button>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {rating ? `${rating} out of 5` : "Click to rate"}
            </span>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={() => setRating(userRating?.rating || 0)}
                disabled={ratingLoading}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="default"
              disabled={!rating || ratingLoading}
              onClick={() => rate()}
            >
              {ratingLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>{userRating ? "Update" : "Rate"}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        {userRating ? (
          <Button variant="ghost">
            <Star className="w-4 h-4 text-[#facd14]" weight="fill" />
          </Button>
        ) : (
          <Button variant="ghost">
            <Star className="w-4 h-4" />
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Rate Decoration</DrawerTitle>
          <DrawerDescription>
            Rate this decoration from 1-5 stars
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col items-center space-y-2">
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="p-1 hover:scale-110 transition-transform"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  size={32}
                  weight={
                    (hoveredRating || rating) >= star ? "fill" : "regular"
                  }
                  color="#fdcc4b"
                />
              </button>
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {rating ? `${rating} out of 5` : "Tap to rate"}
          </span>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button
              variant="outline"
              onClick={() => setRating(userRating?.rating || 0)}
              disabled={ratingLoading}
            >
              Cancel
            </Button>
          </DrawerClose>
          <Button
            variant="default"
            disabled={!rating || ratingLoading}
            onClick={() => rate()}
          >
            {ratingLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>{userRating ? "Update" : "Rate"}</>
            )}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
