import { Hono } from "hono";
import { db } from "../db";
import { authMiddleware } from "../lib/middleware";
import { zValidator } from "@hono/zod-validator";
import { and, desc, eq, sql } from "drizzle-orm";
import {
  Decoration,
  DecorationImage,
  History,
  Rating,
  User,
  View,
} from "../db/schema";
import { getOptimizedImageUrls } from "../lib/helpers";

export const historyRouter = new Hono();

// Add decoration to history
historyRouter.post("/addToHistory", authMiddleware, async (c) => {
  try {
    const auth = c.get("user");
    const decorationId = c.req.query("decorationId");

    if (!auth) {
      return c.json({ error: "Not authenticated" }, 401);
    }

    if (!decorationId) {
      return c.json({ error: "Decoration ID is required" }, 400);
    }

    const user = await db.query.User.findFirst({
      where: eq(User.externalId, auth.id),
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    const decoration = await db.query.Decoration.findFirst({
      where: eq(Decoration.id, decorationId),
    });

    if (!decoration) {
      return c.json({ error: "Decoration not found" }, 404);
    }

    // Check if it's already in history
    const existingHistory = await db.query.History.findFirst({
      where: and(
        eq(History.userId, user.id),
        eq(History.decorationId, decorationId)
      ),
    });

    if (existingHistory) {
      // Update the timestamp to bring it to the top of history
      await db
        .update(History)
        .set({
          updatedAt: new Date(),
        })
        .where(eq(History.id, existingHistory.id));

      return c.json({ message: "History updated" }, 200);
    }

    // Add to history
    await db.insert(History).values({
      decorationId,
      userId: user.id,
    });

    return c.json({ message: "Added to history" }, 200);
  } catch (error) {
    console.error("Error in addToHistory:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get history
historyRouter.get("/", authMiddleware, async (c) => {
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

    // Get history entries sorted by most recent
    const historyEntries = await db
      .select({
        historyId: History.id,
        decorationId: History.decorationId,
        updatedAt: History.updatedAt,
      })
      .from(History)
      .where(eq(History.userId, user.id))
      .orderBy(desc(History.updatedAt))
      .execute();

    if (!historyEntries.length) {
      return c.json({ history: [] });
    }

    //Get decorations from history
    const historyItems = await Promise.all(
      historyEntries.map(async (entry) => {
        const decoration = await db
          .select({
            id: Decoration.id,
            name: Decoration.name,
            address: Decoration.address,
            verified: Decoration.verified,
            latitude: Decoration.latitude,
            longitude: Decoration.longitude,
            country: Decoration.country,
            region: Decoration.region,
            city: Decoration.city,
            year: Decoration.year,
            createdAt: Decoration.createdAt,
            userId: Decoration.userId,
            viewCount: db.$count(
              View,
              eq(View.decorationId, entry.decorationId)
            ),
            ratingCount: db.$count(
              Rating,
              eq(Rating.decorationId, entry.decorationId)
            ),
            averageRating: sql<number>`
              COALESCE(
                (SELECT AVG(${Rating.rating}::numeric)::numeric(10,2)
                FROM ${Rating}
                WHERE ${Rating.decorationId} = ${entry.decorationId}),
                0
              )
            `,
          })
          .from(Decoration)
          .where(eq(Decoration.id, entry.decorationId))
          .execute()
          .then(async ([dec]) => {
            if (!dec) return null;

            const images = await db
              .select()
              .from(DecorationImage)
              .where(eq(DecorationImage.decorationId, entry.decorationId))
              .orderBy(DecorationImage.index)
              .execute();

            const optimizedImages = images.map((image) => ({
              ...image,
              ...getOptimizedImageUrls(image.publicId),
            }));

            return {
              ...dec,
              images: optimizedImages,
              historyId: entry.historyId,
              viewedAt: entry.updatedAt,
            };
          });

        return decoration;
      })
    );

    return c.json({
      history: historyItems.filter(Boolean),
    });
  } catch (error) {
    console.error("Error in getHistory:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Remove decoration from history
historyRouter.delete("/removeFromHistory", authMiddleware, async (c) => {
  try {
    const auth = c.get("user");
    const decorationId = c.req.query("decorationId");

    console.log(decorationId);

    if (!auth) {
      return c.json({ error: "Not authenticated" }, 401);
    }

    if (!decorationId) {
      return c.json({ error: "Decoration ID is required" }, 400);
    }

    const user = await db.query.User.findFirst({
      where: eq(User.externalId, auth.id),
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    const decoration = await db.query.Decoration.findFirst({
      where: eq(Decoration.id, decorationId),
    });

    if (!decoration) {
      return c.json({ error: "Decoration not found" }, 404);
    }

    // Check if it's already in history
    const historyItem = await db.query.History.findFirst({
      where: and(
        eq(History.userId, user.id),
        eq(History.decorationId, decorationId)
      ),
    });

    if (!historyItem) {
      return c.json({ error: "Decoration not found in history" }, 404);
    }

    await db.delete(History).where(eq(History.id, historyItem.id));

    return c.json({ message: "Decoration removed from history." }, 200);
  } catch (error) {
    console.error("Error in removeFromHistory:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Clear history
historyRouter.delete("/clearHistory", authMiddleware, async (c) => {
  try {
    const auth = c.get("user");

    if (!auth) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const user = await db.query.User.findFirst({
      where: eq(User.externalId, auth.id),
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    await db.delete(History).where(eq(History.userId, user.id));

    return c.json({ message: "History cleared sucessfully" }, 200);
  } catch (error) {
    console.error("Error in deleteHistory:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});
