import privateAxios from "@/lib/axios";

export const deleteAllNotifications = async () => {
  const response = await privateAxios.post<{ message: string; error?: string }>(
    "/api/auth/deleteAllNotifications"
  );

  if (response.status !== 200) {
    throw new Error(response.data.error);
  }

  return response.data.message;
};
