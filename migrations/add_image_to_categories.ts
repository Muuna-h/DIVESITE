import { supabase } from "../server/db"; // Adjust the path as necessary

// Run migration
async function main() {
  console.log("Running migration: add_image_to_categories");
  
  try {
    // Add image column to categories table using raw SQL
    const { error } = await supabase.rpc('add_image_column_to_categories'); // Assuming you have a stored procedure for this

    if (error) {
      throw new Error(`Migration failed: ${error.message}`);
    }
    
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