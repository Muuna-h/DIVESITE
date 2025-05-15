import { supabase } from '../../server/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { data: articles, error } = await supabase
      .from('articles')
      .select(`
        *,
        category:categories(*),
        author:users(*)
      `)
      .eq('featured', true)
      .order('publishedAt', { ascending: false });

    if (error) throw error;

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ articles });
  } catch (error) {
    console.error('Error fetching featured articles:', error);
    res.status(500).json({ 
      error: 'Failed to fetch featured articles',
      message: error.message,
      articles: [] 
    });
  }
}