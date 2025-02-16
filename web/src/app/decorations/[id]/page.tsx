"use client";

import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { DecorationLoading } from "./components/decoration-loading";
import { Star } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { VerifiedAlert } from "./components/verified-alert";
import { DecorationUserMenu } from "./components/decoration-user-menu";
import { DecorationMenu } from "./components/decoration-menu";
import { ImageGrid } from "./components/image-grid";
import { useState } from "react";
import { ImagesOverlay } from "./components/image-overlay";
import { ImageCarousel } from "./components/image-carousel";
import { RateButton } from "./components/rate-button";
import { SaveButton } from "./components/save-button";
import { ShareButton } from "./components/share-button";

const DecorationPage = () => {
  const { user } = useUser();
  const params = useParams();

  const id = params.id as string;

  const [showImageOverlay, setShowImageOverlay] = useState<boolean>(false);
  const [showImageCarousel, setShowImageCarousel] = useState<boolean>(false);

  const {
    data: decoration,
    isLoading: getDecorationLoading,
    error: getDecorationError,
  } = useQuery({
    queryKey: ["get-decoration"],
    queryFn: async () => {
      return api.decoration.getDecoration(id);
    },
  });

  if (getDecorationError) {
    return <div>Error</div>;
  }

  if (getDecorationLoading) {
    return <DecorationLoading />;
  }

  if (!decoration) {
    return <div>Decoration not found</div>;
  }

  return (
    <>
      {showImageCarousel && (
        <ImageCarousel
          images={decoration.images}
          setShowImageCarousel={setShowImageCarousel}
          setShowImageOverlay={setShowImageOverlay}
        />
      )}
      {showImageOverlay && (
        <ImagesOverlay
          images={decoration.images}
          setShowImageOverlay={setShowImageOverlay}
          setShowImageCarousel={setShowImageCarousel}
        />
      )}
      <div className="flex flex-col pt-20 md:mx-16 lg:mx-32 xl:mx-52 2xl:mx-72">
        <h1 className="text-3xl font-extrabold">{decoration.name}</h1>
        <div className="flex items-center justify-between my-2 text-sm font-semibold">
          <div className="flex">
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1" fill="currentColor" />
              &nbsp;
              <span>
                {decoration.averageRating === "0"
                  ? "New"
                  : Number(decoration.averageRating).toFixed(1)}
              </span>
              {decoration.ratingCount > 0 && (
                <>
                  &nbsp; &middot; &nbsp;
                  <span className="font-semibold underline cursor-pointer">
                    {decoration.ratingCount === 1 ? "rating" : "ratings"}
                  </span>
                </>
              )}
            </div>
            <span className="mx-2">|</span>
            <div className="flex items-center font-semibold ">
              &nbsp;<span>{decoration.viewCount}</span>&nbsp; views
            </div>
            <span className="mx-2">|</span>
            <span className="font-semibold ">
              {decoration.city}, {decoration.country}
            </span>
          </div>
          {user && user.id === decoration.userId ? (
            <div className="flex space-x-2">
              <VerifiedAlert
                decorationId={decoration.id}
                verificationSubmitted={decoration.verificationSubmitted}
                verified={decoration.verified}
              />
              <DecorationUserMenu />
            </div>
          ) : (
            <DecorationMenu />
          )}
        </div>
        <ImageGrid
          images={decoration.images}
          setShowImageOverlay={setShowImageOverlay}
        />
        <div className="flex justify-end mt-2">
          <RateButton decorationId={decoration.id} user={user} />
          <SaveButton decorationId={decoration.id} user={user} />
          <ShareButton />
        </div>
        <div className="mx-2 mt-5">
          <h2 className="text-2xl font-bold">Location</h2>
          <div className="flex items-center w-2/3">
            <h3 className="mr-2 text-base text-secondary text-gray-600 dark:text-zinc-300">
              {decoration.address}
            </h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default DecorationPage;
