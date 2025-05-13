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
    queryKey: ['/api/categories'],
    queryFn: async () => {
      try {
        // Add cache-busting timestamp parameter to the URL
        const timestamp = new Date().getTime();
        
        // Use the full URL to bypass potential proxying issues
        const baseUrl = window.location.origin;
        const apiUrl = `${baseUrl}/api/categories?includeDetails=true&_t=${timestamp}`;
        
        console.log(`Requesting categories from: ${apiUrl}`);
        
        const res = await fetch(apiUrl, {
          // Add cache-busting headers
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Accept': 'application/json'
          }
        });
        
        // Log the response status and headers for debugging
        console.log(`Categories response status: ${res.status} ${res.statusText}`);
        console.log('Categories response type:', res.headers.get('content-type'));
        
        if (!res.ok) {
          // Check if response is HTML (likely authentication page)
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('text/html')) {
            throw new Error('Authentication error - please check Vercel deployment settings');
          }
          throw new Error(`API error: ${res.status} ${res.statusText}`);
        }
        
        // Attempt to read the response text first for debugging
        const text = await res.text();
        
        // Log raw response for debugging
        console.log('Raw categories API response:', text.substring(0, 100) + '...');
        
        // Try to parse it as JSON, with fallback for JSON embedded in HTML
        let jsonData;
        try {
          // First attempt: direct parse
          try {
            jsonData = JSON.parse(text);
          } catch (directError) {
            // Second attempt: try to extract JSON from HTML
            console.log('Attempting to extract JSON from HTML response for categories...');
            
            // Look for JSON pattern in HTML response (without using 's' flag for compatibility)
            const jsonPattern1 = new RegExp('\\{\\s*"categories"\\s*:\\s*\\[([\\s\\S]*?)\\]\\s*\\}');
            const jsonPattern2 = new RegExp('\\{\\s*"articles"\\s*:\\s*\\[([\\s\\S]*?)\\]\\s*\\}');
            
            const jsonMatch = text.match(jsonPattern1) || text.match(jsonPattern2);
                             
            if (jsonMatch) {
              console.log('Found potential JSON in HTML for categories:', jsonMatch[0].substring(0, 50) + '...');
              jsonData = JSON.parse(jsonMatch[0]);
              console.log('Successfully extracted JSON from HTML for categories');
            } else {
              throw new Error('Could not find categories JSON data in HTML response');
            }
          }
        } catch (error) {
          // Ensure error is treated as an Error object
          const parseError = error instanceof Error ? error : new Error(String(error));
          console.error('JSON parse error with categories response:', text);
          throw new Error(`Invalid JSON response: ${parseError.message}`);
        }
        
        console.log('Categories API Response:', jsonData);
        return jsonData; // Should be { categories: [...] }
      } catch (err) {
        console.error('Error fetching categories:', err);
        throw err;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
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
