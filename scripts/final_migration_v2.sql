-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Begin transaction
BEGIN;

-- Create temporary tables to store existing data
CREATE TABLE users_temp AS SELECT * FROM users;
CREATE TABLE articles_temp AS SELECT * FROM articles;

-- Drop existing tables (cascade will remove dependencies)
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create new users table with UUID primary key
CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    username text NOT NULL UNIQUE,
    email text,
    name text,
    bio text,
    avatar text,
    role text DEFAULT 'author',
    created_at timestamp with time zone DEFAULT NOW()
);

-- Create new articles table with UUID author_id
CREATE TABLE articles (
    id serial PRIMARY KEY,
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    summary text NOT NULL,
    content text NOT NULL,
    image text NOT NULL,
    top_image text,
    mid_image text,
    bottom_image text,
    category_id integer NOT NULL REFERENCES categories(id),
    author_id uuid REFERENCES users(id), -- Changed to UUID to match users.id
    tags text[],
    featured boolean DEFAULT false,
    views integer DEFAULT 0,
    published_at timestamp with time zone DEFAULT NOW(),
    created_at timestamp with time zone DEFAULT NOW(),
    updated_at timestamp with time zone DEFAULT NOW()
);

-- Create indexes
CREATE INDEX users_username_idx ON users(username);
CREATE INDEX users_email_idx ON users(email);
CREATE INDEX articles_author_id_idx ON articles(author_id);
CREATE INDEX articles_category_id_idx ON articles(category_id);

-- Create auth handling function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, username, role)
  VALUES (
    new.id::uuid,
    new.email,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'role', 'author')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

COMMIT;
