import { getSupabaseSession } from "@/lib/supabase/getSupabaseSession";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const session = await getSupabaseSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { notificationId }: { notificationId: string } = await request.json();

    if (!notificationId) {
      return NextResponse.json(
        { error: "No notification ID provided" },
        { status: 400 }
      );
    }

    const response = await axios.put(
      `${process.env.BACKEND_URL}/api/auth/unreadNotification`,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        notificationId,
      }
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error unreading notification:", error);
      return NextResponse.json(
        {
          error: error.response?.data?.error || "Failed to unread notification",
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
