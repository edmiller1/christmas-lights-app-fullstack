// app/api/auth/updateSettings/route.ts
import { getSupabaseSession } from "@/lib/supabase/getSupabaseSession";
import axios from "axios";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    // Get authentication session
    const session = await getSupabaseSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const settings: { [key: string]: boolean } = await request.json();

    if (!settings || Object.keys(settings).length === 0) {
      return NextResponse.json(
        { error: "Settings data is required" },
        { status: 400 }
      );
    }

    // Forward the request to your backend server
    const response = await axios.put(
      `${process.env.BACKEND_URL}/api/auth/updateSettings`,
      settings,
      {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Return the response from your backend
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error updating settings:", error);
      return NextResponse.json(
        { error: error.response?.data?.error || "Failed to update settings" },
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
