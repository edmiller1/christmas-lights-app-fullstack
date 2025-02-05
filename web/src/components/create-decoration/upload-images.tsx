"use client";

import { CircleCheck, Images } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import useStore from "@/store/useStore";
import { generateUID, getFileBase64 } from "@/lib/helpers";

export const UploadImages = () => {
  const { decorationImages, setDecorationImages, increaseStep } = useStore(
    (state) => state
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    const newImages = await Promise.all(
      files.map(async (file, index) => {
        const base64String = await getFileBase64(file);
        return {
          id: generateUID(),
          url: URL.createObjectURL(file),
          index,
          base64Value: base64String,
        };
      })
    );

    setDecorationImages([...decorationImages, ...newImages]);
  };

  const handleSelectImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const newImages = await Promise.all(
      files.map(async (file, index) => {
        const base64String = await getFileBase64(file);
        return {
          id: generateUID(),
          url: URL.createObjectURL(file),
          index,
          base64Value: base64String,
        };
      })
    );

    setDecorationImages([...decorationImages, ...newImages]);
  };

  const handleSubmit = () => {
    increaseStep(1);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Upload images</DialogTitle>
        <DialogDescription>Add images to your decoration</DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-6">
        {decorationImages.length === 0 ? (
          <div
            className="mt-3 flex h-[22rem] flex-col items-center justify-center rounded-xl border border-dashed border-gray-500"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Images className="h-12 w-12" />
            <p className="hidden sm:mb-5 sm:mt-1 sm:block sm:font-normal">
              Drag photos here
            </p>
            <Button className="mb-2">
              <Label className="cursor-pointer">
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleSelectImage}
                />
                Select from computer
              </Label>
            </Button>
            <span className="mb-3 text-sm text-gray-500">
              Images up to 6MB, Max 8
            </span>
          </div>
        ) : (
          <div
            className="mt-3 flex h-[22rem] flex-col items-center justify-center rounded-xl border border-dashed border-gray-500 py-8"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <CircleCheck className="h-12 w-12" />
            {decorationImages.length === 1 ? (
              <p className="text-base dark:text-gray-100">
                {decorationImages.length} image selected 🎉
              </p>
            ) : (
              <p className="text-base dark:text-gray-100">
                {decorationImages.length} images selected 🎉
              </p>
            )}
            <Button className="mt-2">
              <Label className="cursor-pointer">
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleSelectImage}
                />
                Select more images
              </Label>
            </Button>
          </div>
        )}
      </div>
      <DialogFooter>
        <div className="flex w-full items-center justify-end">
          <Button
            disabled={decorationImages.length === 0}
            onClick={handleSubmit}
          >
            Next
          </Button>
        </div>
      </DialogFooter>
    </>
  );
};
