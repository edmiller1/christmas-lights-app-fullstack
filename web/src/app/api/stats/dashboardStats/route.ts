import { DashboardStatsResponse } from "@/api/stats/dashboardStats/types";
import { getSupabaseSession } from "@/lib/supabase/getSupabaseSession";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getSupabaseSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await axios.get<DashboardStatsResponse>(
      `${process.env.BACKEND_URL}/api/stats/dashboardStats`,
      {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching dashboard stats:", error);
      return NextResponse.json(
        {
          error:
            error.response?.data?.error || "Failed to fetch dashboard stats",
        },
        { status: error.response?.status || 500 }
      );
    }
    console.error("Unknown error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
