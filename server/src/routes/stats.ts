import { Hono } from "hono";
import { db } from "../db";
import { authMiddleware } from "../lib/middleware";
import { User, Decoration, View, Rating } from "../db/schema";
import { eq, and, sql, count, avg, gte, lt, between, desc } from "drizzle-orm";
import { format } from "date-fns";
import { DailyStat, YearlyStatsResponse } from "./types";

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

statsRouter.get("/yearlyStats", authMiddleware, async (c) => {
  try {
    const auth = c.get("user");

    if (!auth) {
      return c.json({ error: "Not authenticated" }, 401);
    }

    // Get year from query parameter, default to current year
    const year = c.req.query("year") || new Date().getFullYear().toString();
    const yearNum = parseInt(year);

    // Get the user
    const user = await db.query.User.findFirst({
      where: eq(User.externalId, auth.id),
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    // Get all decorations for this user in this year
    const decorations = await db.query.Decoration.findMany({
      where: and(eq(Decoration.userId, user.id), eq(Decoration.year, year)),
    });

    if (decorations.length === 0) {
      const emptyResponse: YearlyStatsResponse = {
        year,
        totalDecorations: 0,
        totalViews: 0,
        totalRatings: 0,
        peakDay: null,
        peakViews: 0,
        stats: [],
      };
      return c.json(emptyResponse);
    }

    // Get decoration IDs
    const decorationIds = decorations.map((dec) => dec.id);

    // Define seasonal date range (November 15 to January 15)
    const seasonStart = new Date(yearNum, 10, 15); // November is month 10 (0-indexed)
    const seasonEnd = new Date(yearNum + 1, 0, 15); // January is month 0 (0-indexed)

    // Get all views within the season
    const views = await db
      .select({
        id: View.id,
        decorationId: View.decorationId,
        createdAt: View.createdAt,
      })
      .from(View)
      .where(
        and(
          sql`${View.decorationId} IN (${decorationIds.join(",")})`,
          between(View.createdAt, seasonStart, seasonEnd)
        )
      )
      .execute();

    // Get all ratings within the season
    const ratings = await db
      .select({
        id: Rating.id,
        decorationId: Rating.decorationId,
        createdAt: Rating.createdAt,
      })
      .from(Rating)
      .where(
        and(
          sql`${Rating.decorationId} IN (${decorationIds.join(",")})`,
          between(Rating.createdAt, seasonStart, seasonEnd)
        )
      )
      .execute();

    // Group views and ratings by day
    const statsByDay: Record<string, DailyStat> = {};

    // Initialize the data structure for each day in the season
    let currentDate = new Date(seasonStart);
    while (currentDate <= seasonEnd) {
      const dateStr = format(currentDate, "MMM d");
      statsByDay[dateStr] = {
        date: dateStr,
        views: 0,
        ratings: 0,
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Count views by day
    views.forEach((view) => {
      const dateStr = format(new Date(view.createdAt), "MMM d");
      if (statsByDay[dateStr]) {
        statsByDay[dateStr].views += 1;
      }
    });

    // Count ratings by day
    ratings.forEach((rating) => {
      const dateStr = format(new Date(rating.createdAt), "MMM d");
      if (statsByDay[dateStr]) {
        statsByDay[dateStr].ratings += 1;
      }
    });

    // Convert to array and sort by date
    const stats: DailyStat[] = Object.values(statsByDay);

    // Get total views and ratings
    const totalViews = views.length;
    const totalRatings = ratings.length;

    // Calculate peak day
    let peakDay = null;
    let peakViews = 0;

    for (const day of stats) {
      if (day.views > peakViews) {
        peakViews = day.views;
        peakDay = day.date;
      }
    }

    const response: YearlyStatsResponse = {
      year,
      totalDecorations: decorations.length,
      totalViews,
      totalRatings,
      peakDay,
      peakViews,
      stats,
    };

    return c.json(response, 200);
  } catch (error) {
    console.error("Error getting yearly stats:", error);
    return c.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

statsRouter.get("/decorationsStats", authMiddleware, async (c) => {
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

    const totalDecorations = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(Decoration)
      .where(eq(Decoration.userId, user.id))
      .then((result) => result[0]?.count || 0);

    const verifiedDecorations = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(Decoration)
      .where(and(eq(Decoration.userId, user.id), eq(Decoration.verified, true)))
      .then((result) => result[0]?.count || 0);

    const totalViews = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(View)
      .innerJoin(Decoration, eq(Decoration.id, View.decorationId))
      .where(eq(Decoration.userId, user.id))
      .then((result) => result[0]?.count || 0);

    const averageRating = await db
      .select({
        average: sql<number>`
          COALESCE(
            AVG(${Rating.rating}::numeric)::numeric(10,2),
            0
          )
        `,
      })
      .from(Rating)
      .innerJoin(Decoration, eq(Decoration.id, Rating.decorationId))
      .where(eq(Decoration.userId, user.id))
      .then((result) => result[0]?.average || 0);

    const mostViewedDecoration = await db
      .select({
        id: Decoration.id,
        name: Decoration.name,
        viewCount: sql<number>`COUNT(${View.id})`,
      })
      .from(Decoration)
      .leftJoin(View, eq(View.decorationId, Decoration.id))
      .where(eq(Decoration.userId, user.id))
      .groupBy(Decoration.id)
      .orderBy(desc(sql`COUNT(${View.id})`))
      .limit(1)
      .then((result) => result[0] || null);

    const highestRatedDecoration = await db
      .select({
        id: Decoration.id,
        name: Decoration.name,
        averageRating: sql<number>`
          COALESCE(
            AVG(${Rating.rating}::numeric)::numeric(10,2),
            0
          )
        `,
      })
      .from(Decoration)
      .leftJoin(Rating, eq(Rating.decorationId, Decoration.id))
      .where(eq(Decoration.userId, user.id))
      .groupBy(Decoration.id)
      .having(sql`COUNT(${Rating.id}) > 0`)
      .orderBy(desc(sql`AVG(${Rating.rating}::numeric)`))
      .limit(1)
      .then((result) => result[0] || null);

    return c.json({
      totalDecorations,
      verifiedDecorations,
      totalViews,
      averageRating,
      mostViewedDecoration,
      highestRatedDecoration,
    });
  } catch (error) {
    console.error("Error getting decorations:", error);
    return c.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});
