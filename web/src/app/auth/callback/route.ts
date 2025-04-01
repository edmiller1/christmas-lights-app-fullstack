import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDatabaseSyncStatus } from "@/api/auth";

interface SyncResponse {
  isSynced: boolean;
  redirectUrl: string;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const redirectUrl = searchParams.get("callbackUrl") ?? "/dashboard" ?? next;

  if (!code) {
    return NextResponse.redirect(`${origin}/sign-in?error=true`);
  }

  try {
    // Exchange the code for a session
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Session exchange error:", error);
      return NextResponse.redirect(`${origin}/sign-in?error=true`);
    }

    // Sync user with database
    try {
      (await getDatabaseSyncStatus()) as SyncResponse;

      // Determine the redirect URL based on environment
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${redirectUrl}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${redirectUrl}`);
      } else {
        return NextResponse.redirect(`${origin}${redirectUrl}`);
      }
    } catch (syncError) {
      console.error("Database sync error:", syncError);
      // Even if sync fails, we might want to redirect to a specific error page
      // or to the dashboard with an error state
      return NextResponse.redirect(`${origin}/sign-in?error=true`);
    }
  } catch (error) {
    console.error("Callback route error:", error);
    return NextResponse.redirect(`${origin}/sign-in?error=true`);
  }
}
