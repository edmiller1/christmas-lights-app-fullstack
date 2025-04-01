import { getSupabaseSession } from "@/lib/supabase/getSupabaseSession";
import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSupabaseSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { decorationId }: { decorationId: string } = await request.json();

    if (!decorationId) {
      return NextResponse.json(
        { error: "Decoration ID is required" },
        { status: 400 }
      );
    }

    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/history/removeFromHistory`,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        params: {
          decorationId,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error removing decoration from history:", error);
      return NextResponse.json(
        {
          error:
            error.response?.data?.error ||
            "Failed to remove decoration from history",
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
