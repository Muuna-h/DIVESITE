import { Link } from "wouter";
import { motion } from "framer-motion";
import { Article } from "@shared/schema";
import { formatDate, getCategoryColor, getCategoryName } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  // Default to empty values if article properties are undefined
  const {
    title = "Article Title",
    summary = "Article summary goes here",
    slug = "article-slug",
    image = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    createdAt = new Date(),
    categoryId = 1
  } = article;

  const categorySlug = article.category?.slug || 
    ["it", "software", "hardware", "emerging", "green", "media", "communication", "jobs", "reviews"][categoryId - 1] || 
    "it";

  const categoryColors = getCategoryColor(categorySlug);
  const categoryName = article.category?.name || getCategoryName(categorySlug);

  return (
    <motion.div 
      className="bg-secondary dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg zoom-hover h-full flex flex-col"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/article/${slug}`}>
        <a className="block overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
          />
        </a>
      </Link>
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-center mb-2">
          <Link href={`/category/${categorySlug}`}>
            <a className={`${categoryColors.bg} ${categoryColors.text} text-xs font-medium px-2.5 py-0.5 rounded`}>
              {categoryName}
            </a>
          </Link>
          <span className="text-gray-500 dark:text-gray-400 text-sm ml-auto">{formatDate(createdAt)}</span>
        </div>
        <Link href={`/article/${slug}`}>
          <a className="block">
            <h3 className="font-heading text-xl font-bold mb-2 hover:text-primary dark:hover:text-accent transition-colors">
              {title}
            </h3>
          </a>
        </Link>
        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">{summary}</p>
        <Link href={`/article/${slug}`}>
          <a className="mt-auto text-primary dark:text-accent font-medium hover:underline inline-flex items-center">
            Read More <i className="fas fa-arrow-right ml-1 text-xs"></i>
          </a>
        </Link>
      </div>
    </motion.div>
  );
};

export default ArticleCard;
