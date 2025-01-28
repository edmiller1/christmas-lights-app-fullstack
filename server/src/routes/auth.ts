import { Hono } from "hono";
import { db } from "../db";
import { User } from "../db/schema";
import { eq } from "drizzle-orm";
import { authMiddleware } from "../lib/middleware";
import { SyncResponse } from "./types";

export const authRouter = new Hono();

authRouter.get("/callback", authMiddleware, async (c, next) => {
  try {
    const auth = c.get("user");

    console.log("Auth:", auth);

    if (!auth) {
      return c.json({ isSynced: false });
    }

    const user = await db.query.User.findFirst({
      where: eq(User.externalId, auth.id),
    });

    if (!user) {
      await db.insert(User).values({
        externalId: auth.id,
        email: auth.email!,
        name: auth.user_metadata.full_name,
        image: auth.user_metadata.avatar_url,
        admin: false,
        emailVerified: auth.user_metadata.email_verified,
        notificationsByEmailRating: true,
        notificationsByEmailVerification: true,
        notificationsOnAppRating: true,
        notificationsOnAppVerification: true,
        plan: "FREE",
        provider: auth.user_metadata.provider,
        createdAt: new Date(),
      });
    }

    const response: SyncResponse = {
      isSynced: true,
      redirectUrl: "/dashboard",
    };

    return c.json(response);
  } catch (error) {
    console.error("Error in callback:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});
