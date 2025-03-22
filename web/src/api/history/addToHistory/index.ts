import privateAxios from "@/lib/axios";

interface AddToHistoryResponse {
  message: string;
  error?: string;
}

export const addToHistory = async (decorationId: string) => {
  const response = await privateAxios.post<AddToHistoryResponse>(
    "/api/history/addToHistory",

    null,
    {
      params: {
        decorationId,
      },
    }
  );

  if (response.status !== 200) {
    throw new Error(response.data.error);
  }

  return response.data.message;
};
