import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
}); 