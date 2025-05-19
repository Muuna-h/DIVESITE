-- Update author_id column to UUID type
ALTER TABLE "articles" 
  ALTER COLUMN "author_id" TYPE uuid USING author_id::uuid;
