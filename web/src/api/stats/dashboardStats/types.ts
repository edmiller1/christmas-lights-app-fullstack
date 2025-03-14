export interface DashboardStatsResponse {
  totalViews: number;
  averageRating: string | number;
  totalRatings: number;
  totalDecorations: number;
  verifiedDecorations: number;
  viewsChange: number;
  currentMonthViews: number;
  previousMonthViews: number;
  error?: string;
}
