import { Hono } from "hono";
import { db } from "../db";
import { checkExpiredSubscriptions } from "../tasks/check-expired-subscription";

export const cronRouter = new Hono();

cronRouter.post("check-expired-subscriptions", async (c) => {
  try {
    const secret = c.req.header("x-cron-secret");
    if (secret !== process.env.CRON_SECRET) {
      return c.json({ error: "Unauthorised" }, 401);
    }

    const result = await checkExpiredSubscriptions();
    return c.json(result);
  } catch (error) {
    console.error("Error checking expired subscriptions:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});
