import privateAxios from "@/lib/axios";

export const markNotificationAsUnread = async (notificationId: string) => {
  const response = await privateAxios.put<{ message: string; error?: string }>(
    "/auth/unreadNotification",
    {
      notificationId,
    }
  );

  if (response.status !== 200) {
    throw new Error(response.data.error);
  }

  return response.data.message;
};
