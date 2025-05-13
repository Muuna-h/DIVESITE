import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ArticleCard from "./ArticleCard";
import { useQuery } from "@tanstack/react-query";
import { Article } from "@shared/schema";
import { fadeUp, container, scaleUp, scrollTriggerOptions } from "@/utils/animations";
import { Link } from "wouter";

const FeaturedArticles = () => {
  const [position, setPosition] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  
  // Define response type for featured articles
  type FeaturedArticlesResponse = {
    articles: Article[];
    message?: string;
  };

  const { data, isLoading, error } = useQuery<FeaturedArticlesResponse>({
    queryKey: ['/api/articles/featured'],
    queryFn: async () => {
      try {
        // Add cache-busting timestamp parameter to the URL
        const timestamp = new Date().getTime();
        
        // Use the full URL to bypass potential proxying issues
        // Replace with your actual deployed URL or use the current window.location
        const baseUrl = window.location.origin; // Gets the current domain
        // Use the correct API endpoint path with /api prefix
        const apiUrl = `${baseUrl}/api/articles/featured?_t=${timestamp}`;
        
        console.log(`Requesting featured articles from: ${apiUrl}`);
        
        const res = await fetch(apiUrl, {
          // Add stronger cache-busting headers
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Accept': 'application/json'
          }
        });
        
        // Log the response status and headers for debugging
        console.log(`Response status: ${res.status} ${res.statusText}`);
        console.log('Response type:', res.headers.get('content-type'));
        
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
        console.log('Raw API response:', text.substring(0, 100) + '...');
        
        // Try to parse it as JSON, with fallback for JSON embedded in HTML
        let jsonData;
        try {
          // First attempt: direct parse
          try {
            jsonData = JSON.parse(text);
          } catch (directError) {
            // Second attempt: try to extract JSON from HTML
            console.log('Attempting to extract JSON from HTML response...');
            
            // Look for JSON pattern in HTML response (without using 's' flag for compatibility)
            // Try different approach to find JSON in HTML
            const jsonPattern1 = new RegExp('\\{\\s*"articles"\\s*:\\s*\\[([\\s\\S]*?)\\]\\s*\\}');
            const jsonPattern2 = new RegExp('\\{\\s*"categories"\\s*:\\s*\\[([\\s\\S]*?)\\]\\s*\\}');
            
            const jsonMatch = text.match(jsonPattern1) || text.match(jsonPattern2);
                             
            if (jsonMatch) {
              console.log('Found potential JSON in HTML:', jsonMatch[0].substring(0, 50) + '...');
              jsonData = JSON.parse(jsonMatch[0]);
              console.log('Successfully extracted JSON from HTML');
            } else {
              throw new Error('Could not find JSON data in HTML response');
            }
          }
        } catch (error) {
          // Ensure error is treated as an Error object
          const parseError = error instanceof Error ? error : new Error(String(error));
          console.error('JSON parse error with response:', text);
          throw new Error(`Invalid JSON response: ${parseError.message}`);
        }
        
        console.log('Featured Articles API Response:', jsonData);
        return jsonData; // Should be { articles: [...] }
      } catch (err) {
        console.error('Error fetching featured articles:', err);
        throw err;
      }
    },
    retry: 3,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
  
  // Extract articles from the response
  const featuredArticles = data?.articles || [];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerSlide(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerSlide(2);
      } else {
        setItemsPerSlide(3);
      }
      
      if (sliderRef.current) {
        setSliderWidth(sliderRef.current.scrollWidth);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [featuredArticles]);

  console.log("Featured Articles API Response:", { featuredArticles, isLoading, error });

  // Show loading indicator
  if (isLoading && !featuredArticles) {
    return (
      <section id="featured" className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold mb-8 text-center">
            Featured <span className="text-primary dark:text-accent">Articles</span>
          </h2>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary dark:border-accent"></div>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    console.error("Error loading featured articles:", error);
    return (
      <section id="featured" className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold mb-8 text-center">
            Featured <span className="text-primary dark:text-accent">Articles</span>
          </h2>
          <div className="text-center text-red-500 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p>Unable to load featured articles</p>
            <p className="text-sm mt-2">Please try again later</p>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (!featuredArticles || featuredArticles.length === 0) {
    return (
      <section id="featured" className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold mb-8 text-center">
            Featured <span className="text-primary dark:text-accent">Articles</span>
          </h2>
          <div className="text-center p-6">
            <p className="text-gray-600 dark:text-gray-400">No featured articles available.</p>
          </div>
        </div>
      </section>
    );
  }

  const maxPosition = Math.max(0, Math.ceil(featuredArticles.length / itemsPerSlide) - 1);

  const prev = () => {
    setPosition(p => Math.max(0, p - 1));
  };

  const next = () => {
    setPosition(p => Math.min(maxPosition, p + 1));
  };

  const goToSlide = (index: number) => {
    setPosition(index);
  };

  return (
    <motion.section 
      id="featured" 
      className="py-16 bg-white dark:bg-gray-900"
      initial="hidden"
      whileInView="visible"
      viewport={scrollTriggerOptions}
      variants={container}
    >
      <div className="container mx-auto px-4">
        <motion.h2 
          className="font-heading text-3xl font-bold mb-8 text-center"
          variants={fadeUp}
        >
          Featured <span className="text-primary dark:text-accent">Articles</span>
        </motion.h2>
        
        <motion.div className="relative" variants={scaleUp}>
          {/* Slider controls */}
          <motion.button 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg text-primary dark:text-accent hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none" 
            onClick={prev}
            aria-label="Previous articles"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-chevron-left"></i>
          </motion.button>
          
          {/* Featured articles slider */}
          <div className="overflow-hidden px-4 sm:px-12" ref={sliderRef}>
            <motion.div 
              className="flex"
              animate={{ x: `-${position * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {featuredArticles.map((article, index) => (
                <motion.div 
                  key={article.id || index} 
                  className={`w-full flex-shrink-0 p-2 sm:p-4`}
                  style={{ flexBasis: `${100 / itemsPerSlide}%` }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href={`/article/${article.slug}`}>
                    <a>
                      <ArticleCard article={article} />
                    </a>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          <motion.button 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg text-primary dark:text-accent hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none" 
            onClick={next}
            aria-label="Next articles"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-chevron-right"></i>
          </motion.button>
        </motion.div>
        
        {/* Slider dots */}
        <motion.div 
          className="flex justify-center mt-8 space-x-2"
          variants={fadeUp}
        >
          {Array.from({ length: maxPosition + 1 }).map((_, index) => (
            <motion.button 
              key={index}
              className={`h-2.5 w-2.5 rounded-full ${
                position === index 
                  ? 'bg-primary dark:bg-accent' 
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-primary dark:hover:bg-accent'
              }`}
              aria-current={position === index}
              aria-label={`Slide ${index + 1}`}
              onClick={() => goToSlide(index)}
              whileHover={{ scale: 1.5 }}
              whileTap={{ scale: 0.9 }}
            ></motion.button>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FeaturedArticles;
