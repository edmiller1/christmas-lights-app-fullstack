import privateAxios from "@/lib/axios";

export const deleteDecoration = async (decorationId: string) => {
  const response = await privateAxios.delete("/decoration/deleteDecoration", {
    data: { decorationId },
  });

  if (response.status !== 200) {
    throw new Error(response.data.error);
  }

  return response.data;
};
