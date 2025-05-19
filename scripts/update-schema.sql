-- Update the users table schema
ALTER TABLE users ALTER COLUMN id TYPE text;
ALTER TABLE users ALTER COLUMN id DROP DEFAULT;  -- Remove serial
DROP SEQUENCE IF EXISTS users_id_seq;  -- Clean up the sequence

-- Reset users table if needed (be careful with this in production!)
TRUNCATE TABLE users CASCADE;

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
