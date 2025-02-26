"use client";

import { Button } from "@/components/ui/button";
import { DecorationPicture } from "@/lib/types";
import { Grip } from "lucide-react";

interface Props {
  images: DecorationPicture[];
  setShowImageOverlay: (showImageOverlay: boolean) => void;
}

export const ImageGrid = ({ images, setShowImageOverlay }: Props) => {
  if (images && images.length === 1) {
    return (
      <div className="image-grid-1">
        <img
          src={images[0].url}
          alt="Christmas Decoration"
          className="image-grid-col-2 image-grid-row-2 rounded-xl cursor-pointer object-cover"
          onClick={() => setShowImageOverlay(true)}
        />
      </div>
    );
  }

  if (images && images.length === 2) {
    return (
      <div className="image-grid-2">
        <img
          src={images[0].url}
          alt="Christmas Decoration"
          className="w-1/2 h-[500px] rounded-tl-xl rounded-bl-xl cursor-pointer object-cover"
          onClick={() => setShowImageOverlay(true)}
        />
        <img
          src={images[1].url}
          alt="Christmas decoration"
          className="w-1/2 h-[500px] rounded-tr-xl rounded-br-xl cursor-pointer object-cover"
          onClick={() => setShowImageOverlay(true)}
        />
      </div>
    );
  }

  if ((images && images.length === 3) || images.length === 4) {
    return (
      <div className="image-grid-3">
        <img
          src={images[0].url}
          alt="Christmas decoration"
          className="image-grid-col-2 image-grid-row-2 rounded-tl-xl rounded-bl-xl cursor-pointer object-cover"
          onClick={() => setShowImageOverlay(true)}
        />
        <img
          src={images[1].url}
          alt="Christmas Decoration"
          className="rounded-tr-xl cursor-pointer object-cover"
          onClick={() => setShowImageOverlay(true)}
        />
        <img
          src={images[2].url}
          alt="Christmas Decoration"
          className="rounded-br-xl cursor-pointer object-cover"
          onClick={() => setShowImageOverlay(true)}
        />
        <div className="absolute md:bottom-32 md:right-24 lg:right-40 xl:right-60 xl:bottom-36 2xl:right-80 2xl:bottom-36 z-40">
          <Button variant="outline" onClick={() => setShowImageOverlay(true)}>
            <Grip className="mr-3 w-8 h-8" />
            Show all photos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="image-grid-4">
      {images && images.length > 4 ? (
        <>
          <img
            src={images[0].url}
            alt="Christmas decoration"
            className="image-grid-col-2 image-grid-row-2 rounded-tl-xl rounded-bl-xl cursor-pointer object-cover"
            onClick={() => setShowImageOverlay(true)}
          />
          <img
            src={images[1].url}
            alt="Christmas Decoration"
            className="cursor-pointer object-cover"
            onClick={() => setShowImageOverlay(true)}
          />

          <img
            src={images[2].url}
            alt="Christmas Decoration"
            className="rounded-tr-xl cursor-pointer object-cover"
            onClick={() => setShowImageOverlay(true)}
          />
          <img
            src={images[3].url}
            alt="Christmas Decoration"
            className="cursor-pointer object-cover"
            onClick={() => setShowImageOverlay(true)}
          />
          <img
            src={images[4].url}
            alt="Christmas Decoration"
            className="rounded-br-xl cursor-pointer object-cover"
            onClick={() => setShowImageOverlay(true)}
          />
        </>
      ) : null}
      <div className="absolute md:bottom-32 md:right-24 lg:right-40 xl:right-60 xl:bottom-36 2xl:right-80 2xl:bottom-36 z-40">
        <Button variant="outline" onClick={() => setShowImageOverlay(true)}>
          <Grip size={28} className="mr-3 w-8 h-8" />
          Show all photos
        </Button>
      </div>
    </div>
  );
};
