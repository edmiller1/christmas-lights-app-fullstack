import { GetDatabaseSyncStatusResponse } from "./types";
import privateAxios from "@/lib/axios";

export const getDatabaseSyncStatus =
  async (): Promise<GetDatabaseSyncStatusResponse> => {
    const response = await privateAxios.get<GetDatabaseSyncStatusResponse>(
      "/auth/callback"
    );

    if (response.status !== 200) {
      throw new Error("Failed to sync database");
    }

    return response.data;
  };
