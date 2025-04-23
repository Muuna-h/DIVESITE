import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Article } from "@shared/schema";
import { getCategoryName, getCategoryColor } from "@/lib/utils";

interface SearchOverlayProps {
  onClose: () => void;
}

const SearchOverlay = ({ onClose }: SearchOverlayProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [_, setLocation] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { data: articles } = useQuery<Article[]>({
    queryKey: ['/api/search', searchTerm],
    enabled: searchTerm.length > 2,
  });
  
  // Close the search overlay when Escape key is pressed
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    
    document.addEventListener("keydown", handleEscapeKey);
    
    // Focus the input when overlay opens
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchTerm)}`);
      onClose();
    }
  };
  
  const handleArticleClick = (slug: string) => {
    setLocation(`/article/${slug}`);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="bg-white dark:bg-gray-800 w-full max-w-3xl rounded-lg shadow-2xl mx-4"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input 
                  ref={inputRef}
                  type="text" 
                  placeholder="Search articles, topics, and more..." 
                  className="w-full p-3 pl-10 pr-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute left-3 top-3 text-gray-400">
                  <i className="fas fa-search"></i>
                </div>
                <button 
                  type="button" 
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  onClick={onClose}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </form>
            
            {searchTerm.length > 2 && (
              <div className="mt-4 max-h-96 overflow-y-auto">
                {articles && articles.length > 0 ? (
                  <div className="space-y-3">
                    {articles.map((article) => {
                      const categorySlug = article.category?.slug || 
                        ["it", "software", "hardware", "emerging", "green", "media", "communication", "jobs", "reviews"][article.categoryId - 1] || 
                        "it";
                      const categoryColors = getCategoryColor(categorySlug);
                      const categoryName = article.category?.name || getCategoryName(categorySlug);
                      
                      return (
                        <motion.div 
                          key={article.id}
                          className="flex items-start p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          onClick={() => handleArticleClick(article.slug)}
                          whileHover={{ x: 3 }}
                        >
                          <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 mr-3">
                            <img 
                              src={article.image || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"} 
                              alt={article.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-heading font-bold text-sm">{article.title}</h4>
                            <div className="flex items-center mt-1">
                              <span className={`${categoryColors.bg} ${categoryColors.text} text-xs px-2 py-0.5 rounded`}>
                                {categoryName}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : articles && articles.length === 0 ? (
                  <div className="text-center p-6 text-gray-500 dark:text-gray-400">
                    <i className="fas fa-search-minus text-3xl mb-2"></i>
                    <p>No results found for "{searchTerm}"</p>
                  </div>
                ) : (
                  <div className="text-center p-6 text-gray-500 dark:text-gray-400">
                    <i className="fas fa-search text-3xl mb-2"></i>
                    <p>Type to search for articles</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchOverlay;
