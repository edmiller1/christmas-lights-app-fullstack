import { getSupabaseSession } from "@/lib/supabase/getSupabaseSession";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSupabaseSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { decorationId } = await request.json();

    if (!decorationId) {
      return NextResponse.json(
        { error: "Decoration ID is required" },
        { status: 400 }
      );
    }

    const response = await axios.delete(
      `${process.env.BACKEND_URL}/api/decoration/deleteDecoration`,
      {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        data: {
          decorationId,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error deleting decoration:", error);
      return NextResponse.json(
        {
          error: error.response?.data?.error || "Failed to delete decoration",
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
