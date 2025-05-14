import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import pgSession from "connect-pg-simple";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import pg from 'pg';
import path from "path";
import cors from 'cors';
const { Pool } = pg;

// Initialize PostgreSQL session store
const PgStore = pgSession(session);

// Create pool with proper typing
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS for development
// CORS Configuration Section
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL || 'https://divetech.vercel.app/' // Update with your actual Vercel domain
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Set up session middleware
app.use(session({
  store: new PgStore({
    pool,
    tableName: 'session' // Use this table for storing session data
  }),
  secret: process.env.SESSION_SECRET || 'asili-kenya-secret', // Use env variable in production
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: false // Set to true in production with HTTPS
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

// API status endpoint instead of root path
app.get('/api/status', (req: Request, res: Response) => {
  res.send('🚀 DiveTech backend is running!');
});

// Test database connection and tables
app.get('/test-db', async (req, res) => {
  const categoriesTable = categories; // Use the categories table from the schema
  const articlesTable = articles; // Use the articles table from the schema

  try {
    // Test categories table
    const categoriesResult = await pool.query(`SELECT * FROM ${categoriesTable} LIMIT 1`);
    // Test articles table
    const articlesResult = await pool.query(`SELECT * FROM ${articlesTable} LIMIT 1`);
    
    res.json({
      success: true,
      message: 'Database connection and tables verified',
      categories: categoriesResult.rows.length > 0 ? 'Categories table exists' : 'Categories table is empty',
      articles: articlesResult.rows.length > 0 ? 'Articles table exists' : 'Articles table is empty'
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

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    log(`serving on port ${PORT}`);
  });
})();
