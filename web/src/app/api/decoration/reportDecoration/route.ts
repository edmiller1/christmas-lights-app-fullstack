import { NextRequest, NextResponse } from "next/server";
import { getSupabaseSession } from "@/lib/supabase/getSupabaseSession";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const session = await getSupabaseSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      decorationId,
      reasons,
      additionalInfo,
    }: { decorationId: string; reasons: string[]; additionalInfo: string } =
      await request.json();

    if (!decorationId || !reasons) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const response = await axios.post(
      `${process.env.BACKEND_URL}/api/decoration/reportDecoration`,
      {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        params: {
          decorationId,
          reasons,
          additionalInfo,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error reporting decoration:", error);
      return NextResponse.json(
        {
          error: error.response?.data?.error || "Failed to report decoration",
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
