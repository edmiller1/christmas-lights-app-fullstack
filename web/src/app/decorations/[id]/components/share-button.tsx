"use client";

import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";

export const ShareButton = () => {
  return (
    <Button variant="ghost">
      <Share className="w-4 h-4" />
      Share
    </Button>
  );
};
