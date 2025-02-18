"use client";

import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Share } from "lucide-react";

export const ShareButton = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Button variant="ghost">
        <Share className="w-4 h-4" />
        Share
      </Button>
    );
  }
  return (
    <Button variant="ghost">
      <Share className="w-12 h-12" />
    </Button>
  );
};
