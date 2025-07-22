import { Router } from "express";
import { supabase } from "../../db";
import { createSlug } from "../../../shared/utils";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// Get all forum categories
router.get("/categories", async (req, res) => {
  try {
    const { data: categories, error } = await supabase
      .from('forum_categories')
      .select('*')
      .order('name');

    if (error) throw error;
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: "Failed to fetch forum categories" });
  }
});

// Get topics by category
router.get("/categories/:slug/topics", async (req, res) => {
  try {
    // First get the category
    const { data: category, error: categoryError } = await supabase
      .from('forum_categories')
      .select('id')
      .eq('slug', req.params.slug)
      .single();

    if (categoryError || !category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Then get the topics with author and reply count
    const { data: topics, error: topicsError } = await supabase
      .from('forum_topics')
      .select(`
        *,
        author:users (
          id,
          username,
          avatar
        ),
        replies:forum_replies (
          id
        )
      `)
      .eq('categoryId', category.id)
      .order('isPinned', { ascending: false })
      .order('createdAt', { ascending: false });

    if (topicsError) throw topicsError;

    // Transform the data to include reply count
    const transformedTopics = topics?.map(topic => ({
      ...topic,
      replyCount: topic.replies?.length || 0,
      replies: undefined // Remove the replies array since we only need the count
    }));

    res.json(transformedTopics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ error: "Failed to fetch topics" });
  }
});

// Get a single topic with its replies
router.get("/topics/:slug", async (req, res) => {
  try {
    // Get topic with author and category
    const { data: topic, error: topicError } = await supabase
      .from('forum_topics')
      .select(`
        *,
        author:users (
          id,
          username,
          avatar
        ),
        category:forum_categories (
          id,
          name,
          slug
        )
      `)
      .eq('slug', req.params.slug)
      .single();

    if (topicError || !topic) {
      return res.status(404).json({ error: "Topic not found" });
    }

    // Get replies for the topic
    const { data: replies, error: repliesError } = await supabase
      .from('forum_replies')
      .select(`
        *,
        author:users (
          id,
          username,
          avatar
        )
      `)
      .eq('topicId', topic.id)
      .order('createdAt', { ascending: true });

    if (repliesError) throw repliesError;

    // Increment view count
    const { error: updateError } = await supabase
      .from('forum_topics')
      .update({ views: (topic.views || 0) + 1 })
      .eq('id', topic.id);

    if (updateError) throw updateError;

    res.json({ ...topic, replies });
  } catch (error) {
    console.error('Error fetching topic:', error);
    res.status(500).json({ error: "Failed to fetch topic" });
  }
});

// Create a new topic
router.post("/topics", authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { title, content, categoryId } = req.body;
    const slug = createSlug(title);

    // Check if slug already exists
    const { data: existingTopic } = await supabase
      .from('forum_topics')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existingTopic) {
      return res.status(400).json({ error: "A topic with this title already exists" });
    }

    const { data: newTopic, error } = await supabase
      .from('forum_topics')
      .insert({
        title,
        slug,
        content,
        categoryId,
        authorId: req.user.id,
      })
      .select('*, author:users(*)')
      .single();

    if (error) throw error;
    res.status(201).json(newTopic);
  } catch (error) {
    console.error('Error creating topic:', error);
    res.status(500).json({ error: "Failed to create topic" });
  }
});

// Create a reply
router.post("/topics/:topicId/replies", authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { content } = req.body;
    const topicId = parseInt(req.params.topicId);

    // Check if topic exists and is not locked
    const { data: topic } = await supabase
      .from('forum_topics')
      .select('isLocked')
      .eq('id', topicId)
      .single();

    if (!topic) {
      return res.status(404).json({ error: "Topic not found" });
    }

    if (topic.isLocked) {
      return res.status(403).json({ error: "Topic is locked" });
    }

    const { data: newReply, error } = await supabase
      .from('forum_replies')
      .insert({
        content,
        topicId,
        authorId: req.user.id,
      })
      .select('*, author:users(*)')
      .single();

    if (error) throw error;
    res.status(201).json(newReply);
  } catch (error) {
    console.error('Error creating reply:', error);
    res.status(500).json({ error: "Failed to create reply" });
  }
});

// Mark reply as solution
router.patch("/replies/:replyId/solution", authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const replyId = parseInt(req.params.replyId);

    // Get reply and its topic
    const { data: reply } = await supabase
      .from('forum_replies')
      .select(`
        *,
        topic:forum_topics (
          authorId
        )
      `)
      .eq('id', replyId)
      .single();

    if (!reply) {
      return res.status(404).json({ error: "Reply not found" });
    }

    // Only topic author can mark a reply as solution
    if (reply.topic.authorId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { data: updatedReply, error } = await supabase
      .from('forum_replies')
      .update({ isSolution: true })
      .eq('id', replyId)
      .select('*, author:users(*)')
      .single();

    if (error) throw error;
    res.json(updatedReply);
  } catch (error) {
    console.error('Error marking reply as solution:', error);
    res.status(500).json({ error: "Failed to mark reply as solution" });
  }
});

export default router;
