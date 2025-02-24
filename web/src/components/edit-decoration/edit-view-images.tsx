"use client";

import { useEffect, useState } from "react";
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
import { DecorationPicture, EditableImage } from "@/lib/types";
import { EditSortableItem } from "./edit-sortable-item";

interface Props {
  establishedImages: DecorationPicture[];
}

export const EditViewImages = ({ establishedImages }: Props) => {
  const {
    decreaseEditStep,
    increaseEditStep,
    editedImages,
    setEditedImages,
    deletedImages,
    setDeletedImages,
  } = useStore((state) => state);

  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (editedImages.length === 0) {
      setEditedImages([...establishedImages]);
    }
  }, [editedImages.length, setEditedImages, establishedImages]);

  const selectImage = (index: number) => {
    api?.scrollTo(index);
  };

  const handleSelectImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    console.log(files);

    // Process new images
    const newImages = await Promise.all(
      files.map(async (file, index) => {
        const base64 = await getFileBase64(file);
        return {
          id: generateUID(),
          url: base64,
          index: editedImages.length + index,
        };
      })
    );

    // // Filter out any duplicates based on base64Value
    // const uniqueImages = newImages.filter(
    //   (newImg) =>
    //     !editedImages.some(
    //       (existingImg) => existingImg.base64Value === newImg.base64Value
    //     )
    // );

    setEditedImages([...editedImages, ...newImages]);
  };

  const handleDeleteClick = (image: EditableImage, e: React.MouseEvent) => {
    e.stopPropagation();
    if (image.publicId) {
      setDeletedImages([...deletedImages, image.publicId]);
    }
    setImageToDelete(image.id);
    setOpenConfirmationDialog(true);
  };

  const deleteImage = () => {
    if (imageToDelete) {
      const reindexedImages = editedImages
        .filter((img) => img.id !== imageToDelete)
        .map((img, index) => ({
          ...img,
          index,
        }));
      setEditedImages(reindexedImages);
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
      const oldIndex = editedImages.findIndex((item) => item.id === active.id);
      const newIndex = editedImages.findIndex((item) => item.id === over.id);

      const reorderedImages = arrayMove(editedImages, oldIndex, newIndex);

      // Update indices to match new order
      const updatedImages = reorderedImages.map((image, index) => ({
        ...image,
        index,
      }));

      setEditedImages(updatedImages);
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
          {editedImages.map((image) => (
            <CarouselItem key={image.id} className="relative">
              <button
                onClick={(e) => handleDeleteClick(image, e)}
                className="absolute right-2 top-2 z-50 rounded-full bg-black px-1 py-1 opacity-80 animate-in hover:opacity-60"
              >
                <X className="h-4 w-4 text-white" />
              </button>
              {image.publicId ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image.url}
                  alt={image.id}
                  className="max-h-[400px] w-full rounded-lg object-cover"
                />
              ) : (
                <Image
                  src={image.url}
                  alt="Decoration"
                  width={400}
                  height={400}
                  className="max-h-[400px] w-full rounded-lg object-cover"
                  priority
                  blurDataURL={image.url}
                />
              )}
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
              items={editedImages.map((img) => img.id)}
              strategy={horizontalListSortingStrategy}
            >
              {editedImages.map((image, index) => (
                <EditSortableItem
                  key={image.id}
                  image={image}
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
          <Button variant="secondary" onClick={() => decreaseEditStep(1)}>
            Go back
          </Button>
          <Button onClick={() => increaseEditStep(1)}>Next</Button>
        </div>
      </DialogFooter>
    </>
  );
};
