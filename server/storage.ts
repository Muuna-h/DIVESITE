import { 
  users, categories, articles, subscribers, contactMessages, siteStats,
  type User, type InsertUser, 
  type Category, type InsertCategory,
  type Article, type InsertArticle, 
  type Subscriber, type InsertSubscriber,
  type ContactMessage, type InsertContactMessage,
  type SiteStat, type InsertSiteStat
} from "@shared/schema";
import { db } from './db';
import { eq, like, desc, asc, and, or, sql } from 'drizzle-orm';

// Modify the interface with any CRUD methods you might need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category methods
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Article methods
  getArticles(): Promise<Article[]>;
  getArticleById(id: number): Promise<Article | undefined>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  getFeaturedArticles(): Promise<Article[]>;
  getLatestArticles(limit?: number): Promise<Article[]>;
  getArticlesByCategory(categoryId: number): Promise<Article[]>;
  getArticlesByCategorySlug(slug: string): Promise<Article[]>;
  searchArticles(query: string): Promise<Article[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: number): Promise<boolean>;
  incrementArticleViews(id: number): Promise<void>;
  
  // Subscriber methods
  getSubscribers(): Promise<Subscriber[]>;
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  
  // Contact message methods
  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markMessageAsRead(id: number): Promise<boolean>;
  
  // Site stats methods
  getSiteStats(): Promise<SiteStat[]>;
  updateSiteStats(stats: Partial<InsertSiteStat>): Promise<SiteStat>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  // Article methods
  async getArticles(): Promise<Article[]> {
    const articlesData = await db.select().from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .leftJoin(users, eq(articles.authorId, users.id));

    return articlesData.map(({ articles: article, categories: category, users: author }) => ({
      ...article,
      category: category || undefined,
      author: author || undefined
    }));
  }

  async getArticleById(id: number): Promise<Article | undefined> {
    const [result] = await db.select().from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .leftJoin(users, eq(articles.authorId, users.id))
      .where(eq(articles.id, id));

    if (!result) return undefined;

    return {
      ...result.articles,
      category: result.categories || undefined,
      author: result.users || undefined
    };
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    const [result] = await db.select().from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .leftJoin(users, eq(articles.authorId, users.id))
      .where(eq(articles.slug, slug));

    if (!result) return undefined;

    return {
      ...result.articles,
      category: result.categories || undefined,
      author: result.users || undefined
    };
  }

  async getFeaturedArticles(): Promise<Article[]> {
    const articlesData = await db.select().from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .leftJoin(users, eq(articles.authorId, users.id))
      .where(eq(articles.featured, true))
      .orderBy(desc(articles.publishedAt));

    return articlesData.map(({ articles: article, categories: category, users: author }) => ({
      ...article,
      category: category || undefined,
      author: author || undefined
    }));
  }

  async getLatestArticles(limit: number = 6): Promise<Article[]> {
    const articlesData = await db.select().from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .leftJoin(users, eq(articles.authorId, users.id))
      .orderBy(desc(articles.publishedAt))
      .limit(limit);

    return articlesData.map(({ articles: article, categories: category, users: author }) => ({
      ...article,
      category: category || undefined,
      author: author || undefined
    }));
  }

  async getArticlesByCategory(categoryId: number): Promise<Article[]> {
    const articlesData = await db.select().from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .leftJoin(users, eq(articles.authorId, users.id))
      .where(eq(articles.categoryId, categoryId))
      .orderBy(desc(articles.publishedAt));

    return articlesData.map(({ articles: article, categories: category, users: author }) => ({
      ...article,
      category: category || undefined,
      author: author || undefined
    }));
  }

  async getArticlesByCategorySlug(slug: string): Promise<Article[]> {
    const category = await this.getCategoryBySlug(slug);
    if (!category) return [];
    
    return this.getArticlesByCategory(category.id);
  }

  async searchArticles(query: string): Promise<Article[]> {
    const searchQuery = `%${query.toLowerCase()}%`;
    
    const articlesData = await db.select().from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .leftJoin(users, eq(articles.authorId, users.id))
      .where(
        or(
          like(sql`LOWER(${articles.title})`, searchQuery),
          like(sql`LOWER(${articles.summary})`, searchQuery),
          like(sql`LOWER(${articles.content})`, searchQuery)
          // Note: Searching through array of tags would need a different approach
        )
      )
      .orderBy(desc(articles.publishedAt));

    return articlesData.map(({ articles: article, categories: category, users: author }) => ({
      ...article,
      category: category || undefined,
      author: author || undefined
    }));
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const now = new Date();
    const articleToInsert = {
      ...insertArticle,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
      views: 0
    };
    
    const [article] = await db.insert(articles).values(articleToInsert).returning();
    
    // Get the article with related entities
    const fullArticle = await this.getArticleById(article.id);
    if (!fullArticle) {
      throw new Error("Failed to retrieve created article");
    }
    return fullArticle;
  }

  async updateArticle(id: number, updateData: Partial<InsertArticle>): Promise<Article | undefined> {
    const articleExists = await this.getArticleById(id);
    if (!articleExists) return undefined;
    
    const [article] = await db.update(articles)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(articles.id, id))
      .returning();
    
    return this.getArticleById(article.id);
  }

  async deleteArticle(id: number): Promise<boolean> {
    const result = await db.delete(articles).where(eq(articles.id, id)).returning();
    return result.length > 0;
  }

  async incrementArticleViews(id: number): Promise<void> {
    await db.update(articles)
      .set({
        views: sql`${articles.views} + 1`
      })
      .where(eq(articles.id, id));
  }

  // Subscriber methods
  async getSubscribers(): Promise<Subscriber[]> {
    return await db.select().from(subscribers);
  }

  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    // Check if email already exists
    const [existingSubscriber] = await db.select().from(subscribers)
      .where(eq(subscribers.email, insertSubscriber.email));
    
    if (existingSubscriber) {
      if (!existingSubscriber.active) {
        // Reactivate subscriber
        const [updatedSubscriber] = await db.update(subscribers)
          .set({ active: true })
          .where(eq(subscribers.id, existingSubscriber.id))
          .returning();
        return updatedSubscriber;
      }
      return existingSubscriber;
    }
    
    const [subscriber] = await db.insert(subscribers)
      .values({
        ...insertSubscriber,
        createdAt: new Date()
      })
      .returning();
    
    return subscriber;
  }

  // Contact message methods
  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages);
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const [message] = await db.insert(contactMessages)
      .values({
        ...insertMessage,
        read: false,
        createdAt: new Date()
      })
      .returning();
    
    return message;
  }

  async markMessageAsRead(id: number): Promise<boolean> {
    const result = await db.update(contactMessages)
      .set({ read: true })
      .where(eq(contactMessages.id, id))
      .returning();
    
    return result.length > 0;
  }

  // Site stats methods
  async getSiteStats(): Promise<SiteStat[]> {
    return await db.select().from(siteStats);
  }

  async updateSiteStats(updateData: Partial<InsertSiteStat>): Promise<SiteStat> {
    // Get today's stats or create new
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [existingStat] = await db.select().from(siteStats)
      .where(sql`DATE(${siteStats.date}) = DATE(${today})`);
    
    if (existingStat) {
      const [updatedStat] = await db.update(siteStats)
        .set({
          pageViews: updateData.pageViews !== undefined ? updateData.pageViews : existingStat.pageViews,
          uniqueVisitors: updateData.uniqueVisitors !== undefined ? updateData.uniqueVisitors : existingStat.uniqueVisitors,
          bounceRate: updateData.bounceRate !== undefined ? updateData.bounceRate : existingStat.bounceRate,
          avgSessionDuration: updateData.avgSessionDuration !== undefined ? updateData.avgSessionDuration : existingStat.avgSessionDuration
        })
        .where(eq(siteStats.id, existingStat.id))
        .returning();
      
      return updatedStat;
    } else {
      const [newStat] = await db.insert(siteStats)
        .values({
          pageViews: updateData.pageViews || 0,
          uniqueVisitors: updateData.uniqueVisitors || 0,
          bounceRate: updateData.bounceRate || 0,
          avgSessionDuration: updateData.avgSessionDuration || 0,
          date: today
        })
        .returning();
      
      return newStat;
    }
  }
}

// Use DatabaseStorage instead of MemStorage
export const storage = new DatabaseStorage();