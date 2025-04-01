import privateAxios from "@/lib/axios";
import { User } from "@/lib/types";

export const getUser = async (): Promise<User> => {
  const response = await privateAxios.get<User>("/auth/user");

  if (response.status !== 200) {
    throw new Error("Failed to get user");
  }

  return response.data;
};
