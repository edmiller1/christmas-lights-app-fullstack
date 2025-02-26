export interface ReportDecorationArgs {
  decorationId: string;
  reasons: string[];
  additionalInfo: string;
}

export interface ReportDecorationResponse {
  message: string;
  error?: string;
}
