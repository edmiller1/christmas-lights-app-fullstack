import { CreateDecorationArgs, createDecorationResponse } from "./types";
import privateAxios from "@/lib/axios";

export const createDecoration = async (data: CreateDecorationArgs) => {
  const response = await privateAxios.post<createDecorationResponse>(
    `/decoration/createDecoration`,
    data
  );

  if (response.status !== 200) {
    throw new Error(response.data.error);
  }

  return response.data;
};
