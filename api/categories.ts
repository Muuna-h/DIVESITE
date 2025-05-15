import { supabase } from '../server/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get includeDetails from query params
    const includeDetails = req.query.includeDetails === 'true';
    
    // Select fields based on includeDetails flag
    const select = includeDetails ? '*' : 'id,name,slug';
    
    const { data: categories, error } = await supabase
      .from('categories')
      .select(select);

    if (error) throw error;

    // Process the results to ensure they are serializable
    const processedCategories = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      ...(includeDetails && {
        description: cat.description || null,
        icon: cat.icon || null,
        gradient: cat.gradient || null,
        image: cat.image || null
      })
    }));

    // Set headers and return response
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ 
      categories: processedCategories 
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ 
      error: 'Failed to fetch categories',
      message: error.message,
      categories: [] 
    });
  }
}