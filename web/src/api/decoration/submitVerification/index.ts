import privateAxios from "@/lib/axios";

export const submitDecorationVerification = async (
  decorationId: string,
  document: string
) => {
  const response = await privateAxios.post(`/decoration/submitVerification`, {
    decorationId,
    document,
  });

  if (response.status !== 200) {
    throw new Error(response.data.error);
  }

  return response.data.message;
};
