import privateAxios from "@/lib/axios";

interface SettingsUpdate {
  [key: string]: boolean;
}

export const updateSettings = async (settings: SettingsUpdate) => {
  const response = await privateAxios.put(
    "/api/auth/updateSettings",
    JSON.stringify(settings)
  );

  if (response.status !== 200) {
    throw new Error(response.data.error);
  }

  return response.data.message;
};
