import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { showRoutes } from "hono/dev";
import { authRouter } from "./routes/auth";

const app = new Hono();

// Common middleware
app.use("*", logger());
app.use("*", cors());

app.get("/", (c) => {
  return c.text("Hono server running!");
});

app.route("/api/auth", authRouter);

// Show available routes in development
showRoutes(app);

export default {
  port: 9000,
  fetch: app.fetch,
};
