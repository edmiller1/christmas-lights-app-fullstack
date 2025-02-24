import privateAxios from "@/lib/axios";
import { UpdateDecorationArgs } from "./types";

export const updateDecoration = async (data: UpdateDecorationArgs) => {
  const response = await privateAxios.put<{ message: string }>(
    "/api/decoration/updateDecoration",
    data
  );

  if (response.status !== 200) {
    throw new Error("Failed to update decoration, Please try again.");
  }

  return response.data.message;
};
