"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Progress } from "@/components/ui/progress";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Rating } from "@/lib/types";
import { Star } from "@phosphor-icons/react";

interface Props {
  averageRating: number;
  numRatings: number;
  ratings: Rating[];
}

type Counts = {
  [key: number]: number;
};

export const ViewRatingsDialog = ({
  averageRating,
  numRatings,
  ratings,
}: Props) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const counts: Counts = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  ratings?.forEach((item) => {
    counts[item.rating]++;
  });

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <span
            role="button"
            className="font-semibold underline cursor-pointer"
          >
            {numRatings === 1
              ? `${numRatings} rating`
              : `${numRatings} ratings`}
          </span>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ratings</DialogTitle>
            <DialogDescription>
              View ratings for this decoration
            </DialogDescription>
          </DialogHeader>
          <div className="px-3 py-3 flex justify-center items-center space-x-3">
            {averageRating === 1 ? (
              <h1 className="text-xl font-bold">No ratings</h1>
            ) : (
              <div className="flex flex-col">
                <div className="flex flex-col justify-center items-center space-y-3">
                  <div className="border flex space-x-4 items-center rounded-full p-3 w-full bg-muted">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        size={24}
                        color={index < averageRating ? "#fdcc4b" : "#e0e0e0"}
                        weight={index < averageRating ? "fill" : "regular"}
                      />
                    ))}
                    <span className="text-sm font-medium">
                      {averageRating?.toFixed(1)} out of 5
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {numRatings} reviews
                  </span>
                </div>
                <div className="flex flex-col mt-3 w-full space-y-2 px-3">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div
                      key={rating}
                      className="flex items-center gap-2 w-full"
                    >
                      <span className="text-sm text-muted-foreground w-16">
                        {rating} star
                      </span>
                      <Progress
                        value={(counts[rating] / 9) * 100}
                        className="h-2 flex-1"
                        indicatorColor="bg-[#fdcc4b]"
                      />
                      <span className="text-sm text-muted-foreground w-14 text-right">
                        {counts[rating] === 0
                          ? "0%"
                          : `${((counts[rating] / 9) * 100).toFixed(0)}%`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="flex flex-col items-center">
          <span className="font-semibold underline cursor-pointer">
            {numRatings} {numRatings === 1 ? "rating" : "ratings"}
          </span>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Ratings</DrawerTitle>
          <DrawerDescription>
            View ratings for this decoration
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-3 py-3 flex justify-center items-center space-x-3">
          {averageRating === 1 ? (
            <h1 className="text-xl font-bold">No ratings</h1>
          ) : (
            <div className="flex flex-col">
              <div className="flex flex-col justify-center items-center space-y-3">
                <div className="border flex space-x-4 items-center rounded-full p-3 w-full bg-muted">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      size={24}
                      color={index < averageRating ? "#fdcc4b" : "#e0e0e0"}
                      weight={index < averageRating ? "fill" : "regular"}
                    />
                  ))}
                  <span className="text-sm font-medium">
                    {averageRating?.toFixed(1)} out of 5
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {numRatings} reviews
                </span>
              </div>
              <div className="flex flex-col mt-3 w-full space-y-2 px-3">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2 w-full">
                    <span className="text-sm text-muted-foreground w-16">
                      {rating} star
                    </span>
                    <Progress
                      value={(counts[rating] / 9) * 100}
                      className="h-2 flex-1"
                      indicatorColor="bg-[#fdcc4b]"
                    />
                    <span className="text-sm text-muted-foreground w-14 text-right">
                      {counts[rating] === 0
                        ? "0%"
                        : `${((counts[rating] / 9) * 100).toFixed(0)}%`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
