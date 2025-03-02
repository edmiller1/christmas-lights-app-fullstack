import privateAxios from "@/lib/axios";
import { DashboardStatsResponse } from "./types";

export const getDashboardStats = async () => {
  const response = await privateAxios.get<DashboardStatsResponse>(
    "/api/stats/dashboardStats"
  );

  if (response.status !== 200) {
    throw new Error(response.data.error);
  }

  return response.data;
};
