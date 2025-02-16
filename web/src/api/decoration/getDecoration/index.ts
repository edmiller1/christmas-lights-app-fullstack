import { publicAxios } from "@/lib/axios";
import { Decoration, DecorationPicture } from "@/lib/types";

interface DecorationResponse extends Decoration {
  averageRating: string;
  images: DecorationPicture[];
  ratingCount: number;
  viewCount: number;
}

export const getDecoration = async (decorationId: string) => {
  const response = await publicAxios.get<DecorationResponse>(
    `/api/decoration/getDecoration`,
    {
      params: {
        decorationId,
      },
    }
  );

  if (!response.data) {
    throw new Error("Failed to get decoration");
  }

  return response.data;
};
