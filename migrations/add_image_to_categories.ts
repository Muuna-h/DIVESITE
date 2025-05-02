import { sql } from "drizzle-orm";
import { db } from "../server/db";

// Run migration
async function main() {
  console.log("Running migration: add_image_to_categories");
  
  try {
    // Add image column to categories table
    await db.execute(sql`
      ALTER TABLE categories
      ADD COLUMN IF NOT EXISTS image TEXT;
    `);
    
    console.log("Migration successful!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

// Run the migration
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Migration completed");
    process.exit(0);
  });