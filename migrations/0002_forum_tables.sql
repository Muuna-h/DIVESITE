CREATE TABLE IF NOT EXISTS forum_categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS forum_topics (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    category_id INTEGER NOT NULL REFERENCES forum_categories(id),
    author_id INTEGER NOT NULL REFERENCES users(id),
    views INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS forum_replies (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    topic_id INTEGER NOT NULL REFERENCES forum_topics(id),
    author_id INTEGER NOT NULL REFERENCES users(id),
    is_solution BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX forum_topics_category_id_idx ON forum_topics(category_id);
CREATE INDEX forum_topics_author_id_idx ON forum_topics(author_id);
CREATE INDEX forum_replies_topic_id_idx ON forum_replies(topic_id);
CREATE INDEX forum_replies_author_id_idx ON forum_replies(author_id);
