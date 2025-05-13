import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from "@shared/schema";
import dotenv from "dotenv";

dotenv.config();

// Validate environment variables
if (!process.env.SUPABASE_URL) {
  throw new Error(
    "SUPABASE_URL must be set. Did you forget to set your Supabase connection details?",
  );
}

if (!process.env.SUPABASE_KEY) {
  throw new Error(
    "SUPABASE_KEY must be set. Did you forget to set your Supabase API key?",
  );
}

// For use with Supabase via postgres.js
const connectionString = process.env.SUPABASE_URL;

// Use postgres.js as the SQL driver
export const client = postgres(connectionString, {
  ssl: 'require',
  headers: {
    apikey: process.env.SUPABASE_KEY
  }
});

// Initialize Drizzle with the postgres client and schema
export const db = drizzle(client, { schema });
