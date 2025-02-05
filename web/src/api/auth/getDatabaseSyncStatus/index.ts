import { createRequest } from "@/lib/create-request";
import { GetDatabaseSyncStatusResponse } from "./types";

export const getDatabaseSyncStatus = async (
  token: string
): Promise<GetDatabaseSyncStatusResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/callback`,
    createRequest(token)
  );

  if (!response.ok) {
    throw new Error("Failed to sync database");
  }

  return response.json();
};
