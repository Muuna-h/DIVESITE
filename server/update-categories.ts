import { storage } from "./storage";
import fs from "fs";
import path from "path";

async function main() {
  console.log("Updating categories with images...");
  
  // Get all categories
  const categories = await storage.getCategories();
  console.log(`Found ${categories.length} categories`);
  
  // Define mapping between category slugs and image files
  const categoryImageMap: Record<string, string> = {
    it: "Information Technology.png",
    software: "Software Development.png",
    hardware: "Hardware Technology.png",
    emerging: "Emerging Technologies.png",
    green: "Green Tech.png",
    media: "Media & Entertainment.png",
    communication: "Communication Technology.png",
    jobs: "Tech Jobs & Internships.png",
    reviews: "Tech Product Reviews.png"
  };
  
  // Create uploads directory if it doesn't exist
  const uploadDir = path.resolve(process.cwd(), 'public/uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  // Copy images from attached_assets to public/uploads and update categories
  const sourceDir = path.resolve(process.cwd(), 'attached_assets');
  
  for (const category of categories) {
    const imageFile = categoryImageMap[category.slug];
    if (!imageFile) {
      console.log(`No image mapping found for category: ${category.slug}`);
      continue;
    }
    
    const sourcePath = path.join(sourceDir, imageFile);
    
    // Check if source file exists
    if (!fs.existsSync(sourcePath)) {
      console.log(`Source image not found: ${sourcePath}`);
      continue;
    }
    
    // Generate a unique filename to prevent caching issues
    const uniqueFilename = `${category.slug}-${Date.now()}.png`;
    const destPath = path.join(uploadDir, uniqueFilename);
    
    try {
      // Copy the file to uploads directory
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied ${sourcePath} to ${destPath}`);
      
      // Update the category with the image URL
      await storage.updateCategory(category.id, {
        ...category,
        image: uniqueFilename
      });
      
      console.log(`Updated category ${category.name} with image ${uniqueFilename}`);
    } catch (error) {
      console.error(`Error updating category ${category.name}:`, error);
    }
  }
  
  console.log("Category update completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  }); 