import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Log the connection string format for debugging (without credentials)
console.log("Database URL format:", connectionString.replace(/\/\/.*@/, "//[credentials]@"));

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString.includes('-pooler.') ? connectionString : connectionString.replace('.us-east-2', '-pooler.us-east-2'),
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  },
  verbose: true,
  strict: true,
}); 