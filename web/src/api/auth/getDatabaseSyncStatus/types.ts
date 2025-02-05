export interface GetDatabaseSyncStatusResponse {
  isSynced: boolean;
  redirectUrl: string;
}

export interface GetDatabaseSyncStatusArgs {
  accessToken: string;
}
