import axiosInstance from "@/lib/axios";
import { CreateDecorationArgs, createDecorationResponse } from "./types";

export const createDecoration = async (data: CreateDecorationArgs) => {
  const response = await axiosInstance.post<createDecorationResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/decoration/createDecoration`,
    data
  );

  if (response.status !== 200) {
    throw new Error("Failed to create decoration, Please try again.");
  }

  return response.data;
};
