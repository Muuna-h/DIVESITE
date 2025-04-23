import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { formatDate, getCategoryColor } from "@/lib/utils";
import { Link } from "wouter";
import { Article as ArticleType } from "@shared/schema";
import NewsletterSignup from "@/components/NewsletterSignup";

const Article = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: article, isLoading } = useQuery<ArticleType>({
    queryKey: [`/api/articles/${slug}`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent dark:border-accent dark:border-t-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-lg">
          <i className="fas fa-file-alt text-5xl text-gray-400 dark:text-gray-600 mb-4"></i>
          <h2 className="font-heading text-2xl font-bold mb-2">Article Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The article you're looking for doesn't exist or may have been removed.
          </p>
          <Link href="/">
            <a className="inline-block bg-primary hover:bg-primary-dark dark:bg-accent dark:hover:bg-accent-dark text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300">
              Return Home
            </a>
          </Link>
        </div>
      </div>
    );
  }

  const {
    title,
    content,
    image,
    createdAt,
    author,
    categoryId
  } = article;

  const categorySlug = article.category?.slug || 
    ["it", "software", "hardware", "emerging", "green", "media", "communication", "jobs", "reviews"][categoryId - 1] || 
    "it";
  
  const categoryColors = getCategoryColor(categorySlug);
  const categoryName = article.category?.name || 
    ["Information Technology", "Software Development", "Hardware Technology", "Emerging Technologies", "Green Tech", "Media & Entertainment", "Communication Technology", "Tech Jobs & Internships", "Tech Product Reviews"][categoryId - 1] || 
    "Information Technology";

  return (
    <>
      <Helmet>
        <title>{title} - Dive Tech</title>
        <meta name="description" content={article.summary} />
        <meta property="og:title" content={`${title} - Dive Tech`} />
        <meta property="og:description" content={article.summary} />
        <meta property="og:image" content={image} />
      </Helmet>
      
      <article className="pt-16 bg-white dark:bg-gray-900">
        {/* Hero image */}
        <div className="w-full h-64 md:h-96 overflow-hidden">
          <img 
            src={image || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80"} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Category and date */}
            <div className="flex flex-wrap items-center mb-4">
              <Link href={`/category/${categorySlug}`}>
                <a className={`${categoryColors.bg} ${categoryColors.text} text-xs font-medium px-2.5 py-0.5 rounded mr-3`}>
                  {categoryName}
                </a>
              </Link>
              <span className="text-gray-500 dark:text-gray-400 text-sm">{formatDate(createdAt)}</span>
              
              {author && (
                <span className="text-gray-500 dark:text-gray-400 text-sm ml-auto">
                  By <span className="font-medium">{author.name}</span>
                </span>
              )}
            </div>
            
            {/* Title */}
            <motion.h1 
              className="font-heading text-3xl md:text-5xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {title}
            </motion.h1>
            
            {/* Content */}
            <motion.div 
              className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-heading prose-headings:font-bold prose-a:text-primary dark:prose-a:text-accent prose-img:rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              dangerouslySetInnerHTML={{ __html: content || 'Content not available' }}
            />
            
            {/* Share buttons */}
            <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-heading text-lg font-bold mb-3">Share this article</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                  <i className="fab fa-twitter text-xl"></i>
                  <span className="sr-only">Share on Twitter</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-700 transition-colors">
                  <i className="fab fa-facebook text-xl"></i>
                  <span className="sr-only">Share on Facebook</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-green-600 transition-colors">
                  <i className="fab fa-whatsapp text-xl"></i>
                  <span className="sr-only">Share on WhatsApp</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <i className="fab fa-linkedin text-xl"></i>
                  <span className="sr-only">Share on LinkedIn</span>
                </a>
              </div>
            </div>
            
            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8">
                <h3 className="font-heading text-lg font-bold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <Link key={index} href={`/tag/${tag}`}>
                      <a className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1 rounded-full text-sm transition-colors">
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
