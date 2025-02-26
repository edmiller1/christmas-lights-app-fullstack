import privateAxios from "@/lib/axios";
import { UpdateDecorationArgs } from "./types";

export const updateDecoration = async (data: UpdateDecorationArgs) => {
  const response = await privateAxios.put<{ message: string; error?: string }>(
    "/api/decoration/updateDecoration",
    data
  );

  if (response.status !== 200) {
    throw new Error(response.data.error);
  }

  return response.data.message;
};
