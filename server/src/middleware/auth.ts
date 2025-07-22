import { Request, Response, NextFunction } from 'express';
import { supabase } from '../../db';
import { users } from '../../../shared/schema';

// Extend Express Request type to include our user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        email: string;
      };
    }
  }
}

/**
 * Middleware to check if a user is authenticated using Supabase
 */
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header is missing' });
    }

    // Get token from Authorization header
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }

    // Get additional user data from our users table
    const { data: userData } = await supabase
      .from('users')
      .select('id, role')
      .eq('email', user.email)
      .single();

    if (!userData) {
      return res.status(401).json({ error: 'User not found in database' });
    }

    // Add user to request object
    if (!user.email) {
      return res.status(401).json({ error: 'User email not found' });
    }

    req.user = {
      id: userData.id,
      role: userData.role,
      email: user.email
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
}

/**
 * Middleware to check if a user has admin role
 */
export async function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    await authMiddleware(req, res, async () => {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden - Admin access required' });
      }
      next();
    });
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
}

/**
 * Middleware to check if a user is authenticated and matches the requested user ID
 * or is an admin
 */
export async function userAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    await authMiddleware(req, res, async () => {
      const requestedUserId = parseInt(req.params.userId);
      const isAdmin = req.user?.role === 'admin';
      const isOwner = req.user?.id ? parseInt(req.user.id) === requestedUserId : false;

      if (!isAdmin && !isOwner) {
        return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
      }

      next();
    });
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
}

/**
 * Middleware to prevent authenticated users from accessing certain routes
 * (e.g., login and register pages)
 */
export async function guestMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return next();
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (!error && user) {
      return res.status(403).json({ error: 'Already authenticated' });
    }

    next();
  } catch (error) {
    next();
  }
}
