"use client";

import Image from "next/image";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";

import { CarouselItem } from "@/components/ui/carousel";
import { EditableImage } from "@/lib/types";

interface Props {
  image: EditableImage;
  index: number;
  selectImage: (index: number) => void;
  handleDeleteClick: (image: EditableImage, e: React.MouseEvent) => void;
}

export const EditSortableItem = ({
  index,
  image,
  selectImage,
  handleDeleteClick,
}: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <CarouselItem className="relative basis-1/3">
      {/* Main container for the item */}
      <div
        ref={setNodeRef}
        style={style}
        className="relative h-full w-full"
        {...attributes}
        {...listeners}
      >
        {/* Click overlay */}
        <div
          className="absolute inset-0"
          onMouseDown={() => {
            selectImage(index);
          }}
        >
          <button
            onMouseDown={(e) => {
              e.stopPropagation();
              handleDeleteClick(image, e);
            }}
            className="absolute right-2 top-2 z-50 rounded-full bg-black px-1 py-1 opacity-80 animate-in hover:opacity-60"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Image */}
        <Image
          src={image.url}
          alt="Decoration"
          width={400}
          height={400}
          className="max-h-[100px] w-full rounded-lg object-cover"
          priority
          blurDataURL={image.url}
        />
      </div>
    </CarouselItem>
  );
};
