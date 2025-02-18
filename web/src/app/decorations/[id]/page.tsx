"use client";

import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { DecorationLoading } from "./components/decoration-loading";
import { ChevronLeft, Star } from "lucide-react";
import { MapPin, Eye } from "@phosphor-icons/react";
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
import Map, { GeolocateControl, Marker, NavigationControl } from "react-map-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import { Button } from "@/components/ui/button";
import { MobileImages } from "./components/mobile-images";
import { Footer } from "@/components/footer";

const DecorationPage = () => {
  const { user } = useUser();
  const params = useParams();

  const id = params.id as string;

  const mapBoxToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY as string;

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
      <div className="flex flex-col overflow-y-auto md:hidden">
        <div className="h-16 flex justify-between items-center border-b">
          <Button variant="ghost">
            <ChevronLeft className="h-12 w-12" />
          </Button>
          <div>
            <ShareButton />
            <SaveButton decorationId={decoration.id} user={user} />
          </div>
        </div>
        <MobileImages
          images={decoration.images.sort((a, b) => a.index - b.index)}
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
              {decoration.ratingCount > 0 ? (
                <div className="flex flex-col items-center">
                  <span>{decoration.ratingCount}</span>
                  <span className="font-semibold underline cursor-pointer">
                    {decoration.ratingCount === 1 ? "rating" : "ratings"}
                  </span>
                </div>
              ) : (
                <span className="font-semibold underline cursor-pointer">
                  No ratings
                </span>
              )}
            </div>
          </div>
          <div className="w-full h-64 my-5 rounded-lg">
            <Map
              mapboxAccessToken={mapBoxToken}
              initialViewState={{
                latitude: decoration.latitude,
                longitude: decoration.longitude,
                zoom: 16,
              }}
              maxZoom={20}
              minZoom={3}
              mapStyle="mapbox://styles/mapbox/streets-v12"
              style={{ borderRadius: "10px" }}
            >
              <GeolocateControl />
              <NavigationControl />
              <Marker
                latitude={decoration.latitude}
                longitude={decoration.longitude}
                anchor="bottom"
              >
                <MapPin size={32} weight="fill" color="#db2626" />
              </Marker>
            </Map>
          </div>
        </div>
        <Footer />
      </div>
      <div className="fixed bg-background px-6 shadow w-full h-[80px] bottom-0 left-0 right-0 z-50 flex justify-between items-center">
        <Button variant="secondary" size="lg">
          Edit
        </Button>
        <Button size="lg">Delete</Button>
      </div>

      <div className="hidden md:flex flex-col pt-20 md:mx-16 lg:mx-32 xl:mx-52 2xl:mx-72">
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
          <div className="w-full h-[28rem] my-5 rounded-lg">
            <Map
              mapboxAccessToken={mapBoxToken}
              initialViewState={{
                latitude: decoration.latitude,
                longitude: decoration.longitude,
                zoom: 15,
              }}
              maxZoom={20}
              minZoom={3}
              mapStyle="mapbox://styles/mapbox/streets-v12"
              style={{ borderRadius: "10px" }}
            >
              <GeolocateControl />
              <NavigationControl />
              <Marker
                latitude={decoration.latitude}
                longitude={decoration.longitude}
                anchor="bottom"
              >
                <MapPin size={32} weight="fill" color="#db2626" />
              </Marker>
            </Map>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DecorationPage;
