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
      document,
    }: { decorationId: string; document: string } = await request.json();

    if (!decorationId || !document) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const response = await axios.post(
      `${process.env.BACKEND_URL}/api/decoration/submitVerification`,
      {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        params: {
          decorationId,
          document,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error submitting verification:", error);
      return NextResponse.json(
        {
          error: error.response?.data?.error || "Failed to submit verification",
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
