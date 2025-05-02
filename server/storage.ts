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
import { eq, like, desc, asc, and, or, sql, gte, lte, sum, lt } from 'drizzle-orm';

// Define structure for stats comparison
interface SiteStatsAggregate {
  totalPageViews: number;
  totalUniqueVisitors: number;
  avgBounceRate: number;
  avgSessionDuration: number;
}

// Modify the interface with any CRUD methods you might need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category methods
  getCategories(options?: { includeDetails?: boolean }): Promise<Partial<Category>[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  getCategoryById(id: number): Promise<Category | undefined>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
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
  getSiteStatsComparison(periodDays: number): Promise<{ current: SiteStatsAggregate | null, previous: SiteStatsAggregate | null }>;
  updateSiteStats(stats: Partial<InsertSiteStat>): Promise<SiteStat>;

  // Update user role
  updateUserRole(id: number, role: string): Promise<boolean>;
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

  // Update user role
  async updateUserRole(id: number, role: string): Promise<boolean> {
    try {
      const result = await db.update(users)
        .set({ role })
        .where(eq(users.id, id))
        .returning();
      
      return result.length > 0;
    } catch (error) {
      console.error('Error updating user role:', error);
      return false;
    }
  }

  // Category methods
  async getCategories(options?: { includeDetails?: boolean }): Promise<Partial<Category>[]> {
    const query = db.select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      // Conditionally select details
      ...(options?.includeDetails && {
        description: categories.description,
        icon: categories.icon,
        gradient: categories.gradient,
        image: categories.image
      })
    }).from(categories);
    
    return await query;
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    // This should always return full details
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    // This should always return full details
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.getCategoryById(id);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: number, updateData: Partial<InsertCategory>): Promise<Category | undefined> {
    try {
      const [updatedCategory] = await db.update(categories)
        .set(updateData)
        .where(eq(categories.id, id))
        .returning();
      
      return updatedCategory;
    } catch (error) {
      console.error('Error updating category:', error);
      return undefined;
    }
  }

  // Add deleteCategory method
  async deleteCategory(id: number): Promise<boolean> {
    try {
      // Before deleting the category, check if any articles are using it.
      // Option 1: Prevent deletion if articles are using it
      const articlesInCategory = await db.select({ count: sql<number>`count(*)` })
        .from(articles)
        .where(eq(articles.categoryId, id));

      if (articlesInCategory[0].count > 0) {
        console.error(`Cannot delete category ID ${id}: It is currently associated with ${articlesInCategory[0].count} articles.`);
        // You might want to throw an error or return a specific status code in a real API
        return false;
      }

      // Option 2: Set categoryId to null for associated articles (requires categoryId to be nullable in articles schema)
      // await db.update(articles).set({ categoryId: null }).where(eq(articles.categoryId, id));

      // Proceed with deletion
      const result = await db.delete(categories).where(eq(categories.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
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
    // Get all stats entries, ordered by date descending
    return await db.select().from(siteStats).orderBy(desc(siteStats.date));
  }

  // New method to get aggregated stats for comparison
  async getSiteStatsComparison(periodDays: number): Promise<{ current: SiteStatsAggregate | null, previous: SiteStatsAggregate | null }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    const currentPeriodEnd = new Date(today); // End of today (exclusive in query)
    currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 1);

    const currentPeriodStart = new Date(today);
    currentPeriodStart.setDate(currentPeriodStart.getDate() - periodDays + 1); // Start of current period (inclusive)

    const previousPeriodEnd = new Date(currentPeriodStart); // End of previous period (exclusive)
    const previousPeriodStart = new Date(previousPeriodEnd);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - periodDays); // Start of previous period (inclusive)

    const aggregateStats = async (startDate: Date, endDate: Date): Promise<SiteStatsAggregate | null> => {
      const result = await db.select({
          totalPageViews: sum(siteStats.pageViews).mapWith(Number),
          totalUniqueVisitors: sum(siteStats.uniqueVisitors).mapWith(Number),
          avgBounceRate: sql<number>`AVG(${siteStats.bounceRate})`.mapWith(Number),
          avgSessionDuration: sql<number>`AVG(${siteStats.avgSessionDuration})`.mapWith(Number)
        })
        .from(siteStats)
        .where(and(
          gte(siteStats.date, startDate), // Inclusive start date
          lt(siteStats.date, endDate)    // Exclusive end date
        ));
        
      const stats = result[0];
      // Check if any aggregation result is null (meaning no data in the period)
      if (stats.totalPageViews === null || stats.totalUniqueVisitors === null) {
          return null; 
      }
      
      return {
        totalPageViews: stats.totalPageViews ?? 0,
        totalUniqueVisitors: stats.totalUniqueVisitors ?? 0,
        // Use ?? 0 for averages as well, assuming 0 if no data
        avgBounceRate: stats.avgBounceRate ?? 0,
        avgSessionDuration: stats.avgSessionDuration ?? 0
      };
    };

    const current = await aggregateStats(currentPeriodStart, currentPeriodEnd);
    const previous = await aggregateStats(previousPeriodStart, previousPeriodEnd);

    return { current, previous };
  }

  async updateSiteStats(updateData: Partial<InsertSiteStat>): Promise<SiteStat> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [existingStat] = await db.select().from(siteStats)
      .where(sql`DATE(${siteStats.date}) = DATE(${today})`);
    
    if (existingStat) {
      // Increment existing daily stats
      const [updatedStat] = await db.update(siteStats)
        .set({
          pageViews: sql`${siteStats.pageViews} + ${updateData.pageViews || 0}`,
          uniqueVisitors: sql`${siteStats.uniqueVisitors} + ${updateData.uniqueVisitors || 0}`,
          // A simple average update isn't statistically correct for bounce/duration.
          // Ideally, you'd store raw data (total bounces, total sessions, total duration) 
          // and calculate the average when needed, or use a weighted average update.
          // Keeping simple update for now, but flag as potentially inaccurate.
          bounceRate: updateData.bounceRate !== undefined ? updateData.bounceRate : existingStat.bounceRate, // Overwrites daily average
          avgSessionDuration: updateData.avgSessionDuration !== undefined ? updateData.avgSessionDuration : existingStat.avgSessionDuration // Overwrites daily average
        })
        .where(eq(siteStats.id, existingStat.id))
        .returning();
      
      return updatedStat;
    } else {
      // Create new daily stats entry
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