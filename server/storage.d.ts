// Type declaration file for the storage.ts module
import { 
  User, InsertUser, 
  Category, InsertCategory,
  Article, InsertArticle, 
  Subscriber, InsertSubscriber,
  ContactMessage, InsertContactMessage,
  SiteStat, InsertSiteStat
} from "../shared/schema";

// Declare module augmentation for storage.ts
declare module "./storage" {
  interface StorageEngine {
    // User methods
    getUser(id: number): Promise<User | undefined>;
    getUserByUsername(username: string): Promise<User | undefined>;
    createUser(user: InsertUser): Promise<User>;
    updateUserRole(id: number, role: string): Promise<boolean>;
    
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

  const storage: StorageEngine;
} 