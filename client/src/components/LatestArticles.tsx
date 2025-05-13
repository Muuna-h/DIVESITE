import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "wouter";
import ArticleCard from "./ArticleCard";
import { Article } from "@shared/schema";
import { container, fadeUp, scrollTriggerOptions } from "@/utils/animations";

// Define response type for latest articles
type LatestArticlesResponse = {
  articles: Article[];
  message?: string;
};

const LatestArticles = () => {
  const { data, isLoading, error } = useQuery<LatestArticlesResponse>({
    queryKey: ['/api/articles/latest'],
    queryFn: async () => {
      try {
        // Add cache-busting timestamp parameter to the URL
        const timestamp = new Date().getTime();
        const res = await fetch(`/api/articles/latest?_t=${timestamp}`, {
          // Add stronger cache-busting headers
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        if (!res.ok) throw new Error('Network response was not ok');
        
        const jsonData = await res.json();
        console.log('Latest Articles API Response:', jsonData);
        return jsonData; // Should now be { articles: [...] }
      } catch (err) {
        console.error('Error fetching latest articles:', err);
        throw err;
      }
    },
    retry: 3,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
  
  // Extract articles from the response
  const latestArticles = data?.articles || [];

  // Only show loading state if we're actively fetching
  if (isLoading && !latestArticles) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold mb-8 text-center">
            Latest <span className="text-primary dark:text-accent">Articles</span>
          </h2>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary dark:border-accent"></div>
          </div>
        </div>
      </section>
    );
  }

  // Show error state if there's an error
  if (error) {
    console.error("Error loading latest articles:", error);
    return (
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold mb-8 text-center">
            Latest <span className="text-primary dark:text-accent">Articles</span>
          </h2>
          <div className="text-center p-6 rounded-lg bg-red-50 dark:bg-red-900/20">
            <p className="text-red-600 dark:text-red-400 mb-2">Unable to load latest articles</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Please try again later</p>
          </div>
        </div>
      </section>
    );
  }

  // If no data was returned, show empty state
  if (!latestArticles || latestArticles.length === 0) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold mb-8 text-center">
            Latest <span className="text-primary dark:text-accent">Articles</span>
          </h2>
          <div className="text-center p-6">
            <p className="text-gray-600 dark:text-gray-400">No articles available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <motion.section 
      className="py-16 bg-white dark:bg-gray-900"
      initial="hidden"
      whileInView="visible"
      viewport={scrollTriggerOptions}
    >
      <div className="container mx-auto px-4">
        <motion.h2 
          className="font-heading text-3xl font-bold mb-8 text-center"
          variants={fadeUp}
        >
          Latest <span className="text-primary dark:text-accent">Articles</span>
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
        >
          {latestArticles.map((article, index) => (
            <motion.div 
              key={article.id || index} 
              variants={fadeUp}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <ArticleCard article={article} />
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="text-center mt-12"
          variants={fadeUp}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/articles">
              <a className="inline-block bg-primary hover:bg-primary-dark dark:bg-accent dark:hover:bg-accent-dark text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 shadow-lg">
                View All Articles
              </a>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default LatestArticles;
