import privateAxios from "@/lib/axios";
import { HistoryDecoration } from "@/lib/types";

interface GetHistoryResponse {
  history: HistoryDecoration[];
  error?: string;
}

export const getHistory = async () => {
  const response = await privateAxios.get<GetHistoryResponse>("/api/history");

  if (response.status !== 200) {
    throw new Error(response.data.error);
  }

  return response.data.history;
};
