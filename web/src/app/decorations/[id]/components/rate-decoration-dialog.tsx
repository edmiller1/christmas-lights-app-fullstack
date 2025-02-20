"use client";

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
import { useState } from "react";

interface Props {
  userRating: Rating | undefined;
}

export const RateDecorationDialog = ({ userRating }: Props) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [rating, setRating] = useState<number>(userRating?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          {userRating ? (
            <Button variant="ghost">
              <Star className="w-4 h-4" fill="#facd14" stroke="#facd14" />
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
              >
                Cancel
              </Button>
            </DialogClose>
            <Button variant="default" disabled={!rating}>
              {userRating ? "Update" : "Rate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {userRating ? (
          <Button variant="ghost">
            <Star className="w-4 h-4" fill="#facd14" stroke="#facd14" />
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
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button variant="default" disabled={!rating}>
            {userRating ? "Update" : "Rate"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
