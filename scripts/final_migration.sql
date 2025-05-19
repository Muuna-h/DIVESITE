-- Enable the necessary extensions
create extension if not exists "uuid-ossp";

-- Backup existing users and their relationships
create table if not exists users_backup as 
select * from users;

-- Drop existing foreign key constraints
alter table articles 
  drop constraint if exists articles_author_id_fkey;

-- Create new users table with UUID primary key
create table users_new (
  id uuid primary key default uuid_generate_v4(),
  username text not null unique,
  email text,
  name text,
  bio text,
  avatar text,
  role text default 'author',
  created_at timestamp with time zone default now()
);

-- Create index on username and email
create index if not exists users_username_idx on users_new(username);
create index if not exists users_email_idx on users_new(email);

-- Migrate data from backup (if needed)
insert into users_new (username, email, name, bio, avatar, role, created_at)
select username, email, name, bio, avatar, role, created_at
from users_backup;

-- Drop old users table
drop table if exists users;

-- Rename new table to users
alter table users_new rename to users;

-- Recreate foreign key constraints
alter table articles
  add constraint articles_author_id_fkey
  foreign key (author_id) references users(id);

-- Create auth handling function
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, username, role)
  values (
    new.id::uuid,
    new.email,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'author')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
