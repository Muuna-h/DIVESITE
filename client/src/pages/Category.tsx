import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import ArticleCard from "@/components/ArticleCard";
import { getCategoryIcon, getCategoryName, getCategoryDescription, getCategoryGradient } from "@/lib/utils";
import { Article } from "@shared/schema";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const categoryName = getCategoryName(slug);
  const categoryDescription = getCategoryDescription(slug);
  const categoryIcon = getCategoryIcon(slug);
  const categoryGradient = getCategoryGradient(slug);
  
  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: [`/api/articles/category/${slug}`],
  });

  return (
    <>
      <Helmet>
        <title>{categoryName} - Dive Tech</title>
        <meta name="description" content={`Explore the latest articles on ${categoryName}: ${categoryDescription}`} />
        <meta property="og:title" content={`${categoryName} - Dive Tech`} />
        <meta property="og:description" content={`Explore the latest articles on ${categoryName}: ${categoryDescription}`} />
      </Helmet>
      
      <div className="pt-16 pb-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-8 mb-12">
            <div className={`${categoryGradient} w-24 h-24 rounded-full flex items-center justify-center shadow-lg`}>
              <i className={`fas ${categoryIcon} text-white text-4xl`}></i>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="font-heading text-4xl font-bold mb-2">{categoryName}</h1>
              <p className="text-gray-600 dark:text-gray-300 max-w-3xl">{categoryDescription}</p>
            </div>
          </div>
          
          {isLoading ? (
            <div className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent dark:border-accent dark:border-t-transparent"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Loading articles...</p>
            </div>
          ) : articles && articles.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {articles.map((article) => (
                <motion.div key={article.id} variants={item}>
                  <ArticleCard article={article} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="py-12 text-center">
              <i className="fas fa-folder-open text-5xl text-gray-400 dark:text-gray-600 mb-4"></i>
              <h3 className="font-heading text-2xl font-bold mb-2">No Articles Found</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We haven't published any articles in this category yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Category;
