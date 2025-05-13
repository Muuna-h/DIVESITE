import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from "@shared/schema";
import dotenv from "dotenv";

dotenv.config();

// Validate environment variables
if (!process.env.VITE_SUPABASE_URL) {
  throw new Error(
    "VITE_SUPABASE_URL must be set. Did you forget to set your Supabase connection details?",
  );
}

if (!process.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error(
    "VITE_SUPABASE_ANON_KEY must be set. Did you forget to set your Supabase API key?",
  );
}

// For use with Supabase via postgres.js
// Create connection URL with authentication information included
const connectionString = `${process.env.VITE_SUPABASE_URL}?apikey=${process.env.VITE_SUPABASE_ANON_KEY}`;

// Use postgres.js as the SQL driver
export const client = postgres(connectionString, {
  ssl: 'require'
});

// Initialize Drizzle with the postgres client and schema
export const db = drizzle(client, { schema });
