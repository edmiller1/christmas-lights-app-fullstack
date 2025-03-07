import privateAxios from "@/lib/axios";

export const deleteNotification = async (notificationId: string) => {
  const response = await privateAxios.post<{ message: string; error?: string }>(
    "/api/auth/deleteNotification",
    {
      notificationId,
    }
  );

  if (response.status !== 200) {
    throw new Error(response.data.error);
  }

  return response.data.message;
};
