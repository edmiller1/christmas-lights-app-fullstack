import { Hono } from "hono";
import { db } from "../db";
import { User } from "../db/schema";
import { eq } from "drizzle-orm";
import { authMiddleware } from "../lib/middleware";

export const authRouter = new Hono();

authRouter.get("/callback", authMiddleware, async (c) => {
  //@ts-ignore
  const user = c.get("user");
});
