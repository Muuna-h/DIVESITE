import { useParams } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { formatDate, getCategoryColor } from "@/lib/utils";
import { Link } from "wouter";
import NewsletterSignup from "@/components/NewsletterSignup";
import { useEffect, useState } from "react";
import { Article as ArticleType } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Loader2, MessageCircle, PlusCircle } from "lucide-react";
import { useSupabaseAuth } from "@/lib/useSupabaseAuth";

// 👇 Extend the type to include users and categories
type ExtendedArticle = ArticleType & {
  users: {
    id: string;
    name: string;
  };
  categories: {
    id: string;
    name: string;
    slug: string;
  };
};

const Article = () => {
  const { slug } = useParams<{ slug: string }>();
  const [discussionSlug, setDiscussionSlug] = useState<string | null>(null);
  const [isCreatingDiscussion, setIsCreatingDiscussion] = useState(false);
  const { isAuthenticated, user } = useSupabaseAuth();
  const queryClient = useQueryClient();

  const { data: article, isLoading, isError } = useQuery<ExtendedArticle>({
    queryKey: ["article", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*, users:users(*), categories:categories(*)")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Fetch the discussion topic for this article
  useEffect(() => {
    if (!slug) return;
    const fetchDiscussionTopic = async () => {
      const { data } = await supabase
        .from("forum_topics")
        .select("slug")
        .eq("slug", `discuss-${slug}`)
        .single();
      
      if (data) {
        setDiscussionSlug(data.slug);
      }
    };
    
    fetchDiscussionTopic();
  }, [slug]);

  const createDiscussionTopic = async () => {
    if (!article || !user) return;
    setIsCreatingDiscussion(true);
    try {
      // 1. Get the 'article-discussions' category ID
      const { data: categoryData, error: categoryError } = await supabase
        .from('forum_categories')
        .select('id')
        .eq('slug', 'article-discussions')
        .single();

      if (categoryError || !categoryData) throw new Error('Discussion category not found.');

      // 2. Create the new topic
      const newTopic = {
        title: `Discussion: ${article.title}`,
        slug: `discuss-${article.slug}`,
        content: `This is a discussion topic for the article: [${article.title}](/article/${article.slug}). Join the conversation!`,
        authorId: user.id,
        categoryId: categoryData.id,
      };

      const { data: newTopicData, error: topicError } = await supabase
        .from('forum_topics')
        .insert(newTopic)
        .select('slug')
        .single();

      if (topicError) throw topicError;

      if (newTopicData) {
        setDiscussionSlug(newTopicData.slug);
        queryClient.invalidateQueries({ queryKey: ['forumTopics'] });
      }

    } catch (error) {
      console.error("Error creating discussion topic:", error);
      // You could add a toast notification here to inform the user
    } finally {
      setIsCreatingDiscussion(false);
    }
  };

  useEffect(() => {
    if (article?.id) {
      const viewed = JSON.parse(sessionStorage.getItem("viewedArticles") || "[]");
      if (!viewed.includes(article.id)) {
        viewed.push(article.id);
        sessionStorage.setItem("viewedArticles", JSON.stringify(viewed));
        supabase
          .from("articles")
          .update({ views: (article.views || 0) + 1 })
          .eq("id", article.id)
          .then();
      }
    }
  }, [article]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">Loading article...</p>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Failed to load article.</p>
      </div>
    );
  }

  const {
    title,
    content,
    image,
    createdAt,
    users: author,
    categories: category,
    summary,
    tags,
  } = article;

  const categorySlug = category?.slug || "it";
  const categoryColors = getCategoryColor(categorySlug);
  const categoryName = category?.name || "Tech";

  return (
    <>
      <Helmet>
        <title>{title} - Dive Tech</title>
        <meta name="description" content={summary} />
        <meta property="og:title" content={`${title} - Dive Tech`} />
        <meta property="og:description" content={summary} />
        <meta property="og:image" content={image} />
      </Helmet>

      <article className="pt-16 bg-white dark:bg-gray-900">
        <div className="w-full h-64 md:h-96 overflow-hidden">
          <img
            src={image || "/placeholder.jpg"}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center mb-4">
              <Link href={`/category/${categorySlug}`}>
                <a className={`${categoryColors.bg} ${categoryColors.text} text-xs font-medium px-2.5 py-0.5 rounded mr-3`}>
                  {categoryName}
                </a>
              </Link>
              <span className="text-gray-500 dark:text-gray-400 text-sm">{formatDate(createdAt || '')}</span>
              {author && (
                <span className="text-gray-500 dark:text-gray-400 text-sm ml-auto">
                  By <span className="font-medium">{author.name}</span>
                </span>
              )}
            </div>

            <motion.h1
              className="font-heading text-3xl md:text-5xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {title}
            </motion.h1>

            <motion.div
              className="prose sm:prose-lg max-w-none dark:prose-invert prose-headings:font-heading prose-headings:font-bold prose-a:text-primary dark:prose-a:text-accent prose-img:rounded-xl article-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              dangerouslySetInnerHTML={{ __html: content || "Content not available." }}
            />

            <div className="mt-8 flex justify-between items-center">
              {discussionSlug ? (
                <Link href={`/forum/topics/${discussionSlug}`}>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    See Discussion
                  </Button>
                </Link>
              ) : (
                isAuthenticated && (
                  <Button 
                    onClick={createDiscussionTopic}
                    disabled={isCreatingDiscussion}
                    className="bg-gradient-to-r from-green-500 to-teal-600 text-white hover:from-green-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                  >
                    {isCreatingDiscussion ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <PlusCircle className="mr-2 h-5 w-5" />
                    )}
                    Add to Discussion
                  </Button>
                )
              )}
            </div>

            <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-heading text-lg font-bold mb-3">Share this article</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-500">
                  <i className="fab fa-twitter text-xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-700">
                  <i className="fab fa-facebook text-xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-green-600">
                  <i className="fab fa-whatsapp text-xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600">
                  <i className="fab fa-linkedin text-xl" />
                </a>
              </div>
            </div>

            {tags && tags.length > 0 && (
              <div className="mt-8">
                <h3 className="font-heading text-lg font-bold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: string, index: number) => (
                    <Link key={index} href={`/tag/${tag}`}>
                      <a className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1 rounded-full text-sm">
                        #{tag}
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>

      <NewsletterSignup />
    </>
  );
};

export default Article;
