export interface DailyStat {
  date: string;
  views: number;
  ratings: number;
}

export interface YearlyStatsResponse {
  year: string;
  totalDecorations: number;
  totalViews: number;
  totalRatings: number;
  peakDay: string;
  peakViews: number;
  stats: DailyStat[];
  error?: string;
}
