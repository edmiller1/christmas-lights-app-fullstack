import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { showRoutes } from "hono/dev";
import { authRouter } from "./routes/auth";
import { decorationRouter } from "./routes/decoration";
import { discordRouter } from "./routes/discord";
import { statsRouter } from "./routes/stats";

const app = new Hono();

// Common middleware
app.use("*", logger());
app.use(
  "*",
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "your-production-domain",
    maxAge: 86400, // Cache preflight request results for 24 hours
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true, // If you're sending cookies or auth headers
  })
);

app.get("/", (c) => {
  return c.text("Hono server running!");
});

app.route("/api/auth", authRouter);
app.route("/api/decoration", decorationRouter);
app.route("/api/discord", discordRouter);
app.route("/api/stats", statsRouter);

// Show available routes in development
showRoutes(app);

export default {
  port: 9000,
  fetch: app.fetch,
  timeout: 30000,
};
