// server/src/routes/auth.routes.ts
import { Hono } from "hono";
import { createClient } from "@supabase/supabase-js";
import { db } from "../db";
import { User } from "../db/schema";
import { eq } from "drizzle-orm";

export const authRouter = new Hono();

// Initialize Supabase client for auth operations
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Auth callback route
authRouter.get("/callback", async (c) => {
  try {
    const code = c.req.query("code");
    if (!code) {
      throw new Error("No code provided");
    }

    // Exchange code for session
    const {
      data: { user },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !user) {
      throw new Error(error?.message || "Auth failed");
    }

    // Check for existing user
    const existingUser = await db.query.User.findFirst({
      where: eq(User.externalId, user.id),
    });

    if (existingUser) {
      // Update existing user
      await db
        .update(User)
        .set({
          email: user.email,
          name: user.user_metadata.full_name,
          image: user.user_metadata.avatar_url,
          emailVerified: user.user_metadata.email_verified,
          provider: user.app_metadata.provider,
          updatedAt: new Date(),
        })
        .where(eq(User.externalId, user.id));
    } else {
      // Create new user
      await db.insert(User).values({
        externalId: user.id,
        email: user.email || "",
        name: user.user_metadata.full_name,
        image: user.user_metadata.avatar_url,
        emailVerified: user.user_metadata.email_verified,
        provider: user.app_metadata.provider,
        plan: "FREE",
        admin: false,
        notificationsOnAppVerification: true,
        notificationsOnAppRating: true,
        notificationsByEmailVerification: true,
        notificationsByEmailRating: true,
      });
    }

    // Redirect back to frontend
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const redirectTo = existingUser ? "/dashboard" : "/onboarding";
    return c.redirect(`${frontendUrl}${redirectTo}`, 303);
  } catch (error) {
    console.error("Auth callback error:", error);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    return c.redirect(
      `${frontendUrl}/auth-error?message=${encodeURIComponent(
        (error as Error).message
      )}`,
      303
    );
  }
});

// Verify session endpoint (useful for frontend session checks)
authRouter.get("/session", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return c.json({ authenticated: false }, 401);
    }

    const token = authHeader.split(" ")[1];
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return c.json({ authenticated: false }, 401);
    }

    // Get user data from your database
    const dbUser = await db.query.User.findFirst({
      where: eq(User.externalId, user.id),
    });

    return c.json({
      authenticated: true,
      user: dbUser,
    });
  } catch (error) {
    return c.json(
      {
        authenticated: false,
        error: "Failed to verify session",
      },
      401
    );
  }
});
