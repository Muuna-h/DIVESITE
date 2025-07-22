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
      article,
      discussionTopic: topic || null
    });
  } catch (error) {
    console.error('Error creating article:', error);
    return res.status(500).json({ error: "Failed to create article" });
  }
});

// Add this new endpoint for incrementing views
router.post("/:id/view", async (req, res) => {
  try {
    const articleId = parseInt(req.params.id);
    
    // Get the current article
    const article = await req.app.locals.prisma.article.findUnique({
      where: { id: articleId }
    });
    
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    
    // Increment the views count
    const updatedArticle = await req.app.locals.prisma.article.update({
      where: { id: articleId },
      data: { 
        views: (article.views || 0) + 1 
      }
    });
    
    return res.status(200).json({ success: true, views: updatedArticle.views });
  } catch (error) {
    console.error("Error incrementing article views:", error);
    return res.status(500).json({ error: "Failed to increment article views" });
  }
});

export default router; 