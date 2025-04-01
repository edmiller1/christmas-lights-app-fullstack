import { NextResponse } from "next/server";
import axios from "axios";
import { getSupabaseSession } from "@/lib/supabase/getSupabaseSession";

export async function GET() {
  try {
    const session = await getSupabaseSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await axios.get(`${process.env.BACKEND_URL}/api/history`, {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching history:", error);
      return NextResponse.json(
        { error: error.response?.data?.error || "Failed to fetch history" },
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

export async function DELETE() {
  try {
    const session = await getSupabaseSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await axios.post(
      `${process.env.BACKEND_URL}/api/history/clearHistory`,
      {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      }
    );

    return NextResponse.json(response.data.message);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error clearing history:", error);
      return NextResponse.json(
        { error: error.response?.data?.error || "Failed to clear history" },
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
