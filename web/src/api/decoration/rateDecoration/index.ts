import privateAxios from "@/lib/axios";

interface RateDecorationArgs {
  decorationId: string;
  rating: number;
}

export const rateDecoration = async (data: RateDecorationArgs) => {
  const response = await privateAxios.post("/decoration/rateDecoration", data);

  if (response.status !== 200) {
    throw new Error(response.data.error);
  }

  return response.data;
};
