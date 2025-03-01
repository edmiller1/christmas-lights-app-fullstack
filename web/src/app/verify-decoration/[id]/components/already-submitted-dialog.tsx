"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

interface Props {
  decorationId: string;
}

export const AlreadySubmittedDialog = ({ decorationId }: Props) => {
  const router = useRouter();

  return (
    <Dialog defaultOpen>
      <DialogContent
        hideClose
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Already Submitted</DialogTitle>
          <DialogDescription>
            This decoration has either already been submitted for verification
            or is verified.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => router.push(`/decorations/${decorationId}`)}>
            Got it, thanks!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
