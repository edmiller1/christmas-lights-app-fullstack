import { EditDecoration } from "@/components/edit-decoration/edit-decoration";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Decoration } from "@/lib/types";
import { Calendar, Edit, Eye, MapPin, Star } from "lucide-react";
import Image from "next/image";
import { DeleteDecorationDialog } from "./delete-decoration-dialog";
import useStore from "@/store/useStore";
import { getVerificationBadge } from "@/components/decoration/get-verification-badge";
import Link from "next/link";

interface Props {
  decoration: Decoration;
}

export const UserDecorationCard = ({ decoration }: Props) => {
  const { setEditDialogOpen } = useStore((state) => state);

  return (
    <>
      <EditDecoration
        establishedImages={decoration.images}
        decorationName={decoration.name}
        decorationAddress={decoration.address}
        decorationId={decoration.id}
      />
      <Card className="overflow-hidden">
        <div className="relative h-48 w-full bg-gray-100">
          <Image
            src={decoration.images[0].url}
            alt={decoration.name}
            fill
            className="object-cover object-center"
          />
          <div className="absolute top-2 left-2">
            {getVerificationBadge(decoration)}
          </div>
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
              <span>
                {Number(decoration.averageRating)?.toFixed(1) || "0.0"}
              </span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1 text-muted-foreground" />
              <span>{decoration.year}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between p-3">
          <Link href={`/decorations/${decoration.id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditDialogOpen(true)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <DeleteDecorationDialog
              decorationId={decoration.id}
              decorationName={decoration.name}
            />
          </div>
        </CardFooter>
      </Card>
    </>
  );
};
