import axiosInstance from "@/lib/axios";
import { User } from "@/lib/types";

export const getUser = async (): Promise<User> => {
  const response = await axiosInstance.get<User>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/user`
  );

  if (response.status !== 200) {
    throw new Error("Failed to get user");
  }

  return response.data;
};
