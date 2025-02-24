"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";

import { ConfirmationDialog } from "../confirmation-dialog";
import useStore from "@/store/useStore";
import { DecorationPicture } from "@/lib/types";
import { EditViewImages } from "./edit-view-images";
import { EditForm } from "./edit-form";

interface Props {
  establishedImages: DecorationPicture[];
  decorationName: string;
  decorationAddress: string;
  decorationId: string;
}

export const EditDecoration = ({
  establishedImages,
  decorationAddress,
  decorationName,
  decorationId,
}: Props) => {
  const {
    editDialogOpen,
    setEditDialogOpen,
    editStep,
    setEditStep,
    editedImages,
    deletedImages,
    setEditedImages,
    setDeletedImages,
  } = useStore((state) => state);

  const [openConfirmationDialog, setOpenConfirmationDialog] =
    useState<boolean>(false);

  const closeDialog = () => {
    if (editedImages.length > 0 || deletedImages.length > 0) {
      setOpenConfirmationDialog(true);
    } else {
      setEditDialogOpen(false);
    }
  };

  const discardChanges = () => {
    setEditStep(1);
    setEditedImages([]);
    setDeletedImages([]);
    setEditDialogOpen(false);
    setOpenConfirmationDialog(false);
  };

  return (
    <>
      <ConfirmationDialog
        cancelFunction={() => setOpenConfirmationDialog(false)}
        open={openConfirmationDialog}
        setOpen={setOpenConfirmationDialog}
        title="Discard Decoration?"
        description="If you leave, your edits won't be saved."
        confirmFunction={discardChanges}
        confirmText="Discard"
      />
      <Dialog
        open={editDialogOpen}
        onOpenChange={() => setEditDialogOpen(false)}
      >
        <DialogContent
          hideClose
          className="sm:max-w-[525px]"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <button
            onClick={closeDialog}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          {editStep === 1 && (
            <EditViewImages establishedImages={establishedImages} />
          )}
          {editStep === 2 && (
            <EditForm
              decorationName={decorationName}
              decorationAddress={decorationAddress}
              decorationId={decorationId}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
