"use client";

import { HeartButton } from "@/components/decoration/heart-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isHistoryDecoration } from "@/lib/helpers";
import { DecorationCardItem } from "@/lib/types";
import { Clock, Eye, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { RemoveFromHistoryButton } from "@/components/decoration/remove-from-history-button";

interface Props {
  decoration: DecorationCardItem;
}

export const DecorationCard = ({ decoration }: Props) => {
  const isHistory = isHistoryDecoration(decoration);

  const viewedDate = isHistory
    ? formatDistanceToNow(new Date(decoration.viewedAt), { addSuffix: true })
    : null;

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full bg-gray-100">
        <Image
          src={decoration.images[0].url}
          alt={decoration.name}
          fill
          className="object-cover object-center"
        />
      </div>
      <CardHeader className="p-3">
        <CardTitle>{decoration.name}</CardTitle>
        <CardDescription className="flex items-center text-sm">
          <MapPin className="w-3 h-3 mr-1" />
          {decoration.city}, {decoration.region}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <Eye className="w-4 h-4 mr-1 text-muted-foreground" />
            <span>{decoration.viewCount}</span>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-1 text-muted-foreground" />
            <span>{Number(decoration.averageRating)?.toFixed(1) || "0.0"}</span>
          </div>
        </div>
        {isHistory && viewedDate && (
          <div className="flex items-center text-sm mt-2">
            <Clock className="w-4 h-4 mr-1 text-muted-foreground" /> Viewed{" "}
            {viewedDate}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between p-3">
        <Link href={`/decorations/${decoration.id}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
        <div>
          <HeartButton decorationId={decoration.id} />
          <RemoveFromHistoryButton decorationId={decoration.id} />
        </div>
      </CardFooter>
    </Card>
  );
};
