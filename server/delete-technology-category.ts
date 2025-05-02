import { storage } from "./storage";

const categorySlugToDelete = "technology";

async function main() {
  console.log(`Attempting to delete category with slug: ${categorySlugToDelete}...`);

  try {
    // Find the category by slug to get its ID
    const category = await storage.getCategoryBySlug(categorySlugToDelete);

    if (!category) {
      console.log(`Category with slug "${categorySlugToDelete}" not found.`);
      return;
    }

    console.log(`Found category "${category.name}" with ID: ${category.id}. Proceeding with deletion...`);

    // Delete the category using the storage method
    const success = await storage.deleteCategory(category.id);

    if (success) {
      console.log(`Successfully deleted category: ${category.name} (ID: ${category.id})`);
    } else {
      console.log(`Failed to delete category: ${category.name} (ID: ${category.id}). It might be in use by articles.`);
    }
  } catch (error) {
    console.error("An error occurred during the deletion process:", error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Delete script finished.");
    process.exit(0);
  }); 