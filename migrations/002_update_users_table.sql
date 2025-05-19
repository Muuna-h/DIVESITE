-- Create a temporary table to store existing users
CREATE TABLE users_temp AS SELECT * FROM users;

-- Drop existing foreign key constraints
ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_author_id_fkey;

-- Drop the existing users table
DROP TABLE users;

-- Create the new users table with text ID
CREATE TABLE users (
    id text PRIMARY KEY,
    username text NOT NULL UNIQUE,
    password text NOT NULL,
    name text,
    email text,
    bio text,
    avatar text,
    role text DEFAULT 'author',
    created_at timestamp DEFAULT NOW()
);

-- Create index on username for faster lookups
CREATE INDEX users_username_idx ON users(username);

-- Re-create the foreign key constraint
ALTER TABLE articles
    ADD CONSTRAINT articles_author_id_fkey
    FOREIGN KEY (author_id) REFERENCES users(id);

-- Add authentication trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
begin
  insert into public.users (id, email, username, role)
  values (new.id, new.email, new.raw_user_meta_data->>'username', 
         coalesce(new.raw_user_meta_data->>'role', 'author'));
  return new;
end;
$$;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
