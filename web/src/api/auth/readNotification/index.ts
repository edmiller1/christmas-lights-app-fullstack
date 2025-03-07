import privateAxios from "@/lib/axios";

export const markNotificationAsRead = async (notificationId: string) => {
  const response = await privateAxios.put<{ message: string; error?: string }>(
    "/api/auth/readNotification",
    {
      notificationId,
    }
  );

  if (response.status !== 200) {
    throw new Error(response.data.error);
  }

  return response.data.message;
};
