import { createClient } from "@/lib/supabase/server";
import { User } from "@/lib/types";

export async function getServerUser(): Promise<User | null> {
  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return null;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/user`,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (response.ok) {
      return await response.json();
    }

    // If API fetch fails but session exists, return a minimal user object
    // This prevents redirect loops while still letting the user stay logged in
    return {
      id: session.user.id,
      externalId: session.user.id,
      email: session.user.email!,
      name: session.user.user_metadata?.name || "User",
      image: session.user.user_metadata?.avatar_url || null,
      emailVerified: !!session.user.email_confirmed_at,
      provider: session.user.app_metadata?.provider || "email",
      notificationsOnAppVerification: true,
      notificationsOnAppRating: true,
      notificationsByEmailVerification: true,
      notificationsByEmailRating: true,
      plan: "FREE",
      admin: false,
      ratings: [],
      favourites: [],
      reports: [],
      verifications: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}
