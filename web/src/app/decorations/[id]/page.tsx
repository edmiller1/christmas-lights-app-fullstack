"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { ChevronLeft, Star } from "lucide-react";
import { Eye } from "@phosphor-icons/react";
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
import { VerifiedBadge } from "./components/verified-badge";
import christmasLoader from "../../../lottie/christmas-loader.json";

import "mapbox-gl/dist/mapbox-gl.css";
import { Button } from "@/components/ui/button";
import { MobileImages } from "./components/mobile-images";
import { Footer } from "@/components/footer";
import { ViewRatingsDialog } from "./components/view-ratings-dialog";
import { LottieAnimation } from "@/components/lottie-animation";
import { NotFound } from "@/components/not-found";
import { useMediaQuery } from "@/hooks/use-media-query";
import { DecorationPicture } from "@/lib/types";
import { getDecoration } from "@/api/decoration";
import { EditDecoration } from "@/components/edit-decoration/edit-decoration";
import useStore from "@/store/useStore";
import { DecorationMap } from "./components/decoration-map";
import { DeleteDecorationDialog } from "./components/delete-decoration-dialog";

const DecorationPage = () => {
  const { setEditDialogOpen } = useStore((state) => state);
  const isDesktop = useMediaQuery("(min-width: 768px)");
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
    queryFn: async () => getDecoration(id),
  });

  if (getDecorationError) {
    return <div>Error</div>;
  }

  if (getDecorationLoading) {
    return (
      <div className="min-h-screen md:min-h-[90vh] flex justify-center items-center">
        <LottieAnimation animationData={christmasLoader} autoplay loop />
      </div>
    );
  }

  if (!decoration) {
    return <NotFound />;
  }

  if (isDesktop) {
    return (
      <>
        <EditDecoration
          establishedImages={decoration.images}
          decorationName={decoration.name}
          decorationAddress={decoration.address}
          decorationId={decoration.id}
        />
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
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-extrabold">{decoration.name}</h1>
            <VerifiedBadge verified={decoration.verified} />
          </div>
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
                &nbsp; &middot; &nbsp;
                <ViewRatingsDialog
                  averageRating={Number(decoration.averageRating)}
                  numRatings={decoration.ratingCount}
                  ratings={decoration.ratings}
                />
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
            {user ? (
              user.id === decoration.userId ? (
                <div className="flex space-x-2">
                  <VerifiedAlert
                    decorationId={decoration.id}
                    verificationSubmitted={decoration.verificationSubmitted}
                    verified={decoration.verified}
                  />
                  <DecorationUserMenu
                    setEditDialogOpen={setEditDialogOpen}
                    decorationId={decoration.id}
                    decorationName={decoration.name}
                  />
                </div>
              ) : (
                <DecorationMenu
                  decorationId={decoration.id}
                  decorationName={decoration.name}
                />
              )
            ) : null}
          </div>
          <ImageGrid
            images={decoration.images}
            setShowImageOverlay={setShowImageOverlay}
          />
          <div className="flex justify-end mt-2">
            {decoration.userId !== user?.id && (
              <RateButton decorationId={decoration.id} user={user} />
            )}
            <SaveButton decorationId={decoration.id} user={user} />
            <ShareButton decoration={decoration} />
          </div>
          <div className="mx-2 mt-5">
            <h2 className="text-2xl font-bold">Location</h2>
            <div className="flex items-center w-2/3">
              <h3 className="mr-2 text-base text-secondary text-gray-600 dark:text-zinc-300">
                {decoration.address}
              </h3>
            </div>
            <div className="w-full h-[28rem] my-5 rounded-lg">
              <DecorationMap
                latitude={decoration.latitude}
                longitude={decoration.longitude}
              />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <EditDecoration
        establishedImages={decoration.images}
        decorationName={decoration.name}
        decorationAddress={decoration.address}
        decorationId={decoration.id}
      />
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
      <div className="flex flex-col overflow-y-auto">
        <div className="h-16 flex justify-between items-center border-b">
          <Button variant="ghost" className="ml-2">
            <ChevronLeft className="h-12 w-12" />
          </Button>
          <div className="pr-2">
            <ShareButton decoration={decoration} />
            <SaveButton decorationId={decoration.id} user={user} />
            {decoration.userId !== user?.id && (
              <RateButton decorationId={decoration.id} user={user} />
            )}
          </div>
        </div>
        <MobileImages
          images={decoration.images.sort(
            (a: DecorationPicture, b: DecorationPicture) => a.index - b.index
          )}
          setShowImageOverlay={setShowImageOverlay}
        />
        <div className="p-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold">{decoration.name}</h1>
            <VerifiedBadge verified={decoration.verified} />
            <div className="mt-1">
              <VerifiedAlert
                decorationId={decoration.id}
                verified={decoration.verified}
                verificationSubmitted={decoration.verificationSubmitted}
              />
            </div>
          </div>
          <h2>
            {decoration.city}, {decoration.country}
          </h2>
          <h3>{decoration.address}</h3>
          <div className="flex items-center py-2 border rounded-xl my-4 p-2">
            <div className="w-1/4 flex flex-col items-center justify-center font-bold border-r">
              {decoration.averageRating === "0" ? (
                <div className="flex flex-col items-center">
                  <span>New</span>
                  <Star className="w-3 h-3" fill="currentColor" />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-lg">
                  {Number(decoration.averageRating).toFixed(1)}
                  <div className="flex">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className="w-3 h-3"
                        fill={
                          index < Number(decoration.averageRating)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="w-2/4 flex flex-col items-center justify-center font-bold border-r">
              <div className="flex items-center">
                <span className="font-semibold">{decoration.viewCount}</span>
                &nbsp; views
              </div>
              <Eye size={16} weight="fill" />
            </div>
            <div className="w-1/4 flex items-center justify-center font-bold">
              <ViewRatingsDialog
                averageRating={Number(decoration.averageRating)}
                numRatings={decoration.ratingCount}
                ratings={decoration.ratings}
              />
            </div>
          </div>
          <div className="w-full h-64 my-5 rounded-lg">
            <DecorationMap
              latitude={decoration.latitude}
              longitude={decoration.longitude}
            />
          </div>
        </div>
        <Footer />
        {decoration.userId === user?.id && (
          <div className="fixed bg-background px-6 shadow w-full h-[80px] bottom-0 left-0 right-0 z-50 flex justify-between items-center">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setEditDialogOpen(true)}
            >
              Edit
            </Button>
            <DeleteDecorationDialog
              decorationId={decoration.id}
              decorationName={decoration.name}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default DecorationPage;
