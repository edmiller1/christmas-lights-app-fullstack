"use client";

import { getUserFavourites } from "@/api/decoration";
import { useQuery } from "@tanstack/react-query";
import { Fragment } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DecorationCard } from "../components/decoration-card";
import { DecorationCardSkeleton } from "../components/decoration-card-skeleton";

const FavouritesPage = () => {
  const {
    data: favourites,
    isLoading: favouritesLoading,
    isError: favouritesError,
    refetch: refetchFavourites,
  } = useQuery({
    queryKey: ["get-user-favourites"],
    queryFn: getUserFavourites,
  });

  return (
    <div className="container max-w-4xl py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Favourites</h1>
        <p className="text-muted-foreground mt-2">
          Manage your favourite decorations here.
        </p>
      </div>

      {favouritesLoading ? (
        <DecorationCardSkeleton array={[1, 2, 3]} />
      ) : favourites && favourites.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favourites.map((decoration) => (
            <Fragment key={decoration.id}>
              <DecorationCard decoration={decoration} />
            </Fragment>
          ))}
        </div>
      ) : favouritesError ? (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Heart className="h-10 w-10 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">
            Failed to load favourites
          </h3>
          <Button
            variant="outline"
            className="text-sm text-muted-foreground mt-1"
            onClick={() => refetchFavourites()}
          >
            Try again
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Heart className="h-10 w-10 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No favourites found</h3>
          <p className="text-base text-muted-foreground">
            Save decorations to view them here
          </p>
        </div>
      )}
    </div>
  );
};

export default FavouritesPage;
