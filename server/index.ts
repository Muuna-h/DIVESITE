import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import compression from "compression";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const app = express();

// Production optimizations
if (process.env.NODE_ENV === 'production') {
  app.use(compression());
  app.set('trust proxy', 1);
  app.disable('x-powered-by');
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up session middleware with Supabase
app.use(session({
  secret: process.env.SESSION_SECRET || 'divetech-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Debug middleware for session
app.use((req, res, next) => {
  console.log('Session ID:', req.sessionID);
  console.log('isAuthenticated:', req.isAuthenticated?.());
  console.log('Session:', req.session);
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// API status endpoint
app.get('/api/status', (req: Request, res: Response) => {
  res.send('🚀 DiveTech backend is running!');
});

// Test database connection using Supabase
app.get('/test-db', async (req, res) => {
  try {
    // Test categories table
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .limit(1);

    if (categoriesError) throw categoriesError;

    // Test articles table
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('*')
      .limit(1);

    if (articlesError) throw articlesError;

    res.json({
      success: true,
      message: 'Supabase connection and tables verified',
      categories: categories.length > 0 ? 'Categories table exists' : 'Categories table is empty',
      articles: articles.length > 0 ? 'Articles table exists' : 'Articles table is empty'
    });
  } catch (error: any) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      message: 'Database error',
      error: error.message
    });
  }
});

// Serve static files from public directory
app.use(express.static(path.join(process.cwd(), 'public')));

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    log(`serving on port ${PORT}`);
  });
})();
