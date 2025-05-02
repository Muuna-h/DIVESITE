import express from "express";

const router = express.Router();

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