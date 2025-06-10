import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { supabase } from "./db";
import { sql } from "drizzle-orm";
import { categories, articles, users } from "@shared/schema";
import session from "express-session";
import memorystore from "memorystore";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  insertArticleSchema,
  insertUserSchema,
  insertContactMessageSchema,
  insertSubscriberSchema,
  type User as DbUser,
  type InsertUser,
  type Category,
  type InsertCategory,
  type Article,
  type InsertArticle,
  type Subscriber,
  type InsertSubscriber,
  type ContactMessage,
  type InsertContactMessage,
  type SiteStat,
} from "@shared/schema";
import { z } from "zod";
import path from "path";
import fs from "fs";
import { IStorage } from "./storage";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { Buffer } from "buffer";

// Add type for memorystore without using module augmentation
type MemoryStore = ReturnType<typeof memorystore>;

// Type assertion for storage
const typedStorage = storage as IStorage;

// Define Express namespace
declare global {
  namespace Express {
    // Explicitly define User interface based on DbUser type
    interface User {
      id: string;
      username: string;
      name: string | null;
      email: string | null;
      bio: string | null;
      avatar: string | null;
      role: string | null;
      createdAt: Date | null;
      password?: string;
    }
  }
}

// Add this interface near the top with other interfaces
interface MultipartFile {
  filename: string;
  data: Buffer;
  contentType?: string;
}

const MemoryStore = memorystore(session);

// Add this helper function near the top of the file
function sendSafeJSONResponse(res: Response, data: any) {
  try {
    res.json(data);
  } catch (error) {
    console.error("Error sending JSON response:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to send response",
    });
  }
}

// Helper function for image optimization
const optimizeImage = async (
  filePath: string,
  quality: number = 80,
  maxWidth: number = 1200,
) => {
  let tempPath: string | null = null; // Declare tempPath here
  try {
    tempPath = `${filePath}.temp`; // Assign value inside try

    await sharp(filePath)
      .resize({
        width: maxWidth,
        height: maxWidth,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality })
      .toFile(tempPath);

    // Replace original file with optimized version
    fs.renameSync(tempPath, filePath);
    console.log(`Optimized image saved to: ${filePath}`);
  } catch (error) {
    console.error(`Error optimizing image ${filePath}:`, error);
    // Decide if you want to keep the original or delete it on error
    // For now, we keep the original if optimization fails
    if (tempPath) {
      // Check if tempPath was assigned
      try {
        fs.unlinkSync(tempPath);
      } catch {} // Clean up temp file if it exists
    }
  }
};

// Update database check function
async function checkDatabaseConnection() {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("count", { count: "exact", head: true });

    return !error;
  } catch (error) {
    console.error("Database connection check failed:", error);
    return false;
  }
}

// Update file upload helper
async function uploadFileToSupabase(
  file: Buffer,
  fileName: string,
  contentType: string,
  bucket: string = "images"
): Promise<{ url: string; path: string }> {
  try {
    const filePath = `uploads/${uuidv4()}-${fileName}`;
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        contentType,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      url: publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Failed to upload file to storage");
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  app.use(
    session({
      cookie: {
        maxAge: 3600000, // 1 hour in milliseconds
        httpOnly: true, // Recommended for security
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "lax", // Recommended for security
      },
      store: new MemoryStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      rolling: true, // Reset maxAge on every response
      resave: false, // Don't save session if unmodified
      saveUninitialized: false, // Don't create session until something stored
      secret: process.env.SESSION_SECRET || "dive-tech-secret",
    }),
  );

  // Configure passport
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username: string, password: string, done) => {
      try {
        const { data: { user }, error } = await supabase.auth.signInWithPassword({
          email: username,
          password: password,
        });

        if (error || !user) {
          return done(null, false, { message: "Invalid credentials" });
        }

        const { data: profile } = await supabase
          .from("users")
          .select()
          .eq("id", user.id)
          .single();

        if (!profile) {
          return done(null, false, { message: "User profile not found" });
        }

        return done(null, profile);
      } catch (err) {
        return done(err);
      }
    }),
  );

  // Update the passport configuration
  passport.serializeUser((user: Express.User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (user) {
        // Convert id to string to match expected type
        const userWithStringId = { ...user, id: String(user.id) } as Express.User;
        done(null, userWithStringId);
      } else {
        done(null, false);
      }
    } catch (err) {
      done(err);
    }
  });

  // Setup image upload folder
  const uploadDir = path.resolve(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Define routes - prefix all with /api

  // Auth routes
  app.post(
    "/api/auth/login",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { username, password } = req.body;

        const { data: { user }, error } = await supabase.auth.signInWithPassword({
          email: username,
          password: password,
        });

        if (error || !user) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        const { data: profile } = await supabase
          .from("users")
          .select()
          .eq("id", user.id)
          .single();

        (req as any).logIn(profile, (err: Error | null) => {
          if (err) return next(err);
          return res.json({
            user: {
              id: profile.id,
              username: profile.username,
              name: profile.name,
              role: profile.role,
            },
          });
        });
      } catch (error) {
        next(error);
      }
    },
  );

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    (req as any).logout((err: Error | null) => {
      if (err) return res.status(500).json({ message: "Error logging out" });
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization header missing or invalid" });
      }

      const token = authHeader.split(" ")[1];
      const { data, error } = await supabase.auth.getUser(token);

      if (error || !data) {
        console.error("Supabase token validation failed:", error);
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      const user = data.user;

      console.log("User ID:", user.id);
      console.log("User email:", user.email);

      if (!user.email) {
        return res.status(401).json({ message: "User email not found in token" });
      }

      const profile = await storage.getUserByEmail(user.email);
      console.log("Profile fetched:", profile);
      if (!profile) {
        console.error("Profile not found for email:", user.email);
        return res.status(401).json({ message: "User profile not found" });
      }

      res.json({
        user: {
          id: profile.id,
          email: user.email,
          role: profile.role, // Use app role
          username: profile.username,
          name: profile.name,
          avatar: profile.avatar || user.user_metadata?.avatar_url || null,
        },
      });
    } catch (error) {
      console.error("Error validating token:", error);
      res.status(500).json({ message: "Internal server error" });
    }
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
    if ((req as any).isAuthenticated() && (req as any).user?.role === "admin") {
      return next();
    }
    res.status(403).json({ message: "Forbidden" });
  };

  // Category routes
  app.get("/api/categories", async (req: Request, res: Response) => {
    try {
      const includeDetails = req.query.includeDetails === "true";
      const select = includeDetails 
        ? "id,name,slug,description,icon,gradient,image,imageAlt,thumbnailImage,bannerImage,imageMetadata,article_count:articles(count)"
        : "id,name,slug,image";

      interface CategoryResponse {
        id: number;
        name: string;
        slug: string;
        description?: string;
        icon?: string;
        gradient?: string;
        image?: string;
        imageAlt?: string;
        thumbnailImage?: string;
        bannerImage?: string;
        imageMetadata?: unknown;
        article_count?: number;
      }

      const { data: categories, error } = await supabase
        .from("categories")
        .select(select)
        .order("id");

      if (error) throw error;
      
      const simplifiedCategories = (categories as unknown as CategoryResponse[] | null)?.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        image: cat.image,
        ...(includeDetails && {
          description: cat.description,
          icon: cat.icon,
          gradient: cat.gradient,
          imageAlt: cat.imageAlt,
          thumbnailImage: cat.thumbnailImage,
          bannerImage: cat.bannerImage,
          imageMetadata: cat.imageMetadata,
          articleCount: cat.article_count,
        }),
      })) || [];

      res.json({ categories: simplifiedCategories });
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({
        error: "Failed to fetch categories",
        message: error instanceof Error ? error.message : String(error),
        categories: [],
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
  app.put(
    "/api/categories/:id/image",
    isAdmin,
    async (req: Request, res: Response) => {
      try {
        const id = parseInt(req.params.id);

        const chunks: Buffer[] = [];
        req.on("data", (chunk) => chunks.push(chunk));

        await new Promise((resolve, reject) => {
          req.on("end", resolve);
          req.on("error", reject);
        });

        const buffer = Buffer.concat(chunks);
        const boundary = req.headers["content-type"]?.split("boundary=")[1];

        if (!boundary) {
          return res.status(400).json({ message: "Invalid form data" });
        }

        const file = await parseMultipartFormData(buffer, boundary);

        if (!file) {
          return res.status(400).json({ message: "No image file provided" });
        }

        // If file is an array, take the first file
        const singleFile = Array.isArray(file) ? file[0] : file;

        // Optimize the image
        const optimizedBuffer = await sharp(singleFile.data)
          .resize(800, 800, { fit: "inside", withoutEnlargement: true })
          .webp({ quality: 75 })
          .toBuffer();

        // Upload to Supabase
        const result = await uploadFileToSupabase(
          optimizedBuffer,
          singleFile.filename,
          "image/webp",
        );

        // Update category with new image URL
        const updatedCategory = await storage.updateCategory(id, {
          image: result.url,
        });

        res.json(updatedCategory);
      } catch (error) {
        console.error("Error updating category image:", error);
        res.status(500).json({ message: "Error updating category image" });
      }
    },
  );

  // Article routes
  app.get("/api/articles", async (req: Request, res: Response) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Error fetching articles" });
    }
  });

  app.get("/api/articles/featured", async (req: Request, res: Response) => {
    try {
      const dbConnected = await checkDatabaseConnection();
      if (!dbConnected) {
        return sendSafeJSONResponse(res, {
          error: "Database connection error",
          message: "Failed to connect to the database",
          articles: [],
        });
      }

      const { data: articles, error } = await supabase
        .from("articles")
        .select(
          `
          *,
          category:categories(*),
          author:users(*)
        `,
        )
        .eq("featured", true)
        .order("published_at", { ascending: false });

      if (error) throw error;

      const simplifiedArticles = articles.map((article) => ({
        id: article.id,
        title: article.title,
        summary: article.summary,
        content: article.content,
        slug: article.slug,
        image: article.image,
        publishedAt: article.publishedAt
          ? new Date(article.publishedAt).toISOString()
          : null,
        views: article.views || 0,
        featured: article.featured || false,
        authorId: article.authorId,
        categoryId: article.categoryId,
        category: article.category
          ? {
              id: article.category.id,
              name: article.category.name,
              slug: article.category.slug,
            }
          : null,
        author: article.author
          ? {
              id: article.author.id,
              name: article.author.name,
              username: article.author.username,
            }
          : null,
      }));

      sendSafeJSONResponse(res, { articles: simplifiedArticles });
    } catch (error) {
      console.error("Error fetching featured articles:", error);
      sendSafeJSONResponse(res, {
        error: "Failed to fetch featured articles",
        message: error instanceof Error ? error.message : String(error),
        articles: [],
      });
    }
  });

  app.get("/api/articles/latest", async (req: Request, res: Response) => {
    try {
      // Check database connection first
      const dbConnected = await checkDatabaseConnection();
      if (!dbConnected) {
        return sendSafeJSONResponse(res, {
          error: "Database connection error",
          message:
            "Failed to connect to the database. Check your Supabase configuration.",
          articles: [],
        });
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const articlesData = await storage.getLatestArticles(limit);
      const simplifiedArticles = (articlesData || []).map((article) => ({
        id: article.id,
        title: article.title,
        summary: article.summary,
        content: article.content,
        slug: article.slug,
        image: article.image,
        publishedAt: article.publishedAt
          ? new Date(article.publishedAt).toISOString()
          : null,
        views: article.views || 0,
        featured: article.featured || false,
        authorId: article.author_id,
        categoryId: article.category_id,
        category: article.category
          ? {
              id: article.category.id,
              name: article.category.name,
              slug: article.category.slug,
            }
          : null,
        author: article.author
          ? {
              id: article.author.id,
              name: article.author.name,
              username: article.author.username,
            }
          : null,
      }));

      // Use our safe JSON response helper
      sendSafeJSONResponse(res, { articles: simplifiedArticles });
    } catch (error) {
      console.error("Error fetching latest articles:", error);
      // Use our safe JSON response helper for errors too
      sendSafeJSONResponse(res, {
        error: "Failed to fetch latest articles",
        message: error instanceof Error ? error.message : String(error),
        articles: [],
      });
    }
  });

  app.get(
    "/api/articles/category/:slug",
    async (req: Request, res: Response) => {
      try {
        const { data: category, error: categoryError } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", req.params.slug)
          .single();

        if (categoryError || !category) {
          return res.status(404).json({ message: "Category not found" });
        }

        const { data: articles, error: articlesError } = await supabase
          .from("articles")
          .select(
            `
          *,
          category:categories(*),
          author:users(*)
        `,
          )
          .eq("categoryId", category.id)
          .order("publishedAt", { ascending: false });

        if (articlesError) throw articlesError;
        res.json(articles);
      } catch (error) {
        res
          .status(500)
          .json({ message: "Error fetching articles by category" });
      }
    },
  );

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
      const { data: article, error } = await supabase
        .from("articles")
        .select(
          `
          *,
          category:categories(*),
          author:users(*)
        `,
        )
        .eq("slug", req.params.slug)
        .single();

      if (error || !article) {
        return res.status(404).json({ message: "Article not found" });
      }

      // Increment view count using RPC
      await supabase.rpc("increment_article_views", { article_id: article.id });

      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Error fetching article" });
    }
  });

  app.post(
    "/api/articles",
    isAuthenticated,
    async (req: Request, res: Response) => {
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
          return res
            .status(400)
            .json({ message: "Invalid article data", errors: error.errors });
        }
        res.status(500).json({ message: "Error creating article" });
      }
    },
  );

  app.put(
    "/api/articles/:id",
    isAuthenticated,
    async (req: Request, res: Response) => {
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
        if (String(existingArticle.author_id) !== user.id && user.role !== "admin") {
          return res
            .status(403)
            .json({
              message: "You don't have permission to edit this article",
            });
        }

        const articleData = insertArticleSchema.partial().parse(req.body);
        const updatedArticle = await storage.updateArticle(
          articleId,
          articleData,
        );

        res.json(updatedArticle);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res
            .status(400)
            .json({ message: "Invalid article data", errors: error.errors });
        }
        res.status(500).json({ message: "Error updating article" });
      }
    },
  );

  app.delete(
    "/api/articles/:id",
    isAuthenticated,
    async (req: Request, res: Response) => {
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
        if (String(existingArticle.author_id) !== user.id && user.role !== "admin") {
          return res
            .status(403)
            .json({
              message: "You don't have permission to delete this article",
            });
        }

        await storage.deleteArticle(articleId);
        res.json({ message: "Article deleted successfully" });
      } catch (error) {
        res.status(500).json({ message: "Error deleting article" });
      }
    },
  );

  // Search route
  app.get("/api/search", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      if (!query || query.length < 2) {
        return res.json([]);
      }

      const { data: articles, error } = await supabase
        .from("articles")
        .select(
          `
          *,
          category:categories(*),
          author:users(*)
        `,
        )
        .textSearch("title", query, { config: "english" })
        .order("publishedAt", { ascending: false });

      if (error) throw error;
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

      const { data: subscriber, error } = await supabase
        .from("subscribers")
        .insert({
          email,
          active: true,
          createdAt: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      res.status(201).json({ message: "Subscribed successfully" });
    } catch (error) {
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
        return res
          .status(400)
          .json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error sending message" });
    }
  });

  // Admin routes
  app.get("/api/admin/stats", isAdmin, async (req: Request, res: Response) => {
    try {
      const { data: statsData, error: statsError } = await supabase.rpc(
        "get_site_stats",
        { timeframe: "30d" },
      );

      if (statsError) throw statsError;

      const { data: articles, error: articlesError } = await supabase
        .from("articles")
        .select("views");

      if (articlesError) throw articlesError;

      const totalViews = articles.reduce(
        (sum, article) => sum + (article.views || 0),
        0,
      );

      res.json({
        current: {
          ...statsData,
          totalPageViews: totalViews,
        },
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ error: "Failed to fetch dashboard statistics" });
    }
  });

  app.get(
    "/api/admin/messages",
    isAdmin,
    async (req: Request, res: Response) => {
      try {
        const { data: messages, error } = await supabase
          .from("contact_messages")
          .select()
          .order("createdAt", { ascending: false });

        if (error) throw error;
        res.json(messages);
      } catch (error) {
        res.status(500).json({ message: "Error fetching messages" });
      }
    },
  );

  app.get(
    "/api/admin/subscribers",
    isAdmin,
    async (req: Request, res: Response) => {
      try {
        const subscribers = await storage.getSubscribers();
        res.json(subscribers);
      } catch (error) {
        res.status(500).json({ message: "Error fetching subscribers" });
      }
    },
  );

  app.get(
    "/api/debug/article-slugs",
    isAdmin,
    async (req: Request, res: Response) => {
      try {
        const articles = await storage.getArticles();
        res.json(articles);
      } catch (error) {
        res.status(500).json({ message: "Error", error: String(error) });
      }
    },
  );

  // Replace the existing upload endpoints with these:

  // Single file upload endpoint
  app.post(
    "/api/upload",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        // Parse the multipart form data
        const chunks: Buffer[] = [];
        req.on("data", (chunk) => chunks.push(chunk));

        await new Promise((resolve, reject) => {
          req.on("end", resolve);
          req.on("error", reject);
        });

        const buffer = Buffer.concat(chunks);
        const boundary = req.headers["content-type"]?.split("boundary=")[1];

        if (!boundary) {
          return res.status(400).json({ message: "Invalid form data" });
        }

        // Parse the file from the multipart data
        const file = await parseMultipartFormData(buffer, boundary);

        if (!file) {
          return res.status(400).json({ message: "No file uploaded" });
        }

        // If file is an array, take the first file
        const singleFile = Array.isArray(file) ? file[0] : file;

        // Optimize the image
        const optimizedBuffer = await sharp(singleFile.data)
          .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();

        // Upload to Supabase
        const result = await uploadFileToSupabase(
          optimizedBuffer,
          singleFile.filename,
          "image/webp",
        );

        res.json(result);
      } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Error uploading file" });
      }
    },
  );

  // Article images upload endpoint
  app.post(
    "/api/articles/:id/images",
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const chunks: Buffer[] = [];
        req.on("data", (chunk) => chunks.push(chunk));

        await new Promise((resolve, reject) => {
          req.on("end", resolve);
          req.on("error", reject);
        });

        const buffer = Buffer.concat(chunks);
        const boundary = req.headers["content-type"]?.split("boundary=")[1];

        if (!boundary) {
          return res.status(400).json({ message: "Invalid form data" });
        }

        // Parse files from multipart data
        const files = await parseMultipartFormData(buffer, boundary, true);

        if (!files || (Array.isArray(files) && files.length === 0)) {
          return res.status(400).json({ message: "No files uploaded" });
        }

        const filesArray = Array.isArray(files) ? files : [files];
        const uploadPromises = filesArray.map(async (file) => {
          // Optimize image
          const optimizedBuffer = await sharp(file.data)
            .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();

          // Upload to Supabase
          return uploadFileToSupabase(
            optimizedBuffer,
            file.filename,
            "image/webp",
          );
        });

        const uploadResults = await Promise.all(uploadPromises);

        // Update article with new image URLs if needed
        if (uploadResults.length === 2) {
          await storage.updateArticle(parseInt(req.params.id), {
            image: uploadResults[0].url,
            topImage: uploadResults[1].url,
          });
        }

        res.json(uploadResults);
      } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Error uploading files" });
      }
    },
  );

  // Helper function to parse multipart form data
  async function parseMultipartFormData(
    buffer: Buffer,
    boundary: string,
    multiple = false,
  ): Promise<MultipartFile | MultipartFile[] | null> {
    try {
      const parts = buffer.toString().split(`--${boundary}`);
      const files: MultipartFile[] = [];

      for (const part of parts) {
        if (!part || part === "--\r\n" || part === "--") continue;

        const match = part.match(/filename="([^"]+)"/);
        if (!match) continue;

        const filename = match[1];
        const contentTypeMatch = part.match(/Content-Type: ([^\r\n]+)/);
        const contentType = contentTypeMatch ? contentTypeMatch[1] : undefined;

        // Find the start of file data (after double CRLF)
        const dataStart = part.indexOf("\r\n\r\n") + 4;
        const fileData = Buffer.from(part.slice(dataStart, -2), "binary");

        files.push({ filename, data: fileData, contentType });
      }

      if (files.length === 0) return null;
      return multiple ? files : files[0];
    } catch (error) {
      console.error("Error parsing multipart form data:", error);
      return null;
    }
  }

  const httpServer = createServer(app);
  return httpServer;
}
