"use client";

import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { DecorationPicture } from "@/lib/types";
import { useEffect, useState } from "react";

interface Props {
  images: DecorationPicture[];
  setShowImageOverlay: (show: boolean) => void;
}

export const MobileImages = ({ images, setShowImageOverlay }: Props) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="relative">
      <Carousel setApi={setApi} className="w-full max-w-full">
        <CarouselContent>
          {[...images]
            .sort((a, b) => a.index - b.index)
            .map((image) => (
              <CarouselItem
                key={image.id}
                onClick={() => setShowImageOverlay(true)}
              >
                <img
                  src={image.url}
                  alt="Christmas Decoration"
                  className="w-full h-72 object-cover"
                />
              </CarouselItem>
            ))}
        </CarouselContent>
      </Carousel>
      <Badge variant="secondary" className="absolute bottom-2 right-2 z-10">
        {current} / {images.length}
      </Badge>
    </div>
  );
};
