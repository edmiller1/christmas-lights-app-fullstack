import { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { Context, Next } from "hono";
import { verify } from "hono/jwt";
import { db } from "../db";
import { count, eq } from "drizzle-orm";
import { User as DbUser, DecorationImage, Favourite } from "../db/schema";

declare module "hono" {
  interface ContextVariableMap {
    user: User;
  }
}

export async function authMiddleware(c: any, next: any) {
  const authHeader = c.req.header("Authorization");

  if (!authHeader) {
    return c.status(401).json({ error: "No auth header" });
  }

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));

    if (error || !user) {
      return c.status(401).json({ error: "Invalid token" });
    }

    // Add user to context
    c.set("user", user);
    await next();
  } catch (err) {
    return c.status(401).json({ error: "Invalid token" });
  }
}

export async function checkImageLimitMiddleware(c: Context, next: Next) {
  try {
    const auth = c.get("user");

    if (!auth) {
      return c.json({ error: "Not authenticated" }, 401);
    }

    const user = await db.query.User.findFirst({
      where: eq(DbUser.externalId, auth.id),
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    const maxImagesPerDecoration = user.maxImagesPerDecoration || 5;

    const body = await c.req.json();
    const { decorationId, images } = body;

    if (decorationId && images?.length) {
      const existingImages = await db.query.DecorationImage.findMany({
        where: eq(DecorationImage.decorationId, decorationId),
      });

      const newImagesCount = images.filter(
        (img: { id?: string; publicId?: string; url: string; index: number }) =>
          img.url?.includes("data:image")
      ).length;

      if (existingImages.length + newImagesCount > maxImagesPerDecoration) {
        return c.json(
          {
            error: "Image limit reached",
            limit: maxImagesPerDecoration,
            current: existingImages.length,
            upgradeRequired: true,
          },
          403
        );
      }
    }

    await next();
  } catch (error) {
    console.error("Error in image limit middleware:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}

export async function checkFavouritesLimitMiddleware(c: Context, next: Next) {
  try {
    const auth = c.get("user");
    if (!auth) {
      return c.json({ error: "Not authenticated" }, 401);
    }

    const user = await db.query.User.findFirst({
      where: eq(DbUser.externalId, auth.id),
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    if (user.plan === "PRO" && user.maxFavorites === null) {
      await next();
      return;
    }

    const maxFavorites = user.maxFavorites || 10;

    const favoritesCount = await db
      .select({ count: count() })
      .from(Favourite)
      .where(eq(Favourite.userId, user.id));

    // Check if adding another favorite would exceed the limit
    if (favoritesCount[0].count >= maxFavorites) {
      return c.json(
        {
          error: "Favorites limit reached",
          limit: maxFavorites,
          current: favoritesCount[0].count,
          upgradeRequired: true,
        },
        403
      );
    }

    // Continue to the next middleware/handler
    await next();
  } catch (error) {
    console.error("Error in favorites limit middleware:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}

export async function optionalAuthMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization");

  if (authHeader) {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));

      if (!error && user) {
        c.set("user", user);
      }
    } catch (err) {
      console.warn("Auth error in optional middleware:", err);
    }
  }

  // Always proceed to the next middleware/handler
  await next();
}
