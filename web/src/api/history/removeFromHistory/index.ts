import privateAxios from "@/lib/axios";

interface RemoveFromHistoryResponse {
  message: string;
  error?: string;
}

export const removeFromHistory = async (decorationId: string) => {
  const response = await privateAxios.delete<RemoveFromHistoryResponse>(
    "/api/history/removeFromHistory",
    {
      params: { decorationId },
    }
  );

  if (response.status !== 200) {
    throw new Error(response.data.error);
  }

  return response.data.message;
};
