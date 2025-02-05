"use client";

import { HousePlus } from "lucide-react";

import { Button } from "@/components/ui/button";

import useStore from "@/store/useStore";

export const CreateButton = () => {
  const { setDialogOpen } = useStore((state) => state);

  return (
    <Button
      variant="outline"
      className="rounded-lg"
      onClick={() => setDialogOpen(true)}
    >
      <HousePlus />
      <span className="ml-1">Create</span>
    </Button>
  );
};
