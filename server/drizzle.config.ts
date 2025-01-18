import type { Config } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("Missing POSTGRES_URL");
}

export default {
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL },
} satisfies Config;