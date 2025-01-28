import { GetDatabaseSyncStatusResponse } from "./types";

export const auth = {
  getDatabaseSyncStatus: async (
    token: string
  ): Promise<GetDatabaseSyncStatusResponse> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/callback`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to sync database");
    }

    return response.json();
  },
};
