import { pgTable, text, serial, integer, boolean, timestamp, jsonb, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Forum Categories table
export const forumCategories = pgTable("forum_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  icon: text("icon"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Forum Topics table
export const forumTopics = pgTable("forum_topics", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  categoryId: integer("category_id").notNull().references(() => forumCategories.id),
  authorId: integer("author_id").notNull().references(() => users.id),
  views: integer("views").default(0),
  isPinned: boolean("is_pinned").default(false),
  isLocked: boolean("is_locked").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Forum Replies table
export const forumReplies = pgTable("forum_replies", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  topicId: integer("topic_id").notNull().references(() => forumTopics.id),
  authorId: integer("author_id").notNull().references(() => users.id),
  isSolution: boolean("is_solution").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(), // Using serial for auto-increment
  username: text("username").notNull().unique(),
  password: text("password").notNull(), // Add password field
  name: text("name"),
  email: text("email"),
  bio: text("bio"),
  avatar: text("avatar"),
  role: text("role").default("author"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  icon: text("icon"),
  gradient: text("gradient"),
  image: text("image"),
  imageAlt: text("image_alt"),
  thumbnailImage: text("thumbnail_image"),
  bannerImage: text("banner_image"),
  imageMetadata: jsonb("image_metadata"),
});

// Articles table
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  image: text("image").notNull(),
  topImage: text("top_image"),
  midImage: text("mid_image"),
  bottomImage: text("bottom_image"),
  category_id: integer("category_id").notNull().references(() => categories.id),
  author_id: integer("author_id").references(() => users.id).default(1), // Default to admin user (ID: 1)
  tags: text("tags").array(),
  featured: boolean("featured").default(false),
  views: integer("views").default(0),
  publishedAt: timestamp("published_at", { withTimezone: true }).defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Newsletter subscribers table
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Contact messages table
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Site statistics table
export const siteStats = pgTable("site_stats", {
  id: serial("id").primaryKey(),
  pageViews: integer("page_views").default(0),
  uniqueVisitors: integer("unique_visitors").default(0),
  bounceRate: integer("bounce_rate").default(0),
  avgSessionDuration: integer("avg_session_duration").default(0),
  date: timestamp("date").defaultNow(),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  articles: many(articles),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  articles: many(articles),
}));

export const articlesRelations = relations(articles, ({ one }) => ({
  author: one(users, {
    fields: [articles.author_id],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [articles.category_id],
    references: [categories.id],
  }),
}));

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  bio: true,
  avatar: true,
  role: true,
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  slug: true,
  description: true,
  icon: true,
  gradient: true,
  image: true,
});

export const insertArticleSchema = createInsertSchema(articles).pick({
  title: true,
  slug: true,
  summary: true,
  content: true,
  image: true,
  topImage: true,
  midImage: true,
  bottomImage: true,
  category_id: true,
  author_id: true,
  tags: true,
  featured: true,
}).extend({
  author_id: z.string().uuid(),
});

export const insertSubscriberSchema = createInsertSchema(subscribers).pick({
  email: true,
  active: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
});

export const insertSiteStatsSchema = createInsertSchema(siteStats).pick({
  pageViews: true,
  uniqueVisitors: true,
  bounceRate: true,
  avgSessionDuration: true,
  date: true,
});

// Export types
// Forum Relations
export const forumTopicsRelations = relations(forumTopics, ({ one, many }) => ({
  category: one(forumCategories, {
    fields: [forumTopics.categoryId],
    references: [forumCategories.id],
  }),
  author: one(users, {
    fields: [forumTopics.authorId],
    references: [users.id],
  }),
  replies: many(forumReplies),
}));

export const forumRepliesRelations = relations(forumReplies, ({ one }) => ({
  topic: one(forumTopics, {
    fields: [forumReplies.topicId],
    references: [forumTopics.id],
  }),
  author: one(users, {
    fields: [forumReplies.authorId],
    references: [users.id],
  }),
}));

// Forum Schemas
export const insertForumCategorySchema = createInsertSchema(forumCategories).pick({
  name: true,
  slug: true,
  description: true,
  icon: true,
});

export const insertForumTopicSchema = createInsertSchema(forumTopics).pick({
  title: true,
  slug: true,
  content: true,
  categoryId: true,
  authorId: true,
  isPinned: true,
  isLocked: true,
});

export const insertForumReplySchema = createInsertSchema(forumReplies).pick({
  content: true,
  topicId: true,
  authorId: true,
  isSolution: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type ForumCategory = typeof forumCategories.$inferSelect;
export type ForumTopic = typeof forumTopics.$inferSelect;
export type ForumReply = typeof forumReplies.$inferSelect;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Article = typeof articles.$inferSelect & {
  category?: Category;
  author?: User;
};
export type InsertArticle = z.infer<typeof insertArticleSchema>;

export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

export type SiteStat = typeof siteStats.$inferSelect;
export type InsertSiteStat = z.infer<typeof insertSiteStatsSchema>;
