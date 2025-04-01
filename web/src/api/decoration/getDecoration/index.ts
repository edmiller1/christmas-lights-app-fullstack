import privateAxios from "@/lib/axios";
import { Decoration, DecorationPicture, Rating } from "@/lib/types";

interface DecorationResponse extends Decoration {
  averageRating: string;
  images: DecorationPicture[];
  ratingCount: number;
  viewCount: number;
  ratings: Rating[];
  error?: string;
}

export const getDecoration = async (decorationId: string) => {
  const response = await privateAxios.get<DecorationResponse>(
    "/decoration/getDecoration",
    {
      params: {
        decorationId,
      },
    }
  );

  if (response.status !== 200) {
    throw new Error(response.data.error);
  }

  return response.data;
};
