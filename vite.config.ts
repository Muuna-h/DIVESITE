import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  server: {
    port: 3000,
    strictPort: true,
    cors: {
      origin: ["http://localhost:3000", "http://127.0.0.1:3000", "https://divesite.onrender.com"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization", "X-Client-Info"],
      preflightContinue: true
    },
    // Whitelist local and your Render dev domain
    allowedHosts: ["localhost", "127.0.0.1", "divesite.onrender.com"],
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        ws: true
      },
      "/auth/v1": {
        target: "https://hvebqxkzdtwqkztgxdfg.supabase.co",
        changeOrigin: true,
        secure: true,
        ws: true,
        onProxyReq: (proxyReq: any, req: any, _res: any) => {
          // Always set these headers for auth requests
          const origin = req.headers.origin || 'http://localhost:3000';
          proxyReq.setHeader('Origin', origin);
          if (req.method === 'OPTIONS') {
            proxyReq.setHeader('Access-Control-Request-Method', 'POST');
            proxyReq.setHeader('Access-Control-Request-Headers', 'Content-Type, Authorization, X-Client-Info');
          }
        },
        onProxyRes: (proxyRes: any, req: any, res: any) => {
          const origin = req.headers.origin || 'http://localhost:3000';
          // Set CORS headers for all responses
          proxyRes.headers['access-control-allow-origin'] = origin;
          proxyRes.headers['access-control-allow-credentials'] = 'true';
          proxyRes.headers['access-control-allow-methods'] = 'POST, OPTIONS';
          proxyRes.headers['access-control-allow-headers'] = 'Content-Type, Authorization, X-Client-Info';
          proxyRes.headers['access-control-max-age'] = '86400';

          // Handle preflight requests
          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.setHeader('Content-Length', '0');
            res.end();
            return;
          }
        }
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  }
});
