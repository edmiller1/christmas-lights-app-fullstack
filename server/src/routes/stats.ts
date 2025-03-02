import { Hono } from "hono";
import { db } from "../db";
import { authMiddleware } from "../lib/middleware";
import { User, Decoration, View, Rating } from "../db/schema";
import { eq, and, sql, count, avg, gte, lt } from "drizzle-orm";

export const statsRouter = new Hono();

statsRouter.get("/dashboardStats", authMiddleware, async (c) => {
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

    const decorations = await db.query.Decoration.findMany({
      where: eq(Decoration.userId, user.id),
    });

    if (decorations.length === 0) {
      return c.json({
        totalViews: 0,
        averageRating: 0,
        totalRatings: 0,
        totalDecorations: 0,
        verifiedDecorations: 0,
        viewsChange: 0,
      });
    }

    // Get all decoration ids
    const decorationIds = decorations.map((dec) => dec.id);

    // Get total decorations
    const totalDecorations = decorationIds.length;

    // Get verified decorations count
    const verifiedDecorations = decorations.filter(
      (dec) => dec.verified
    ).length;

    // Get current date info for month calculations
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Calculate start dates for current and previous month
    const currentMonthStart = new Date(currentYear, currentMonth, 1);
    const previousMonthStart = new Date(currentYear, currentMonth - 1, 1);

    // Get total views (all time)
    const totalViewsResult = await db
      .select({
        count: count(View.id),
      })
      .from(View)
      .where(sql`${View.decorationId} IN (${decorationIds.join(",")})`)
      .execute();

    const totalViews = totalViewsResult[0]?.count || 0;

    // Get views for current month
    const currentMonthViewsResult = await db
      .select({
        count: count(View.id),
      })
      .from(View)
      .where(
        and(
          sql`${View.decorationId} IN (${decorationIds.join(",")})`,
          gte(View.createdAt, currentMonthStart),
          lt(View.createdAt, now)
        )
      )
      .execute();

    const currentMonthViews = currentMonthViewsResult[0]?.count || 0;

    // Get views for previous month
    const previousMonthViewsResult = await db
      .select({
        count: count(View.id),
      })
      .from(View)
      .where(
        and(
          sql`${View.decorationId} IN (${decorationIds.join(",")})`,
          gte(View.createdAt, previousMonthStart),
          lt(View.createdAt, currentMonthStart)
        )
      )
      .execute();

    const previousMonthViews = previousMonthViewsResult[0]?.count || 0;

    // Calculate percentage change in views
    let viewsChange = 0;
    if (previousMonthViews > 0) {
      viewsChange = Math.round(
        ((currentMonthViews - previousMonthViews) / previousMonthViews) * 100
      );
    }

    // Get average rating and total ratings count
    const ratingsResult = await db
      .select({
        averageRating: avg(Rating.rating),
        totalRatings: count(Rating.id),
      })
      .from(Rating)
      .where(sql`${Rating.decorationId} IN (${decorationIds.join(",")})`)
      .execute();

    const averageRating = ratingsResult[0]?.averageRating || 0;
    const totalRatings = ratingsResult[0]?.totalRatings || 0;

    return c.json({
      totalViews,
      averageRating,
      totalRatings,
      totalDecorations,
      verifiedDecorations,
      viewsChange,
      currentMonthViews,
      previousMonthViews,
    });
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    return c.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});
