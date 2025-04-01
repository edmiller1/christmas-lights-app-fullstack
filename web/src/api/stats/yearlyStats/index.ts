import privateAxios from "@/lib/axios";
import { YearlyStatsResponse } from "./types";

export const getYearlyStats = async (year: string) => {
  const response = await privateAxios.get<YearlyStatsResponse>(
    "/stats/yearlyStats",
    {
      params: {
        year,
      },
    }
  );

  if (response.status !== 200) {
    throw new Error(response.data.error);
  }

  return response.data;
};
