import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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
    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase configuration missing');
      return res.status(500).json({ 
        error: 'Configuration error', 
        message: 'Supabase configuration is missing',
        articles: [] 
      });
    }
    
    // Fetch latest articles
    const { data: latestArticles, error } = await supabase
      .from('articles')
      .select('*')
      .order('publishedAt', { ascending: false })
      .limit(5);
    
    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ 
        error: 'Database query error', 
        message: error.message,
        articles: [] 
      });
    }
    
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
