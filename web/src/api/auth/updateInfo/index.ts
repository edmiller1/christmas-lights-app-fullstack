import privateAxios from "@/lib/axios";

interface UpdateInfoArgs {
  name: string;
  email: string;
}

export const updateInfo = async (info: UpdateInfoArgs) => {
  const response = await privateAxios.put("/auth/updateInfo", info);

  if (response.status !== 200) {
    throw new Error(response.data.error);
  }

  return response.data.message;
};
