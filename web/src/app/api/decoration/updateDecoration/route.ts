import { NextRequest, NextResponse } from "next/server";
import { getSupabaseSession } from "@/lib/supabase/getSupabaseSession";
import axios from "axios";
import { UpdateDecorationArgs } from "@/api/decoration/updateDecoration/types";

export async function PUT(request: NextRequest) {
  try {
    const session = await getSupabaseSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      decorationId,
      name,
      address,
      images,
      deletedImageIds,
      addressId,
    }: UpdateDecorationArgs = await request.json();

    // Validation
    if (!decorationId || !name || !address || !images) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const response = await axios.put(
      `${process.env.BACKEND_URL}/api/decoration/updateDecoration`,
      {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        params: {
          decorationId,
          name,
          address,
          images,
          deletedImageIds,
          addressId,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error updating decoration:", error);
      return NextResponse.json(
        {
          error: error.response?.data?.error || "Failed to update decoration",
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
