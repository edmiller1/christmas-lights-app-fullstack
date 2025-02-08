"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";

import useStore from "@/store/useStore";
import { ConfirmationDialog } from "../confirmation-dialog";
import { CreateForm } from "./create-form";
import { UploadImages } from "./upload-images";
import { ViewImages } from "./view-images";

export const CreateDecoration = () => {
  const {
    dialogOpen,
    setDialogOpen,
    step,
    setStep,
    decorationImages,
    setDecorationImages,
  } = useStore((state) => state);

  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);

  const closeDialog = () => {
    if (decorationImages.length > 0) {
      setOpenConfirmationDialog(true);
    } else {
      setDialogOpen(false);
    }
  };

  const discardCreation = () => {
    setStep(1);
    setDecorationImages([]);
    setDialogOpen(false);
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
        confirmFunction={discardCreation}
        confirmText="Discard"
      />
      <Dialog open={dialogOpen} onOpenChange={() => setDialogOpen(false)}>
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
          {(step === 1 || decorationImages.length === 0) && <UploadImages />}
          {step === 2 && <ViewImages />}
          {step === 3 && <CreateForm />}
        </DialogContent>
      </Dialog>
    </>
  );
};
