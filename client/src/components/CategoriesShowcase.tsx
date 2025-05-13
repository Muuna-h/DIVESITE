import { motion } from "framer-motion";
import { Link } from "wouter";
import CategoryCard from "./CategoryCard";
import { container, fadeUp, scrollTriggerOptions } from "@/utils/animations";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";

// Define a type for the API response
type CategoryResponse = {
  categories: Category[];
  message?: string;
};

const CategoriesShowcase = () => {
  // Fetch categories from the API (request full details)
  const { data, isLoading, error } = useQuery<CategoryResponse>({
    queryKey: ['/api/categories?includeDetails=true'],
    queryFn: async () => {
      try {
        // Add cache-busting timestamp parameter to the URL
        const timestamp = new Date().getTime();
        const res = await fetch(`/api/categories?includeDetails=true&_t=${timestamp}`, {
          // Add stronger cache-busting headers
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        if (!res.ok) throw new Error('Network response was not ok');
        
        const jsonData = await res.json();
        console.log('Categories API response:', jsonData);
        return jsonData; // This should now be { categories: [...] }
      } catch (err) {
        console.error('Error fetching categories:', err);
        throw err;
      }
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 3
  });
  
  // Extract categories from the response
  const categories = data?.categories || [];

  return (
    <motion.section 
      id="categories" 
      className="py-16 bg-secondary dark:bg-gray-800"
      initial="hidden"
      whileInView="visible"
      viewport={scrollTriggerOptions}
    >
      <div className="container mx-auto px-4">
        <motion.h2 
          className="font-heading text-3xl font-bold mb-8 text-center"
          variants={fadeUp}
        >
          Explore <span className="text-primary dark:text-accent">Categories</span>
        </motion.h2>
        
        {isLoading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-2"></div>
            <p>Loading categories...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500 dark:text-red-400">
            <p>Error loading categories. Please try again later.</p>
          </div>
        ) : categories && categories.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
          >
            {categories.map((category) => (
              <motion.div 
                key={category.id} 
                variants={fadeUp}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
              >
                <CategoryCard category={category} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No categories found.</p>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default CategoriesShowcase;
