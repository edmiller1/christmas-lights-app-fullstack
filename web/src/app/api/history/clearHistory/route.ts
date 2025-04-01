import { getSupabaseSession } from "@/lib/supabase/getSupabaseSession";
import axios from "axios";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    const session = await getSupabaseSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/history/clearHistory`,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error clearing history:", error);
      return NextResponse.json(
        {
          error: error.response?.data?.error || "Failed to clear history",
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
