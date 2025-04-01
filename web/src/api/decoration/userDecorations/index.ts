import privateAxios from "@/lib/axios";
import { Decoration } from "@/lib/types";

interface UserDecorationsResponse {
  decorations: Decoration[];
  error?: string;
}

export const getUserDecorations = async () => {
  const response = await privateAxios.get<UserDecorationsResponse>(
    "/decoration/userDecorations"
  );

  if (response.status !== 200) {
    throw new Error(response.data.error);
  }

  return response.data.decorations;
};
