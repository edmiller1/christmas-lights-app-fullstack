import { Hono } from "hono";
import { db } from "../db";
import { User } from "../db/schema";
import { eq } from "drizzle-orm";
import { authMiddleware } from "../lib/middleware";
import { SyncResponse } from "./types";
import { Resend } from "resend";
import { Welcome } from "../emails/welcome";

export const authRouter = new Hono();
const resend = new Resend(process.env.RESEND_API_KEY);

authRouter.get("/callback", authMiddleware, async (c, next) => {
  try {
    const auth = c.get("user");

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
        provider: auth.identities?.[0].provider ?? "",
        createdAt: new Date(),
      });

      const { error } = await resend.emails.send({
        from: "Christmas Lights App <hello@christmaslightsapp.com>",
        to: auth.email!,
        subject: "Welcome",
        react: <Welcome />,
      });

      if (error) {
        throw new Error("Failed to send welcome email");
      }
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

authRouter.get("/user", authMiddleware, async (c, next) => {
  try {
    const auth = c.get("user");

    if (!auth) {
      throw new Error("No auth header");
    }

    const user = await db.query.User.findFirst({
      where: eq(User.externalId, auth.id),
    });

    if (!user) {
      throw new Error("No user found");
    }

    return c.json(user);
  } catch (error) {
    console.error("Error in user:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});
