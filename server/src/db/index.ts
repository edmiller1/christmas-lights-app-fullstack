import { drizzle } from 'drizzle-orm/postgres-js';
//@ts-ignore
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const client = postgres(connectionString, {
  max: 20, // Set pool size
  prepare: false,  // Required for Supabase
  ssl: 'require',  // Required for Supabase
});

export const db = drizzle(client, { schema });

// Initialize Neon connection
// const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// // Create Drizzle instance
// export const db = drizzle(pool, { schema })