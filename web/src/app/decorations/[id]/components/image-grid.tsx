"use client";

import { Button } from "@/components/ui/button";
import { DecorationPicture } from "@/lib/types";
import { Grip } from "lucide-react";
import Image from "next/image";

interface Props {
  images: DecorationPicture[];
  setShowImageOverlay: (showImageOverlay: boolean) => void;
}

export const ImageGrid = ({ images, setShowImageOverlay }: Props) => {
  if (images && images.length === 1) {
    return (
      <div className="image-grid-1">
        <Image
          src={images[0].url}
          alt="Christmas Decoration"
          width={1200}
          height={1200}
          className="image-grid-col-2 image-grid-row-2 rounded-xl cursor-pointer object-cover"
          priority
        />
      </div>
    );
  }

  if (images && images.length === 2) {
    return (
      <div className="image-grid-2">
        <Image
          src={images[0].url}
          alt="Christmas Decoration"
          width={100}
          height={100}
          className="w-1/2 h-[500px] rounded-tl-xl rounded-bl-xl cursor-pointer object-cover"
          onClick={() => setShowImageOverlay(true)}
        />
        <Image
          src={images[1].url}
          alt="Christmas decoration"
          width={100}
          height={100}
          className="w-1/2 h-[500px] rounded-tr-xl rounded-br-xl cursor-pointer object-cover"
        />
      </div>
    );
  }

  if ((images && images.length === 3) || images.length === 4) {
    return (
      <div className="image-grid-3">
        <Image
          src={images[0].url}
          alt="Christmas decoration"
          width={300}
          height={300}
          className="image-grid-col-2 image-grid-row-2 rounded-tl-xl rounded-bl-xl cursor-pointer object-cover"
          quality={100}
          onClick={() => setShowImageOverlay(true)}
        />
        <Image
          src={images[1].url}
          alt="Christmas Decoration"
          width={300}
          height={300}
          className="rounded-tr-xl cursor-pointer object-cover"
          onClick={() => setShowImageOverlay(true)}
        />
        <Image
          src={images[2].url}
          alt="Christmas Decoration"
          width={300}
          height={300}
          className="rounded-br-xl cursor-pointer object-cover"
          onClick={() => setShowImageOverlay(true)}
        />
        <div className="fixed sm:bottom-48 sm:right-72 lg:right-[26%] xl:right-80 xl:bottom-36 z-10">
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
          <Image
            src={images[0].url}
            alt="Christmas decoration"
            width={300}
            height={300}
            className="image-grid-col-2 image-grid-row-2 rounded-tl-xl rounded-bl-xl cursor-pointer object-cover"
            onClick={() => setShowImageOverlay(true)}
          />
          <Image
            src={images[1].url}
            alt="Christmas Decoration"
            width={300}
            height={300}
            className="cursor-pointer object-cover"
            onClick={() => setShowImageOverlay(true)}
          />

          <Image
            src={images[2].url}
            alt="Christmas Decoration"
            width={300}
            height={300}
            className="rounded-tr-xl cursor-pointer object-cover"
            onClick={() => setShowImageOverlay(true)}
          />
          <Image
            src={images[3].url}
            alt="Christmas Decoration"
            width={300}
            height={300}
            className="cursor-pointer object-cover"
            onClick={() => setShowImageOverlay(true)}
          />
          <Image
            src={images[4].url}
            alt="Christmas Decoration"
            width={300}
            height={300}
            className="rounded-br-xl cursor-pointer object-cover"
            onClick={() => setShowImageOverlay(true)}
          />
        </>
      ) : null}
      <div className="fixed sm:right-10 sm:bottom-52 md:right-20 md:bottom-56 lg:right-36 lg:bottom-60 xl:right-60 xl:bottom-60 2xl:right-80 2xl:bottom-56 z-10">
        <Button variant="outline" onClick={() => setShowImageOverlay(true)}>
          <Grip size={28} className="mr-3 w-8 h-8" />
          Show all photos
        </Button>
      </div>
    </div>
  );
};
