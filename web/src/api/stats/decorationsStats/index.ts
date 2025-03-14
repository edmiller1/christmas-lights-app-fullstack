import privateAxios from "@/lib/axios";

interface DecorationsStatsResponse {
  totalDecorations: number;
  verifiedDecorations: number;
  totalViews: number;
  averageRating: string;
  mostViewedDecoration: {
    id: string;
    name: string;
    viewCount: number;
  };
  highedtRatedDecoration: {
    id: string;
    name: string;
    averageRating: number;
  };
  error?: string;
}

export const getDecorationsStats = async () => {
  const response = await privateAxios.get<DecorationsStatsResponse>(
    "/api/stats/decorationsStats"
  );

  if (response.status !== 200) {
    throw new Error(response.data.error);
  }

  return response.data;
};
