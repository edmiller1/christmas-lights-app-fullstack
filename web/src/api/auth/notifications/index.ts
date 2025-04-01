import privateAxios from "@/lib/axios";
import { Notification } from "@/lib/types";

interface ErrorResponse {
  error?: string;
}

export const getNotifications = async () => {
  const response = await privateAxios.get<Notification[]>(
    "/auth/notifications"
  );

  if (response.status !== 200) {
    if ("error" in response.data) {
      throw new Error(response.data.error as ErrorResponse["error"]);
    }
  }

  return response.data;
};
