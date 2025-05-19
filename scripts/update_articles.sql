-- Create a temporary articles table with the new UUID column
create table articles_new (
    id serial primary key,
    title text not null,
    slug text not null unique,
    summary text not null,
    content text not null,
    image text not null,
    top_image text,
    mid_image text,
    bottom_image text,
    category_id integer not null references categories(id),
    author_id uuid references users(id),  -- Changed to UUID
    tags text[],
    featured boolean default false,
    views integer default 0,
    published_at timestamp with time zone default now(),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Copy data from the old articles table
insert into articles_new (
    id, title, slug, summary, content, image,
    top_image, mid_image, bottom_image, category_id,
    tags, featured, views, published_at, created_at, updated_at
)
select 
    id, title, slug, summary, content, image,
    top_image, mid_image, bottom_image, category_id,
    tags, featured, views, published_at, created_at, updated_at
from articles;

-- Drop the old articles table
drop table articles;

-- Rename the new table to articles
alter table articles_new rename to articles;

-- Re-create any indexes that existed on the articles table
create index if not exists articles_author_id_idx on articles(author_id);
create index if not exists articles_category_id_idx on articles(category_id);
