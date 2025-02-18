"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useMediaQuery } from "@/hooks/use-media-query";
import { DecorationPicture } from "@/lib/types";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
  setShowImageOverlay: (showImageOverlay: boolean) => void;
  setShowImageCarousel: (showImageCarousel: boolean) => void;
  images: DecorationPicture[];
}

export const ImageCarousel = ({
  images,
  setShowImageOverlay,
  setShowImageCarousel,
}: Props) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [api, setApi] = useState<CarouselApi>();
  const [mobileApi, setMobileApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api || !mobileApi) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api, mobileApi]);

  const closeOverlays = () => {
    setShowImageCarousel(false);
    setShowImageOverlay(false);
  };

  if (isDesktop) {
    return (
      <motion.div
        className="bg-black md:block md:overflow-y-auto md:fixed md:bottom-0 md:left-0 md:right-0 md:top-0 md:w-full md:h-screen sm:z-50"
        initial={{ y: 1000 }}
        animate={{ y: 0 }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 300,
        }}
      >
        <div className="w-full">
          <div className="px-5 py-5 h-16 flex justify-between rounded-full">
            <Button variant="ghost" onClick={closeOverlays}>
              <ChevronLeft className="w-8 h-8" />
            </Button>

            <span>
              {current} / {images.length}
            </span>
            <div></div>
          </div>

          <div className="mx-auto max-w-5xl">
            <Carousel setApi={setApi} className="w-full">
              <CarouselContent>
                {[...images]
                  .sort((a, b) => a.index - b.index)
                  .map((image) => (
                    <CarouselItem key={image.id}>
                      <Image
                        src={image.url}
                        alt="Christmas Decoration"
                        width={1200}
                        height={1200}
                        className="h-[90vh] w-full rounded-xl object-cover object-center cursor-pointer"
                        onClick={() => setShowImageOverlay(true)}
                      />
                    </CarouselItem>
                  ))}
              </CarouselContent>
              <CarouselNext />
              <CarouselPrevious />
            </Carousel>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="sticky top-0 overflow-y-auto w-full h-screen z-50 bg-black md:hidden"
      initial={{ y: 1000 }}
      animate={{ y: 0 }}
      transition={{
        type: "spring",
        damping: 30,
        stiffness: 300,
      }}
    >
      <div className="w-full">
        <div className="px-5 py-5 h-16 flex justify-between">
          <Button variant="ghost" onClick={closeOverlays}>
            <ChevronLeft className="w-8 h-8" />
          </Button>

          <span>
            {current} / {images.length}
          </span>
          <div className="w-[15%]"></div>
        </div>
        <div className="flex justify-center items-center">
          <Carousel setApi={setMobileApi} className="w-full">
            <CarouselContent>
              {[...images]
                .sort((a, b) => a.index - b.index)
                .map((image) => (
                  <CarouselItem key={image.id}>
                    <Image
                      src={image.url}
                      alt="Christmas Decoration"
                      width={1200}
                      height={1200}
                      className="h-96 w-full object-cover cursor-pointer"
                      onClick={() => setShowImageOverlay(true)}
                    />
                  </CarouselItem>
                ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </motion.div>
  );
};
