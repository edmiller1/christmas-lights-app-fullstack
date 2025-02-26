import privateAxios from "@/lib/axios";
import { ReportDecorationArgs, ReportDecorationResponse } from "./types";

export const reportDecoration = async (data: ReportDecorationArgs) => {
  const response = await privateAxios.post<ReportDecorationResponse>(
    "/api/decoration/reportDecoration",
    data
  );

  if (response.status !== 200) {
    throw new Error(response.data.error);
  }

  return response.data.message;
};
