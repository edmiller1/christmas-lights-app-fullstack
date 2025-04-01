import { getSupabaseSession } from "@/lib/supabase/getSupabaseSession";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const session = await getSupabaseSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await axios.post(
      `${process.env.BACKEND_URL}/api/auth/readAllNotifications`,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error reading all notifications:", error);
      return NextResponse.json(
        {
          error:
            error.response?.data?.error || "Failed to read all notifications",
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
