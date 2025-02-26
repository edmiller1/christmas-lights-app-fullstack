import privateAxios from "@/lib/axios";

interface SaveDecorationResponse {
  message: string;
  error?: string;
}

export const saveDecoration = async (decorationId: string) => {
  const response = await privateAxios.post<SaveDecorationResponse>(
    "/api/decoration/saveDecoration",
    null,
    {
      params: {
        decorationId,
      },
    }
  );

  if (response.status !== 200) {
    throw new Error(response.data.error);
  }

  return response.data.message;
};
