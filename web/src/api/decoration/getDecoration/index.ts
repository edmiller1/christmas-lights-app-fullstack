import { publicAxios } from "@/lib/axios";
import { Decoration } from "@/lib/types";

export const getDecoration = async (decorationId: string) => {
  const response = await publicAxios.get<Decoration>(
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
