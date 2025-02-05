"use client";

import { useState } from "react";
import Image from "next/image";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Plus, X } from "lucide-react";

import type { CarouselApi } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { generateUID, getFileBase64 } from "@/lib/helpers";
import useStore from "@/store/useStore";
import { ConfirmationDialog } from "../confirmation-dialog";
import { SortableItem } from "./sortable-item";

export const ViewImages = () => {
  const { decorationImages, setDecorationImages, increaseStep, decreaseStep } =
    useStore((state) => state);

  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  const [api, setApi] = useState<CarouselApi>();

  const selectImage = (index: number) => {
    api?.scrollTo(index);
  };

  const handleSelectImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    // Process new images
    const newImages = await Promise.all(
      files.map(async (file, index) => {
        const base64String = await getFileBase64(file);
        return {
          id: generateUID(),
          url: URL.createObjectURL(file),
          index: decorationImages.length + index, // Adjust index based on existing array length
          base64Value: base64String,
        };
      })
    );

    // Filter out any duplicates based on base64Value
    const uniqueImages = newImages.filter(
      (newImg) =>
        !decorationImages.some(
          (existingImg) => existingImg.base64Value === newImg.base64Value
        )
    );

    setDecorationImages([...decorationImages, ...uniqueImages]);
  };

  const handleDeleteClick = (imageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setImageToDelete(imageId);
    setOpenConfirmationDialog(true);
  };

  const deleteImage = () => {
    if (imageToDelete) {
      setDecorationImages(
        decorationImages.filter((img) => img.id !== imageToDelete)
      );
      setImageToDelete(null);
    }
    setOpenConfirmationDialog(false);
    toast.success("Image deleted successfully");
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = decorationImages.findIndex(
        (item) => item.id === active.id
      );
      const newIndex = decorationImages.findIndex(
        (item) => item.id === over.id
      );

      const reorderedImages = arrayMove(decorationImages, oldIndex, newIndex);

      // Update indices to match new order
      const updatedImages = reorderedImages.map((image, index) => ({
        ...image,
        index,
      }));

      setDecorationImages(updatedImages);
      console.log(updatedImages);
    }
  };

  return (
    <>
      <ConfirmationDialog
        open={openConfirmationDialog}
        setOpen={setOpenConfirmationDialog}
        title="Are you sure?"
        description="This will permanently delete the image."
        cancelFunction={() => setOpenConfirmationDialog(false)}
        confirmFunction={deleteImage}
        confirmText="Delete"
      />
      <DialogHeader>
        <DialogTitle>View images</DialogTitle>
        <DialogDescription>Add, remove and reorder images</DialogDescription>
      </DialogHeader>
      <Carousel setApi={setApi}>
        <CarouselContent>
          {decorationImages.map((image) => (
            <CarouselItem key={image.id} className="relative">
              <button
                onClick={(e) => handleDeleteClick(image.id, e)}
                className="absolute right-2 top-2 z-50 rounded-full bg-black px-1 py-1 opacity-80 animate-in hover:opacity-60"
              >
                <X className="h-4 w-4 text-white" />
              </button>
              <Image
                src={image.url}
                alt="Decoration"
                width={400}
                height={400}
                className="max-h-[400px] w-full rounded-lg object-cover"
                priority
                blurDataURL={image.url}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-1" />
        <CarouselNext className="absolute right-1" />
      </Carousel>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Carousel className="mt-2" opts={{ watchDrag: false }}>
          <CarouselContent>
            <SortableContext
              items={decorationImages.map((img) => img.id)}
              strategy={horizontalListSortingStrategy}
            >
              {decorationImages.map((image, index) => (
                <SortableItem
                  key={image.id}
                  id={image.id}
                  url={image.url}
                  index={index}
                  selectImage={selectImage}
                  handleDeleteClick={handleDeleteClick}
                />
              ))}
            </SortableContext>
            <CarouselItem className="basis-1/3">
              <button className="flex h-full w-full items-center justify-center rounded-lg border border-gray-500 hover:bg-black">
                <Label className="cursor-pointer">
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleSelectImage}
                  />
                  <Plus className="h-12 w-12 rounded-full border p-1" />
                </Label>
              </button>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="absolute left-1" />
          <CarouselNext className="absolute right-1" />
        </Carousel>
      </DndContext>
      <DialogFooter>
        <div className="flex w-full items-center justify-between">
          <Button variant="secondary" onClick={() => decreaseStep(2)}>
            Go back
          </Button>
          <Button onClick={() => increaseStep(2)}>Next</Button>
        </div>
      </DialogFooter>
    </>
  );
};
