import express from "express";
import { supabase } from "../../db";
import { createSlug } from "../../../shared/utils";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

// Create new article with automatic discussion topic
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content, categoryId, summary, image, tags, featured } = req.body;
    const slug = createSlug(title);
    const authorId = req.user?.id;

    if (!authorId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Validate required fields for mobile-friendly error handling
    if (!title || !content || !categoryId) {
      return res.status(400).json({ 
        error: "Missing required fields",
        details: {
          title: !title ? "Title is required" : null,
          content: !content ? "Content is required" : null,
          categoryId: !categoryId ? "Category is required" : null
        }
      });
    }

    // Start a Supabase transaction
    const { data: article, error: articleError } = await supabase.from('articles').insert({
      title,
      slug,
      content,
      categoryId,
      summary,
      image,
      tags,
      featured,
      authorId
    }).select().single();

    if (articleError) throw articleError;

    // Automatically create a discussion topic for the article
    const { data: topic, error: topicError } = await supabase.from('forum_topics').insert({
      title: `Discussion: ${title}`,
      slug: `discuss-${slug}`,
      content: `This is a discussion thread for the article "${title}". Feel free to share your thoughts and questions about the article here.

Original Article: [${title}](/article/${slug})

${summary}`,
      authorId,
      categoryId: process.env.ARTICLE_DISCUSSION_CATEGORY_ID, // You'll need to set this up in your env
      isLocked: false,
      views: 0
    }).select().single();

    if (topicError) {
      console.error('Error creating discussion topic:', topicError);
      // Don't fail the article creation if topic creation fails
    }

    return res.status(201).json({
      success: true,
      article,
      discussionTopic: topic || null,
      message: "Article created successfully"
    });
  } catch (error) {
    console.error('Error creating article:', error);
    return res.status(500).json({ 
      error: "Failed to create article",
      message: "An internal server error occurred. Please try again later."
    });
  }
});

// Get articles with mobile-optimized pagination
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    
    // Mobile-friendly limit (smaller for mobile)
    const isMobile = req.headers['user-agent']?.toLowerCase().includes('mobile');
    const actualLimit = isMobile ? Math.min(limit, 5) : limit;

    const { data: articles, error } = await supabase
      .from('articles')
      .select(`
        id,
        title,
        slug,
        summary,
        image,
        created_at,
        updated_at,
        views,
        featured,
        categories(name, slug),
        profiles(username, avatar)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + actualLimit - 1);

    if (error) throw error;

    // Get total count for pagination
    const { count } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true });

    return res.json({
      success: true,
      articles: articles || [],
      pagination: {
        page,
        limit: actualLimit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / actualLimit),
        hasNext: offset + actualLimit < (count || 0),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return res.status(500).json({ 
      error: "Failed to fetch articles",
      message: "Unable to load articles at this time"
    });
  }
});

// Add this new endpoint for incrementing views with mobile optimization
router.post("/:id/view", async (req, res) => {
  try {
    const articleId = parseInt(req.params.id);
    
    if (isNaN(articleId)) {
      return res.status(400).json({ 
        error: "Invalid article ID",
        message: "Please provide a valid article ID"
      });
    }
    
    // Get the current article
    const { data: article, error: fetchError } = await supabase
      .from('articles')
      .select('id, views')
      .eq('id', articleId)
      .single();
    
    if (fetchError || !article) {
      return res.status(404).json({ 
        error: "Article not found",
        message: "The requested article could not be found"
      });
    }
    
    // Increment the views count
    const { data: updatedArticle, error: updateError } = await supabase
      .from('articles')
      .update({ views: (article.views || 0) + 1 })
      .eq('id', articleId)
      .select('views')
      .single();
    
    if (updateError) throw updateError;
    
    return res.status(200).json({ 
      success: true, 
      views: updatedArticle.views,
      message: "View count updated"
    });
  } catch (error) {
    console.error("Error incrementing article views:", error);
    return res.status(500).json({ 
      error: "Failed to increment article views",
      message: "Unable to update view count at this time"
    });
  }
});

// Get single article with mobile-optimized response
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    
    const { data: article, error } = await supabase
      .from('articles')
      .select(`
        *,
        categories(id, name, slug),
        profiles(username, avatar, bio)
      `)
      .eq('slug', slug)
      .single();

    if (error || !article) {
      return res.status(404).json({ 
        error: "Article not found",
        message: "The requested article could not be found"
      });
    }

    return res.json({
      success: true,
      article
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    return res.status(500).json({ 
      error: "Failed to fetch article",
      message: "Unable to load the article at this time"
    });
  }
});

export default router;