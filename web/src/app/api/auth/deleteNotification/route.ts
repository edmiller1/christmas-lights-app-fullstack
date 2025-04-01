import { NextResponse, NextRequest } from "next/server";
import { getSupabaseSession } from "@/lib/supabase/getSupabaseSession";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const session = await getSupabaseSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { notificationId }: { notificationId: string } = await request.json();

    if (!notificationId) {
      return NextResponse.json(
        { error: "Notification ID is required" },
        {
          status: 400,
        }
      );
    }
    const response = await axios.post(
      `${process.env.BACKEND_URL}/api/auth/deleteNotification`,
      {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        notificationId,
      }
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error deleting notification:", error);
      return NextResponse.json(
        {
          error: error.response?.data?.error || "Failed to delete notification",
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
