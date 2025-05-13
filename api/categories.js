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
        categories: [] 
      });
    }
    
    // Fetch categories
    const { data: allCategories, error } = await supabase
      .from('categories')
      .select('*');
    
    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ 
        error: 'Database query error', 
        message: error.message,
        categories: [] 
      });
    }
    
    console.log('Returning categories:', allCategories);
    
    // Send a proper JSON response
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(allCategories);
    
  } catch (error) {
    console.error('Error in categories API:', error);
    res.status(500).json({ 
      error: 'Server error', 
      message: error.message,
      categories: []
    });
  }
}
