import privateAxios from "@/lib/axios";

export const markAllNotificationsAsRead = async () => {
  const response = await privateAxios.put<{ message: string; error?: string }>(
    "/auth/readAllNotifications"
  );

  if (response.status !== 200) {
    throw new Error(response.data.error);
  }

  return response.data.message;
};
