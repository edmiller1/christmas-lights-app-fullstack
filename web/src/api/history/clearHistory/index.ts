import privateAxios from "@/lib/axios";

interface ClearHistoryResponse {
  message: string;
  error?: string;
}

export const clearHistory = async () => {
  const response = await privateAxios.delete<ClearHistoryResponse>(
    "/history/clearHistory"
  );

  if (response.status !== 200) {
    throw new Error(response.data.error);
  }

  return response.data.message;
};
