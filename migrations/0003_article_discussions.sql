-- Create the Article Discussions category
INSERT INTO forum_categories (id, name, slug, description, created_at, is_default)
VALUES (
  'article-discussions',
  'Article Discussions',
  'article-discussions',
  'Discussions about articles posted on the site.',
  NOW(),
  true
)
ON CONFLICT (id) DO NOTHING;
