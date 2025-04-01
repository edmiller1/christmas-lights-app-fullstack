import { NextRequest, NextResponse } from "next/server";
import { getSupabaseSession } from "@/lib/supabase/getSupabaseSession";
import axios from "axios";

export async function GET(request: NextRequest) {
  try {
    const session = await getSupabaseSession();

    const searchParams = request.nextUrl.searchParams;
    const decorationId = searchParams.get("decorationId");

    if (!decorationId) {
      return NextResponse.json(
        { error: "Decoration ID is required" },
        { status: 400 }
      );
    }

    const response = await axios.get(
      `${process.env.BACKEND_URL}/api/decoration/getDecoration`,
      {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        params: {
          decorationId,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching decoration:", error);
      return NextResponse.json(
        {
          error: error.response?.data?.error || "Failed to fetch decoration",
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
