import { drizzle } from "drizzle-orm/postgres-js";
//@ts-ignore
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const client = postgres(connectionString, {
  connectionTimeoutMillis: 5000, // 5 seconds
  idleTimeoutMillis: 30000, // 30 seconds
  max: 10, // maximum number of clients in the pool
  allowExitOnIdle: true, // Required for Supabase
});

export const db = drizzle(client, { schema });

// Initialize Neon connection
// const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// // Create Drizzle instance
// export const db = drizzle(pool, { schema })
