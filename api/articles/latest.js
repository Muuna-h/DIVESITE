import { supabase } from '../../server/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get limit from query params or default to 6
    const limit = parseInt(req.query.limit) || 6;

    const { data: articles, error } = await supabase
      .from('articles')
      .select(`
        *,
        category:categories(*),
        author:users(*)
      `)
      .order('publishedAt', { ascending: false })
      .limit(limit);

    if (error) throw error;

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ articles });
  } catch (error) {
    console.error('Error fetching latest articles:', error);
    res.status(500).json({ 
      error: 'Failed to fetch latest articles',
      message: error.message,
      articles: [] 
    });
  }
}