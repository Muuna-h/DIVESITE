#!/bin/bash

# Run the database migration first using Supabase
echo "Running database migration..."
supabase db push # This command assumes you have a Supabase CLI set up

# Check if migration was successful
if [ $? -eq 0 ]; then
  echo "Migration successful! Updating categories with images..."
  
  # Run the update-categories script using Supabase
  npx tsx server/update-categories-supabase.ts # Adjust the script to use Supabase
  
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