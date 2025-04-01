import { getSupabaseSession } from "@/lib/supabase/getSupabaseSession";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getSupabaseSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const year = searchParams.get("year");

    if (!year) {
      return NextResponse.json({ error: "Year is required" }, { status: 400 });
    }

    const response = await axios.get(
      `${process.env.BACKEND_URL}/api/stats/yearlyStats`,
      {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        params: {
          year,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching yearly stats:", error);
      return NextResponse.json(
        {
          error: error.response?.data?.error || "Failed to fetch yearly stats",
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
