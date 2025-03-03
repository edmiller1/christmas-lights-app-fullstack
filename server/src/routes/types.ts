export interface SyncResponse {
  isSynced: boolean;
  redirectUrl: string;
}

export interface CloudinaryImageResponse {
  id: string;
  url: string;
}

export interface UpdateDecorationArgs {
  decorationId: string;
  name: string;
  address: string;
  addressId?: string;
  images: Array<{
    id?: string;
    publicId?: string;
    url: string;
    index: number;
  }>;
  deletedImageIds: string[];
}

export interface EditableImage {
  id: string;
  index: number;
  url: string;
  publicId?: string;
  decorationId?: string;
  base64Value?: string;
}

export interface ReportDecorationArgs {
  decorationId: string;
  reasons: string[];
  additionalInfo: string;
}

export interface RateDecorationArgs {
  decorationId: string;
  rating: number;
}

export interface SubmitVerificationArgs {
  decorationId: string;
  document: string;
  verification: string;
}

export interface UpdateSettingsArgs {
  [key: string]: boolean;
}

export interface UpdateInfoArgs {
  name: string;
  email: string;
}

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
  peakDay: string | null;
  peakViews: number;
  stats: DailyStat[];
}
