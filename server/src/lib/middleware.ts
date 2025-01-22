import { supabase } from "./supabase";

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
