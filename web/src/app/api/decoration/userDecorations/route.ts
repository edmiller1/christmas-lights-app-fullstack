import { NextResponse } from "next/server";
import { getSupabaseSession } from "@/lib/supabase/getSupabaseSession";
import axios from "axios";

export async function GET() {
  try {
    const session = await getSupabaseSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await axios.get(
      `${process.env.BACKEND_URL}/api/decoration/userDecorations`,
      {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching decorations:", error);
      return NextResponse.json(
        {
          error: error.response?.data?.error || "Failed to get decorations",
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
