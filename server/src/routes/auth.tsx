import { Hono } from "hono";
import { db } from "../db";
import {
  Favourite,
  Notification,
  Rating,
  Report,
  User,
  Verification,
} from "../db/schema";
import { desc, eq } from "drizzle-orm";
import { authMiddleware } from "../lib/middleware";
import { SyncResponse, UpdateInfoArgs, UpdateSettingsArgs } from "./types";
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
        name: auth.user_metadata.full_name
          ? auth.user_metadata.full_name
          : auth.user_metadata.firstname + " " + auth.user_metadata.lastname,
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

    const user = await db
      .select()
      .from(User)
      .where(eq(User.externalId, auth.id))
      .execute()
      .then(async ([person]) => {
        if (!person) return null;

        const [ratings, favourites, reports, verifications] = await Promise.all(
          [
            db
              .select()
              .from(Rating)
              .where(eq(Rating.userId, person.id))
              .execute(),
            db
              .select()
              .from(Favourite)
              .where(eq(Favourite.userId, person.id))
              .execute(),
            db
              .select()
              .from(Report)
              .where(eq(Report.userId, person.id))
              .execute(),
            db
              .select()
              .from(Verification)
              .where(eq(Verification.userId, person.id))
              .execute(),
          ]
        );

        return {
          ...person,
          ratings,
          favourites,
          reports,
          verifications,
        };
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

authRouter.put("/updateSettings", authMiddleware, async (c) => {
  try {
    const auth = c.get("user");

    if (!auth) {
      return c.json({ error: "Not authenticated" }, 401);
    }

    const settings: UpdateSettingsArgs = await c.req.json();

    if (!settings || Object.keys(settings).length === 0) {
      return c.json({ error: "No settings provided" }, 400);
    }

    const user = await db.query.User.findFirst({
      where: eq(User.externalId, auth.id),
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    // Validate settings
    const allowedSettings = [
      "notificationsOnAppVerification",
      "notificationsOnAppRating",
      "notificationsByEmailVerification",
      "notificationsByEmailRating",
    ];

    const sanitizedSettings: Record<string, boolean> = {};

    for (const key of Object.keys(settings)) {
      if (
        allowedSettings.includes(key) &&
        typeof settings[key as keyof typeof settings] === "boolean"
      ) {
        const value = settings[key as keyof typeof settings];
        sanitizedSettings[key] =
          typeof value === "function" &&
          typeof (value as Function)() === "boolean"
            ? ((value as Function)() as boolean)
            : (value as boolean);
      } else {
        return c.json({ error: `Invalid setting: ${key}` }, 400);
      }
    }

    await db
      .update(User)
      .set({ ...sanitizedSettings, updatedAt: new Date() })
      .where(eq(User.id, user.id));

    return c.json({ message: "Settings updated successfully" }, 200);
  } catch (error) {
    console.error("Error in updateSettings:", error);
    return c.json({ error: "Failed to update settings" }, 500);
  }
});

authRouter.put("/updateInfo", authMiddleware, async (c) => {
  try {
    const auth = c.get("user");

    if (!auth) {
      return c.json({ error: "Not authenticated" }, 401);
    }

    const info: UpdateInfoArgs = await c.req.json();

    if (!info || Object.keys(info).length === 0) {
      return c.json({ error: "No info provided" }, 400);
    }

    await db
      .update(User)
      .set({ ...info, updatedAt: new Date() })
      .where(eq(User.externalId, auth.id));

    return c.json({ message: "Info updated successfully" }, 200);
  } catch (error) {
    console.error("Error in updateInfo:", error);
    return c.json({ error: "Failed to update info" }, 500);
  }
});

authRouter.get("/notifications", authMiddleware, async (c) => {
  try {
    const auth = c.get("user");

    if (!auth) {
      return c.json({ error: "Not authenticated" }, 401);
    }

    const user = await db.query.User.findFirst({
      where: eq(User.externalId, auth.id),
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }
    const notifications = await db.query.Notification.findMany({
      where: eq(Notification.userId, user.id),
      orderBy: [desc(Notification.createdAt)],
    });

    return c.json(notifications);
  } catch (error) {
    console.error("Error in notifications:", error);
    return c.json({ error: "Failed to get notifications" }, 500);
  }
});

authRouter.put("/readNotification", authMiddleware, async (c) => {
  try {
    const auth = c.get("user");

    if (!auth) {
      return c.json({ error: "Not authenticated" }, 401);
    }

    const { notificationId }: { notificationId: string } = await c.req.json();

    if (!notificationId) {
      return c.json({ error: "No notification ID provided" }, 400);
    }

    await db
      .update(Notification)
      .set({ unread: false, updatedAt: new Date() })
      .where(eq(Notification.id, notificationId));

    return c.json({ message: "Notification marked as read" }, 200);
  } catch (error) {
    console.error("Error in readNotification:", error);
    return c.json({ error: "Failed to mark notification as read" }, 500);
  }
});

authRouter.put("/unreadNotification", authMiddleware, async (c) => {
  try {
    const auth = c.get("user");

    if (!auth) {
      return c.json({ error: "Not authenticated" }, 401);
    }

    const { notificationId }: { notificationId: string } = await c.req.json();

    if (!notificationId) {
      return c.json({ error: "No notification ID provided" }, 400);
    }

    await db
      .update(Notification)
      .set({ unread: true, updatedAt: new Date() })
      .where(eq(Notification.id, notificationId));

    return c.json({ message: "Notification marked as unread" }, 200);
  } catch (error) {
    console.error("Error in unreadNotification:", error);
    return c.json({ error: "Failed to mark notification as unread" }, 500);
  }
});

authRouter.put("/readAllNotifications", authMiddleware, async (c) => {
  try {
    const auth = c.get("user");

    if (!auth) {
      return c.json({ error: "Not authenticated" }, 401);
    }

    const user = await db.query.User.findFirst({
      where: eq(User.externalId, auth.id),
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    await db
      .update(Notification)
      .set({ unread: false, updatedAt: new Date() })
      .where(eq(Notification.userId, user.id));

    return c.json({ message: "All notifications marked as read" }, 200);
  } catch (error) {
    console.error("Error in readAllNotifications:", error);
    return c.json({ error: "Failed to mark all notifications as read" }, 500);
  }
});

authRouter.post("/deleteNotification", authMiddleware, async (c) => {
  try {
    const auth = c.get("user");

    if (!auth) {
      return c.json({ error: "Not authenticated" }, 401);
    }

    const { notificationId }: { notificationId: string } = await c.req.json();

    if (!notificationId) {
      return c.json({ error: "No notification ID provided" }, 400);
    }

    await db.delete(Notification).where(eq(Notification.id, notificationId));

    return c.json({ message: "Notification deleted successfully" }, 200);
  } catch (error) {
    console.error("Error in deleteNotification:", error);
    return c.json({ error: "Failed to delete notification" }, 500);
  }
});

authRouter.post("/deleteAllNotifications", authMiddleware, async (c) => {
  try {
    const auth = c.get("user");

    if (!auth) {
      return c.json({ error: "Not authenticated" }, 401);
    }

    const user = await db.query.User.findFirst({
      where: eq(User.externalId, auth.id),
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    await db.delete(Notification).where(eq(Notification.userId, user.id));

    return c.json({ message: "All notifications deleted successfully" }, 200);
  } catch (error) {
    console.error("Error in deleteAllNotifications:", error);
    return c.json({ error: "Failed to delete all notifications" }, 500);
  }
});
