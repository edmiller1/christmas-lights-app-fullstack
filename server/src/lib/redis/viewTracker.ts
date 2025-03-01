import { redisClient } from "./redis";
import { db } from "../../db";
import { eq } from "drizzle-orm";
import { View } from "../../db/schema";

// Key constants
const VIEW_COUNT_KEY = (id: string) => `decoration:${id}:views`;

/**
/**
 * Increment view count for a decoration using Redis and persist to database
 */
export async function incrementViewCount(decorationId: string) {
  try {
    // Increment the counter in Redis
    const currentCount = await redisClient.incr(VIEW_COUNT_KEY(decorationId));

    // Create a new view record in the database
    await db.insert(View).values({
      decorationId,
    });

    return currentCount;
  } catch (error) {
    console.error("Error incrementing view count:", error);
    // Fallback to direct DB insert if Redis fails
    return incrementViewCountInDB(decorationId);
  }
}

/**
 * Fallback method to add view directly in DB if Redis is unavailable
 */
async function incrementViewCountInDB(decorationId: string) {
  try {
    await db.insert(View).values({
      decorationId,
    });

    // Count total views manually
    const views = await db.query.View.findMany({
      where: eq(View.decorationId, decorationId),
    });

    return views.length;
  } catch (error) {
    console.error("Error adding view in database:", error);
    return -1;
  }
}

/**
 * Get the current view count for a decoration
 */
export async function getViewCount(decorationId: string) {
  try {
    // Try to get from Redis first
    const redisCount = await redisClient.get(VIEW_COUNT_KEY(decorationId));
    if (redisCount !== null) {
      return parseInt(redisCount);
    }

    // If not in Redis, count from database
    const views = await db.query.View.findMany({
      where: eq(View.decorationId, decorationId),
    });

    const count = views.length;

    // Sync Redis with DB count
    await redisClient.set(VIEW_COUNT_KEY(decorationId), count);

    return count;
  } catch (error) {
    console.error("Error getting view count:", error);
    return 0;
  }
}

/**
 * Sync all Redis view counts with database counts
 * Could be run periodically to ensure consistency
 */
export async function syncViewCountsWithDB() {
  try {
    // Scan for all view count keys
    const keys = await scanKeys("decoration:*:views");

    for (const key of keys) {
      const decorationId = key.split(":")[1];

      // Count views in database
      const views = await db.query.View.findMany({
        where: eq(View.decorationId, decorationId),
      });

      const dbCount = views.length;

      // Update Redis with accurate count
      await redisClient.set(key, dbCount);
    }

    console.log(`Successfully synced ${keys.length} view counts with DB`);
  } catch (error) {
    console.error("Error syncing view counts with DB:", error);
  }
}

// Helper function to scan all keys matching a pattern
async function scanKeys(pattern: string) {
  const results: string[] = [];
  let cursor = "0";

  do {
    const reply = await redisClient.scan(
      cursor,
      "MATCH",
      pattern,
      "COUNT",
      100
    );
    cursor = reply[0];
    results.push(...reply[1]);
  } while (cursor !== "0");

  return results;
}
