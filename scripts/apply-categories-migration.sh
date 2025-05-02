#!/bin/bash

# Run the database migration first
echo "Running database migration..."
npx tsx migrations/add_image_to_categories.ts

# Check if migration was successful
if [ $? -eq 0 ]; then
  echo "Migration successful! Updating categories with images..."
  
  # Run the update-categories script
  npx tsx server/update-categories.ts
  
  if [ $? -eq 0 ]; then
    echo "Categories updated successfully!"
  else
    echo "Error updating categories!"
    exit 1
  fi
else
  echo "Migration failed!"
  exit 1
fi

echo "All done! Your categories now have images attached."
exit 0 