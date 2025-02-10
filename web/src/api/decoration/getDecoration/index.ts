import axiosInstance from "@/lib/axios";
import { decoration } from "..";
import { Decoration } from "@/lib/types";

export const getDecoration = async (decorationId: string) => {
  const response = await axiosInstance.get<Decoration>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/decoration/getDecoration`,
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
