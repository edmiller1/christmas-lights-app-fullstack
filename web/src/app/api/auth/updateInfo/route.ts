import { getSupabaseSession } from "@/lib/supabase/getSupabaseSession";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const session = await getSupabaseSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email }: { name: string; email: string } =
      await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "No name or email provided" },
        { status: 400 }
      );
    }

    const response = await axios.put(
      `${process.env.BACKEND_URL}/api/auth/updateInfo`,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        name,
        email,
      }
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error updating information:", error);
      return NextResponse.json(
        {
          error: error.response?.data?.error || "Failed to update information",
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
