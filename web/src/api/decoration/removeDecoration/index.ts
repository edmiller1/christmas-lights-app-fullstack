import privateAxios from "@/lib/axios";

interface RemoveDecorationResponse {
  message: string;
}

export const removeDecoration = async (decorationId: string) => {
  const response = await privateAxios.post<RemoveDecorationResponse>(
    "/api/decoration/removeDecoration",
    null,
    {
      params: {
        decorationId,
      },
    }
  );

  if (response.status !== 200) {
    throw new Error("Failed to remove decoration");
  }

  return response.data.message;
};
