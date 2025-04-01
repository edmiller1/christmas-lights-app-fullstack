import { NextRequest, NextResponse } from "next/server";
import { getSupabaseSession } from "@/lib/supabase/getSupabaseSession";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const session = await getSupabaseSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { decorationId, rating }: { decorationId: string; rating: number } =
      await request.json();

    if (!decorationId || !rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const response = await axios.post(
      `${process.env.BACKEND_URL}/api/decoration/rateDecoration`,
      {
        decorationId,
        rating,
      },
      {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error rating decoration:", error);
      return NextResponse.json(
        {
          error: error.response?.data?.error || "Failed to rate decoration",
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
