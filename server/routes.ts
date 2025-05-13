import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { sql } from "drizzle-orm";
import { categories, articles, users } from "@shared/schema";
import session from "express-session";
import memorystore from "memorystore";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { 
  insertArticleSchema, insertUserSchema, insertContactMessageSchema, insertSubscriberSchema,
  type User as DbUser, 
  type InsertUser, 
  type Category, type InsertCategory,
  type Article, type InsertArticle, 
  type Subscriber, type InsertSubscriber,
  type ContactMessage, type InsertContactMessage,
  type SiteStat
} from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { IStorage } from "./storage";
import sharp from 'sharp';

// Add type for memorystore without using module augmentation
type MemoryStore = ReturnType<typeof memorystore>;

// Type assertion for storage
const typedStorage = storage as IStorage;

// Define Express namespace
declare global {
  namespace Express {
    // Explicitly define User interface based on DbUser type
    interface User {
      id: number;
      username: string;
      password: string;
      name: string | null;
      email: string | null;
      bio: string | null;
      avatar: string | null;
      role: string | null;
      createdAt: Date | null;
    }
  }
}

const MemoryStore = memorystore(session);

// Helper function for image optimization
const optimizeImage = async (filePath: string, quality: number = 80, maxWidth: number = 1200) => {
  let tempPath: string | null = null; // Declare tempPath here
  try {
    tempPath = `${filePath}.temp`; // Assign value inside try
    
    await sharp(filePath)
      .resize({ width: maxWidth, height: maxWidth, fit: 'inside', withoutEnlargement: true })
      .webp({ quality })
      .toFile(tempPath);
      
    // Replace original file with optimized version
    fs.renameSync(tempPath, filePath); 
    console.log(`Optimized image saved to: ${filePath}`);
  } catch (error) {
    console.error(`Error optimizing image ${filePath}:`, error);
    // Decide if you want to keep the original or delete it on error
    // For now, we keep the original if optimization fails
    if (tempPath) { // Check if tempPath was assigned
      try { fs.unlinkSync(tempPath); } catch {} // Clean up temp file if it exists
    }
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  app.use(
    session({
      cookie: { 
        maxAge: 3600000, // 1 hour in milliseconds
        httpOnly: true, // Recommended for security
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'lax' // Recommended for security
      },
      store: new MemoryStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      rolling: true, // Reset maxAge on every response
      resave: false, // Don't save session if unmodified
      saveUninitialized: false, // Don't create session until something stored
      secret: process.env.SESSION_SECRET || "dive-tech-secret",
    })
  );

  // Configure passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Passport local strategy
  passport.use(
    new LocalStrategy(async (username: string, password: string, done) => {
      try {
        const user = await typedStorage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        if (user.password !== password) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, done: (err: Error | null, id?: number) => void) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done: (err: Error | null, user?: any | false) => void) => {
    try {
      const user = await typedStorage.getUser(id);
      done(null, user || false);
    } catch (err) {
      done(err as Error);
    }
  });

  // Setup image upload folder and multer configuration
  const uploadDir = path.resolve(process.cwd(), 'public/uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, uniqueSuffix + ext);
    }
  });

  const upload = multer({ 
    storage: multerStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function(req, file, cb) {
      const allowedTypes = /jpeg|jpg|png|gif|webp/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      
      if (extname && mimetype) {
        return cb(null, true);
      } else {
        cb(new Error("Invalid file type. Only JPEG, PNG, GIF and WEBP images are allowed."));
      }
    }
  });

  // Define routes - prefix all with /api
  
  // Auth routes
  app.post("/api/auth/login", (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (err: Error | null, user: any, info: { message: string }) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info.message });
      
      (req as any).logIn(user, (err: Error | null) => {
        if (err) return next(err);
        return res.json({ 
          user: { 
            id: user.id, 
            username: user.username, 
            name: user.name, 
            role: user.role 
          } 
        });
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    (req as any).logout((err: Error | null) => {
      if (err) return res.status(500).json({ message: "Error logging out" });
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", (req: Request, res: Response) => {
    if (!(req as any).isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    res.json({ 
      user: { 
        id: user.id, 
        username: user.username, 
        name: user.name, 
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        role: user.role 
      } 
    });
  });

  // Middleware to check if user is authenticated
  const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if ((req as any).isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // Middleware to check if user is admin
  const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if ((req as any).isAuthenticated() && ((req as any).user)?.role === "admin") {
      return next();
    }
    res.status(403).json({ message: "Forbidden" });
  };

  // Category routes
  app.get("/api/categories", async (req: Request, res: Response) => {
    try {
      // Check database connection first
      const dbConnected = await checkDatabaseConnection();
      if (!dbConnected) {
        return sendSafeJSONResponse(res, { 
          error: 'Database connection error', 
          message: 'Failed to connect to the database. Check your Supabase configuration.',
          categories: [] 
        });
      }
      
      // Check for includeDetails query parameter
      const includeDetails = req.query.includeDetails === 'true';
      
      // Get categories with error handling in the storage method
      const categories = await storage.getCategories({ includeDetails });
      
      // Use a simplified approach - manually create a simple object structure
      const simplifiedCategories = categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        gradient: cat.gradient,
        image: cat.image
      }));
      
      // Use our safe JSON response helper
      sendSafeJSONResponse(res, { categories: simplifiedCategories });
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Use our safe JSON response helper for errors too
      sendSafeJSONResponse(res, { 
        error: 'Failed to fetch categories', 
        message: error instanceof Error ? error.message : String(error),
        categories: [] 
      });
    }
  });

  app.get("/api/categories/:slug", async (req: Request, res: Response) => {
    // This endpoint implicitly needs full details
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Error fetching category" });
    }
  });

  // Add endpoint to update category image (WITH OPTIMIZATION)
  app.put("/api/categories/:id/image", isAdmin, upload.single('image'), async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }
      
      const category = await storage.getCategory(id);
      if (!category) {
        // Clean up uploaded file if category doesn't exist
        try { fs.unlinkSync(req.file.path); } catch (unlinkErr) { console.error("Failed to delete temp upload:", unlinkErr); }
        return res.status(404).json({ message: "Category not found" });
      }

      // Optimize the uploaded image (replace original)
      await optimizeImage(req.file.path, 75, 800); // Optimize category images more aggressively
      
      // Create image URL (using original filename potentially, depends on optimization strategy)
      // Multer saves with a unique name, optimizeImage replaces it.
      const imageUrl = `/uploads/${req.file.filename}`; 
      
      // Update category with image URL
      const updatedCategory = await storage.updateCategory(id, {
        // Spreading category might include old data; be specific or ensure category object is fresh
        image: imageUrl 
      });
      
      res.json(updatedCategory);
    } catch (error) {
      console.error("Error updating category image:", error);
       // Clean up uploaded file on error
      if (req.file) {
         try { fs.unlinkSync(req.file.path); } catch (unlinkErr) { console.error("Failed to delete temp upload on error:", unlinkErr); }
      }
      res.status(500).json({ message: "Error updating category image" });
    }
  });

  // Article routes
  app.get("/api/articles", async (req: Request, res: Response) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Error fetching articles" });
    }
  });

  // Helper function to safely serialize objects to JSON
  const safeJSONStringify = (obj: any) => {
    return JSON.stringify(obj, (key, value) => {
      // Convert Date objects to ISO strings
      if (value instanceof Date) {
        return value.toISOString();
      }
      // Handle circular references or other non-serializable data
      if (typeof value === 'object' && value !== null) {
        if (key === 'password') return undefined; // Don't include passwords
      }
      return value;
    });
  };

  // Function to safely send JSON response with proper headers
  const sendSafeJSONResponse = (res: Response, data: any) => {
    try {
      // Set cache control headers
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Surrogate-Control', 'no-store');
      
      // Set content type explicitly
      res.setHeader('Content-Type', 'application/json');
      
      // Stringify the data safely and send
      const jsonString = safeJSONStringify(data);
      res.end(jsonString);
    } catch (error) {
      console.error('Error sending JSON response:', error);
      // If JSON stringification fails, send a simple error
      res.status(500).send(JSON.stringify({ 
        error: 'Server error while formatting response',
        message: error instanceof Error ? error.message : String(error) 
      }));
    }
  };
  
  // Add a diagnostic endpoint to test database connectivity
  app.get("/api/diagnostics", async (req: Request, res: Response) => {
    try {
      // Try to connect to the database and run a simple query
      const dbConnected = await checkDatabaseConnection();
      
      // Collect environment information (safely, not exposing secrets)
      const envInfo = {
        nodeEnv: process.env.NODE_ENV || 'not set',
        hasSupabaseUrl: !!process.env.SUPABASE_URL,
        hasSupabaseKey: !!process.env.SUPABASE_KEY
      };
      
      sendSafeJSONResponse(res, {
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: {
          connected: dbConnected,
          type: 'Supabase PostgreSQL'
        },
        environment: envInfo
      });
    } catch (error) {
      console.error('Diagnostics error:', error);
      sendSafeJSONResponse(res, {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // Helper function to check database connection
  async function checkDatabaseConnection() {
    try {
      // Try a simple query to verify database connection
      await db.select({ count: sql`COUNT(*)` }).from(categories);
      return true;
    } catch (error) {
      console.error('Database connection check failed:', error);
      return false;
    }
  }

  app.get("/api/articles/featured", async (req: Request, res: Response) => {
    try {
      // Check database connection first
      const dbConnected = await checkDatabaseConnection();
      if (!dbConnected) {
        return sendSafeJSONResponse(res, { 
          error: 'Database connection error', 
          message: 'Failed to connect to the database. Check your Supabase configuration.',
          articles: [] 
        });
      }
      
      const articlesData = await storage.getFeaturedArticles();
      
      // Use a simplified approach with manually created simple structure
      const simplifiedArticles = articlesData.map(article => ({
        id: article.id,
        title: article.title,
        summary: article.summary, // Using the correct field name from schema
        content: article.content,
        slug: article.slug,
        image: article.image,
        publishedAt: article.publishedAt ? new Date(article.publishedAt).toISOString() : null,
        views: article.views || 0,
        featured: article.featured || false,
        authorId: article.authorId,
        categoryId: article.categoryId,
        // Simplify nested objects
        category: article.category ? {
          id: article.category.id,
          name: article.category.name,
          slug: article.category.slug
        } : null,
        author: article.author ? {
          id: article.author.id,
          name: article.author.name,
          username: article.author.username
        } : null
      }));
      
      // Use our safe JSON response helper
      sendSafeJSONResponse(res, { articles: simplifiedArticles });
    } catch (error) {
      console.error("Error fetching featured articles:", error);
      // Use our safe JSON response helper for errors too
      sendSafeJSONResponse(res, { 
        error: 'Failed to fetch featured articles', 
        message: error instanceof Error ? error.message : String(error),
        articles: [] 
      });
    }
  });

  app.get("/api/articles/latest", async (req: Request, res: Response) => {
    try {
      // Check database connection first
      const dbConnected = await checkDatabaseConnection();
      if (!dbConnected) {
        return sendSafeJSONResponse(res, { 
          error: 'Database connection error', 
          message: 'Failed to connect to the database. Check your Supabase configuration.',
          articles: [] 
        });
      }
      
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const articlesData = await storage.getLatestArticles(limit);

      // Use a simplified approach with manually created simple structure
      const simplifiedArticles = articlesData.map(article => ({
        id: article.id,
        title: article.title,
        summary: article.summary,
        content: article.content,
        slug: article.slug,
        image: article.image,
        publishedAt: article.publishedAt ? new Date(article.publishedAt).toISOString() : null,
        views: article.views || 0,
        featured: article.featured || false,
        authorId: article.authorId,
        categoryId: article.categoryId,
        // Simplify nested objects
        category: article.category ? {
          id: article.category.id,
          name: article.category.name,
          slug: article.category.slug
        } : null,
        author: article.author ? {
          id: article.author.id,
          name: article.author.name,
          username: article.author.username
        } : null
      }));
      
      // Use our safe JSON response helper
      sendSafeJSONResponse(res, { articles: simplifiedArticles });
    } catch (error) {
      console.error("Error fetching latest articles:", error);
      // Use our safe JSON response helper for errors too
      sendSafeJSONResponse(res, { 
        error: 'Failed to fetch latest articles', 
        message: error instanceof Error ? error.message : String(error),
        articles: [] 
      });
    }
  });

  app.get("/api/articles/category/:slug", async (req: Request, res: Response) => {
    try {
      const articles = await storage.getArticlesByCategorySlug(req.params.slug);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Error fetching articles by category" });
    }
  });

  // Add a new route to get article by ID
  app.get("/api/articles/id/:id", async (req: Request, res: Response) => {
    try {
      const articleId = parseInt(req.params.id);
      if (isNaN(articleId)) {
        return res.status(400).json({ message: "Invalid article ID" });
      }
      
      const article = await storage.getArticleById(articleId);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      // Increment view count
      await storage.incrementArticleViews(article.id);
      
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Error fetching article" });
    }
  });

  app.get("/api/articles/:slug", async (req: Request, res: Response) => {
    try {
      const article = await storage.getArticleBySlug(req.params.slug);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      // Increment view count
      await storage.incrementArticleViews(article.id);
      
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Error fetching article" });
    }
  });

  app.post("/api/articles", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      const articleData = insertArticleSchema.parse({
        ...req.body,
        authorId: user.id,
      });
      
      const article = await storage.createArticle(articleData);
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid article data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating article" });
    }
  });

  app.put("/api/articles/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      const articleId = parseInt(req.params.id);
      
      // Check if article exists
      const existingArticle = await storage.getArticleById(articleId);
      if (!existingArticle) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      // Check if user is the author or admin
      if (existingArticle.authorId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "You don't have permission to edit this article" });
      }
      
      const articleData = insertArticleSchema.partial().parse(req.body);
      const updatedArticle = await storage.updateArticle(articleId, articleData);
      
      res.json(updatedArticle);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid article data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating article" });
    }
  });

  app.delete("/api/articles/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user as Express.User;
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      const articleId = parseInt(req.params.id);
      
      // Check if article exists
      const existingArticle = await storage.getArticleById(articleId);
      if (!existingArticle) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      // Check if user is the author or admin
      if (existingArticle.authorId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "You don't have permission to delete this article" });
      }
      
      await storage.deleteArticle(articleId);
      res.json({ message: "Article deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting article" });
    }
  });

  // Search route
  app.get("/api/search", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      if (!query || query.length < 2) {
        return res.json([]);
      }
      
      const articles = await storage.searchArticles(query);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Error searching articles" });
    }
  });

  // Newsletter subscription route
  app.post("/api/newsletter/subscribe", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      const subscriberData = insertSubscriberSchema.parse({
        email,
        active: true
      });
      
      const subscriber = await storage.createSubscriber(subscriberData);
      res.status(201).json({ message: "Subscribed successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error subscribing to newsletter" });
    }
  });

  // Contact form route
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const messageData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(messageData);
      res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error sending message" });
    }
  });

  // Admin routes
  app.get("/api/admin/messages", isAdmin, async (req: Request, res: Response) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Error fetching messages" });
    }
  });

  app.put("/api/admin/messages/:id/read", isAdmin, async (req: Request, res: Response) => {
    try {
      const messageId = parseInt(req.params.id);
      const success = await storage.markMessageAsRead(messageId);
      
      if (!success) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      res.json({ message: "Marked as read" });
    } catch (error) {
      res.status(500).json({ message: "Error updating message" });
    }
  });

  app.get("/api/admin/subscribers", isAdmin, async (req: Request, res: Response) => {
    try {
      const subscribers = await storage.getSubscribers();
      res.json(subscribers);
    } catch (error) {
      res.status(500).json({ message: "Error fetching subscribers" });
    }
  });

  app.get("/api/admin/stats", isAdmin, async (req: Request, res: Response) => {
    try {
      // Calculate total page views from article views
      const articles = await typedStorage.getArticles();
      
      // Sum up all article views, handling null values
      const totalPageViews = articles.reduce((sum, article) => {
        return sum + (article.views ?? 0);
      }, 0);
      
      // Create stats response
      const statsResponse = {
        current: {
          totalPageViews: totalPageViews,
          totalUniqueVisitors: Math.floor(totalPageViews * 0.7), // Estimate unique visitors
          avgBounceRate: 35,
          avgSessionDuration: 120
        },
        previous: {
          totalPageViews: Math.floor(totalPageViews * 0.8), // Mock previous period
          totalUniqueVisitors: Math.floor(totalPageViews * 0.7 * 0.8),
          avgBounceRate: 38,
          avgSessionDuration: 110
        }
      };
      
      res.json(statsResponse);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ error: "Failed to fetch dashboard statistics" });
    }
  });

  app.get("/api/debug/article-slugs", isAdmin, async (req: Request, res: Response) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Error", error: String(error) });
    }
  });

  // Add image upload endpoint (WITH OPTIMIZATION) - For Article Images via Editor/Upload Component
  app.post("/api/upload", isAuthenticated, upload.single('image'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Optimize the uploaded image (replace original)
      await optimizeImage(req.file.path); // Use default optimization settings
      
      // Return the URL to the uploaded file
      // Multer saves with a unique name, optimizeImage replaces it.
      const fileUrl = `/uploads/${req.file.filename}`; 
      res.json({ url: fileUrl });
    } catch (error) {
      console.error("Upload error:", error);
       // Clean up uploaded file on error
      if (req.file) {
         try { fs.unlinkSync(req.file.path); } catch (unlinkErr) { console.error("Failed to delete temp upload on error:", unlinkErr); }
      }
      res.status(500).json({ message: "Error uploading file" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
