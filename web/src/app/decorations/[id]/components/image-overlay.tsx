import { Button } from "@/components/ui/button";
import { ChevronLeft, Heart, Share } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { DecorationPicture } from "@/lib/types";

interface Props {
  setShowImageOverlay: (showImageOverlay: boolean) => void;
  images: DecorationPicture[] | undefined;
  setShowImageCarousel: (showImageCarousel: boolean) => void;
}

export const ImagesOverlay = ({
  images,
  setShowImageOverlay,
  setShowImageCarousel,
}: Props) => {
  const selectImage = () => {
    setShowImageOverlay(false);
    setShowImageCarousel(true);
  };

  return (
    <>
      <motion.div
        className="sticky top-0 overflow-y-auto w-full h-screen z-50 bg-background md:hidden"
        initial={{ y: 1000 }}
        animate={{ y: 0 }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 300,
        }}
      >
        <div className="w-full">
          <div className="px-5 py-5 h-16">
            <ChevronLeft
              className="w-8 h-8"
              onClick={() => setShowImageOverlay(false)}
            />
          </div>
          {images ? (
            <div className="px-3" onClick={selectImage}>
              <Image
                src={images[0].url}
                alt="Christmas Decoration"
                width={1200}
                height={1200}
                className="h-64 w-full rounded-xl object-cover"
              />
            </div>
          ) : null}
          <div className="gap-4 grid grid-cols-2 mt-5 px-3">
            {images
              ?.filter((_, index) => index !== 0)
              .map((image, i) => (
                <Image
                  key={image.id}
                  src={image.url}
                  alt="Christmas Decoration"
                  width={250}
                  height={250}
                  className={`${
                    i % 2 === 0
                      ? "aspect-square w-full object-cover rounded-xl"
                      : i % 4 === 0
                      ? "h-auto object-cover rounded-xl max-w-full"
                      : "aspect-video w-full object-cover rounded-xl"
                  }`}
                  onClick={selectImage}
                />
              ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        className="hidden md:block md:overflow-y-auto md:fixed md:bottom-0 md:left-0 md:right-0 md:top-0 md:w-full md:h-screen md:z-50 bg-background"
        initial={{ y: 1000 }}
        animate={{ y: 0 }}
        exit={{ y: 1000 }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 300,
        }}
      >
        <div className="w-full">
          <div className="sticky bg-background top-0 flex justify-between items-center px-5 py-5 h-16 border-b z-50">
            <Button variant="ghost" onClick={() => setShowImageOverlay(false)}>
              <ChevronLeft className="w-8 h-8" />
            </Button>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                onClick={() => setShowImageOverlay(false)}
              >
                <Share className="mr-1 h-6 w-6" />
                <span>Share</span>
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowImageOverlay(false)}
              >
                <Heart className="mr-1 h-6 w-6" />
                <span>Save</span>
              </Button>
            </div>
          </div>
          <div className="mx-72 mt-10 2xl:mx-[34rem]">
            {images ? (
              <Image
                src={images[0].url}
                alt="Christmas Decoration"
                width={1200}
                height={1200}
                className="h-96 w-full rounded-xl object-cover cursor-pointer"
                onClick={selectImage}
              />
            ) : null}
            <div className="mt-5 gap-5 columns-2 mb-8">
              {images
                ?.filter((_, index) => index !== 0)
                .map((image, i) => (
                  <Image
                    key={image.id}
                    src={image.url}
                    alt="Christmas Decoration"
                    width={300}
                    height={300}
                    className={`${
                      i % 2 === 0
                        ? "aspect-square w-full object-cover rounded-xl mb-5 cursor-pointer"
                        : i % 4 === 0
                        ? "h-auto object-cover rounded-xl max-w-full mb-5 cursor-pointer"
                        : "aspect-video w-full object-cover rounded-xl mb-5 cursor-pointer"
                    }`}
                    onClick={selectImage}
                  />
                ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};
