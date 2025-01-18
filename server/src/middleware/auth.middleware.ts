import { Context, Next } from "hono";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY! // Use service role key for admin access
);

export async function authMiddleware(c: Context, next: Next) {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return c.json({ error: "No token provided" }, 401);
    }

    const token = authHeader.split(" ")[1];
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return c.json({ error: "Invalid token" }, 401);
    }

    // Add user to context for use in protected routes
    c.set("user", user);
    await next();
  } catch (error) {
    return c.json({ error: "Authentication failed" }, 401);
  }
}
