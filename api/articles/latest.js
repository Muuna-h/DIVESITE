import { db } from '../../server/db.js';
import { articles } from '../../shared/schema.js';
import { sql } from 'drizzle-orm';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  // Set the Content-Type header
  res.setHeader('Content-Type', 'application/json');
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Check database connection
    try {
      await db.execute(sql`SELECT 1`);
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return res.status(500).json({ 
        error: 'Database connection error', 
        message: 'Failed to connect to the database. Check your Supabase configuration.',
        articles: [] 
      });
    }
    
    // Fetch latest articles
    const latestArticles = await db.select()
      .from(articles)
      .orderBy(sql`${articles.publishedAt} DESC`)
      .limit(5);
    
    console.log('Returning latest articles:', latestArticles);
    
    // Send a proper JSON response
    return res.status(200).json(latestArticles);
    
  } catch (error) {
    console.error('Error in latest articles API:', error);
    res.status(500).json({ 
      error: 'Server error', 
      message: error.message,
      articles: []
    });
  }
}
