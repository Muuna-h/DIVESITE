import { 
  users, categories, articles, subscribers, contactMessages, siteStats,
  type User, type InsertUser, 
  type Category, type InsertCategory,
  type Article, type InsertArticle, 
  type Subscriber, type InsertSubscriber,
  type ContactMessage, type InsertContactMessage,
  type SiteStat, type InsertSiteStat
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private usersStore: Map<number, User>;
  private categoriesStore: Map<number, Category>;
  private articlesStore: Map<number, Article>;
  private subscribersStore: Map<number, Subscriber>;
  private contactMessagesStore: Map<number, ContactMessage>;
  private siteStatsStore: Map<number, SiteStat>;
  
  private userIdCounter: number;
  private categoryIdCounter: number;
  private articleIdCounter: number;
  private subscriberIdCounter: number;
  private contactMessageIdCounter: number;
  private siteStatsIdCounter: number;

  constructor() {
    this.usersStore = new Map();
    this.categoriesStore = new Map();
    this.articlesStore = new Map();
    this.subscribersStore = new Map();
    this.contactMessagesStore = new Map();
    this.siteStatsStore = new Map();
    
    this.userIdCounter = 1;
    this.categoryIdCounter = 1;
    this.articleIdCounter = 1;
    this.subscriberIdCounter = 1;
    this.contactMessageIdCounter = 1;
    this.siteStatsIdCounter = 1;
    
    // Initialize with default admin user
    this.createUser({
      username: "admin",
      password: "password",
      name: "Admin User",
      email: "admin@divetech.com",
      role: "admin"
    });
    
    // Initialize with default categories
    this.initializeCategories();
  }

  private initializeCategories() {
    const defaultCategories: InsertCategory[] = [
      {
        name: "Information Technology",
        slug: "it",
        description: "Networking, Cloud Computing, Cybersecurity, Data Storage",
        icon: "fa-server",
        gradient: "bg-gradient-to-r from-blue-500 to-blue-700"
      },
      {
        name: "Software Development",
        slug: "software",
        description: "Programming Languages, Web/App Dev, AI/ML, Mobile Dev",
        icon: "fa-code",
        gradient: "bg-gradient-to-r from-purple-500 to-indigo-600"
      },
      {
        name: "Hardware Technology",
        slug: "hardware",
        description: "Computers, Semiconductors, IoT Devices, Robotics",
        icon: "fa-microchip",
        gradient: "bg-gradient-to-r from-gray-600 to-gray-800"
      },
      {
        name: "Emerging Technologies",
        slug: "emerging",
        description: "Quantum Computing, Blockchain, AR/VR, Biotech",
        icon: "fa-atom",
        gradient: "bg-gradient-to-r from-cyan-500 to-teal-500"
      },
      {
        name: "Green Tech",
        slug: "green",
        description: "Renewable Energy, Sustainable Manufacturing, EVs",
        icon: "fa-leaf",
        gradient: "bg-gradient-to-r from-green-500 to-emerald-600"
      },
      {
        name: "Media & Entertainment",
        slug: "media",
        description: "Gaming, Film/Audio Tech, Streaming Services",
        icon: "fa-gamepad",
        gradient: "bg-gradient-to-r from-red-500 to-pink-600"
      },
      {
        name: "Communication Technology",
        slug: "communication",
        description: "Telecom, Mobile Tech, Video Conferencing",
        icon: "fa-satellite-dish",
        gradient: "bg-gradient-to-r from-amber-500 to-orange-600"
      },
      {
        name: "Tech Jobs & Internships",
        slug: "jobs",
        description: "Career advice, job listings, and interview preparation",
        icon: "fa-briefcase",
        gradient: "bg-gradient-to-r from-blue-400 to-violet-500"
      },
      {
        name: "Tech Product Reviews",
        slug: "reviews",
        description: "Hands-on reviews, comparisons, and buying guides",
        icon: "fa-star",
        gradient: "bg-gradient-to-r from-slate-500 to-slate-700"
      }
    ];

    defaultCategories.forEach(category => this.createCategory(category));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.usersStore.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersStore.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.usersStore.set(id, user);
    return user;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categoriesStore.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categoriesStore.values()).find(
      (category) => category.slug === slug
    );
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categoriesStore.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const category: Category = { ...insertCategory, id };
    this.categoriesStore.set(id, category);
    return category;
  }

  // Article methods
  async getArticles(): Promise<Article[]> {
    const articles = Array.from(this.articlesStore.values());
    return Promise.all(
      articles.map(async (article) => ({
        ...article,
        category: await this.getCategoryById(article.categoryId),
        author: article.authorId ? await this.getUser(article.authorId) : undefined
      }))
    );
  }

  async getArticleById(id: number): Promise<Article | undefined> {
    const article = this.articlesStore.get(id);
    if (!article) return undefined;
    
    return {
      ...article,
      category: await this.getCategoryById(article.categoryId),
      author: article.authorId ? await this.getUser(article.authorId) : undefined
    };
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    const article = Array.from(this.articlesStore.values()).find(
      (article) => article.slug === slug
    );
    
    if (!article) return undefined;
    
    return {
      ...article,
      category: await this.getCategoryById(article.categoryId),
      author: article.authorId ? await this.getUser(article.authorId) : undefined
    };
  }

  async getFeaturedArticles(): Promise<Article[]> {
    const articles = Array.from(this.articlesStore.values())
      .filter(article => article.featured)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    return Promise.all(
      articles.map(async (article) => ({
        ...article,
        category: await this.getCategoryById(article.categoryId),
        author: article.authorId ? await this.getUser(article.authorId) : undefined
      }))
    );
  }

  async getLatestArticles(limit: number = 6): Promise<Article[]> {
    const articles = Array.from(this.articlesStore.values())
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
    
    return Promise.all(
      articles.map(async (article) => ({
        ...article,
        category: await this.getCategoryById(article.categoryId),
        author: article.authorId ? await this.getUser(article.authorId) : undefined
      }))
    );
  }

  async getArticlesByCategory(categoryId: number): Promise<Article[]> {
    const articles = Array.from(this.articlesStore.values())
      .filter(article => article.categoryId === categoryId)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    return Promise.all(
      articles.map(async (article) => ({
        ...article,
        category: await this.getCategoryById(article.categoryId),
        author: article.authorId ? await this.getUser(article.authorId) : undefined
      }))
    );
  }

  async getArticlesByCategorySlug(slug: string): Promise<Article[]> {
    const category = await this.getCategoryBySlug(slug);
    if (!category) return [];
    
    return this.getArticlesByCategory(category.id);
  }

  async searchArticles(query: string): Promise<Article[]> {
    const normalizedQuery = query.toLowerCase();
    
    const articles = Array.from(this.articlesStore.values())
      .filter(article => 
        article.title.toLowerCase().includes(normalizedQuery) ||
        article.summary.toLowerCase().includes(normalizedQuery) ||
        article.content.toLowerCase().includes(normalizedQuery) ||
        (article.tags && article.tags.some(tag => tag.toLowerCase().includes(normalizedQuery)))
      )
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    return Promise.all(
      articles.map(async (article) => ({
        ...article,
        category: await this.getCategoryById(article.categoryId),
        author: article.authorId ? await this.getUser(article.authorId) : undefined
      }))
    );
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.articleIdCounter++;
    const now = new Date();
    const article: Article = {
      ...insertArticle,
      id,
      views: 0,
      publishedAt: now,
      createdAt: now,
      updatedAt: now
    };
    
    this.articlesStore.set(id, article);
    
    // Add category and author data
    article.category = await this.getCategoryById(article.categoryId);
    if (article.authorId) {
      article.author = await this.getUser(article.authorId);
    }
    
    return article;
  }

  async updateArticle(id: number, updateData: Partial<InsertArticle>): Promise<Article | undefined> {
    const article = this.articlesStore.get(id);
    if (!article) return undefined;
    
    const updatedArticle: Article = {
      ...article,
      ...updateData,
      updatedAt: new Date()
    };
    
    this.articlesStore.set(id, updatedArticle);
    
    // Add category and author data
    updatedArticle.category = await this.getCategoryById(updatedArticle.categoryId);
    if (updatedArticle.authorId) {
      updatedArticle.author = await this.getUser(updatedArticle.authorId);
    }
    
    return updatedArticle;
  }

  async deleteArticle(id: number): Promise<boolean> {
    return this.articlesStore.delete(id);
  }

  async incrementArticleViews(id: number): Promise<void> {
    const article = this.articlesStore.get(id);
    if (article) {
      article.views += 1;
      this.articlesStore.set(id, article);
    }
  }

  // Subscriber methods
  async getSubscribers(): Promise<Subscriber[]> {
    return Array.from(this.subscribersStore.values());
  }

  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    // Check if email already exists
    const existingSubscriber = Array.from(this.subscribersStore.values()).find(
      sub => sub.email === insertSubscriber.email
    );
    
    if (existingSubscriber) {
      if (!existingSubscriber.active) {
        // Reactivate subscriber
        existingSubscriber.active = true;
        this.subscribersStore.set(existingSubscriber.id, existingSubscriber);
      }
      return existingSubscriber;
    }
    
    const id = this.subscriberIdCounter++;
    const createdAt = new Date();
    const subscriber: Subscriber = { ...insertSubscriber, id, createdAt };
    this.subscribersStore.set(id, subscriber);
    return subscriber;
  }

  // Contact message methods
  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessagesStore.values());
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.contactMessageIdCounter++;
    const createdAt = new Date();
    const message: ContactMessage = { 
      ...insertMessage, 
      id, 
      read: false, 
      createdAt 
    };
    this.contactMessagesStore.set(id, message);
    return message;
  }

  async markMessageAsRead(id: number): Promise<boolean> {
    const message = this.contactMessagesStore.get(id);
    if (!message) return false;
    
    message.read = true;
    this.contactMessagesStore.set(id, message);
    return true;
  }

  // Site stats methods
  async getSiteStats(): Promise<SiteStat[]> {
    return Array.from(this.siteStatsStore.values());
  }

  async updateSiteStats(updateData: Partial<InsertSiteStat>): Promise<SiteStat> {
    // Get today's stats or create new
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingStat = Array.from(this.siteStatsStore.values()).find(
      stat => new Date(stat.date).setHours(0, 0, 0, 0) === today.getTime()
    );
    
    if (existingStat) {
      const updatedStat: SiteStat = {
        ...existingStat,
        pageViews: updateData.pageViews !== undefined ? updateData.pageViews : existingStat.pageViews,
        uniqueVisitors: updateData.uniqueVisitors !== undefined ? updateData.uniqueVisitors : existingStat.uniqueVisitors,
        bounceRate: updateData.bounceRate !== undefined ? updateData.bounceRate : existingStat.bounceRate,
        avgSessionDuration: updateData.avgSessionDuration !== undefined ? updateData.avgSessionDuration : existingStat.avgSessionDuration
      };
      
      this.siteStatsStore.set(existingStat.id, updatedStat);
      return updatedStat;
    } else {
      const id = this.siteStatsIdCounter++;
      const newStat: SiteStat = {
        id,
        pageViews: updateData.pageViews || 0,
        uniqueVisitors: updateData.uniqueVisitors || 0,
        bounceRate: updateData.bounceRate || 0,
        avgSessionDuration: updateData.avgSessionDuration || 0,
        date: today
      };
      
      this.siteStatsStore.set(id, newStat);
      return newStat;
    }
  }
}

export const storage = new MemStorage();
